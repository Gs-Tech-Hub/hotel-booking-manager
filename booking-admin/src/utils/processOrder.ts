/* eslint-disable */
import { strapiService } from '@/utils/dataEndPoint';
import { PaymentMethod } from '@/app/stores/useOrderStore';
import { connect } from 'http2';

interface OrderItem {
  id: number;
  documentId: string;
  name: string;
  price: number;
  quantity: number;
  paymentMethod?: string; 
  department?: string;
  menu_category?: string;
}

interface Order {
  items: OrderItem[];
  status: string;
}

export const processOrder = async ({
  order,
  waiterId,
  customerId = null,
  paymentMethod,
}: {
  order: Order;
  waiterId: string;
  customerId?: string | null;
  paymentMethod: PaymentMethod ;
}) => {
  try {
    console.log('Starting order processing...', order);

    const bookingItems: any[] = [];
    const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const itemsByDepartment = order.items.reduce((acc, item) => {
      const dept = item.department || 'General';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(item);
      return acc;
    }, {} as { [key: string]: OrderItem[] });

    for (const [department, items] of Object.entries(itemsByDepartment)) {
      console.log(`Processing items for department: ${department}`);

      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

      // Handle drinks stock update for Bar department
      if (department === 'Bar') {
        for (const item of items) {
          console.log(`Fetching drink details for document ID: ${item.documentId}...`);

          let drinkRes;
          try {
            drinkRes = await strapiService.getDrinksList({ 'filters[documentId][$eq]': item.documentId });
            console.log('Drink Response:', drinkRes);
          } catch (error) {
            console.error(`Error fetching drink details for document ID ${item.documentId}:`, error);
            throw new Error(`Failed to fetch drink details for document ID ${item.documentId}`);
          }

          if (!drinkRes || drinkRes.length === 0) {
            throw new Error(`Drink with document ID ${item.documentId} not found`);
          }

          const drinkItem = drinkRes[0];
          const currentStock = drinkItem.bar_stock ?? 0;
          const newStock = currentStock - item.quantity;
          console.log(`Current stock for "${item.name}": ${currentStock}`);
          console.log(`Requested quantity for "${item.name}": ${item.quantity}`);

          if (newStock < 0) {
            throw new Error(`Insufficient stock for drink "${item.name}"`);
          }

          try {
            await strapiService.updateDrinksList(drinkItem.documentId, {
              bar_stock: newStock,
            });
            console.log(`Stock updated for "${item.name}": ${currentStock} → ${newStock}`);
          } catch (error) {
            console.error(`Error updating stock for drink "${item.name}":`, error);
            throw new Error(`Failed to update stock for drink "${item.name}"`);
          }
        }
      }

      // === ✅ Fixed Booking-Item Creation Section ===

      let drinks: { id: string }[] | null = null;
      let food_items: { id: string }[] | null = null;
      let hotel_services: { id: string }[] | null = null;
      let games: { id: string }[] | null = null;
      let menu_category: { id: string } | null = null;

      if (department === 'Bar') {
        const drinkIds: { id: string }[] = [];
        for (const item of items) {
          const res = await strapiService.getDrinksList({ 'filters[documentId][$eq]': item.documentId });
          const drink = res?.[0];
          if (!drink) throw new Error(`Drink not found: ${item.documentId}`);
          drinkIds.push({ id: drink.id });
        }
        drinks = drinkIds.length > 0 ? drinkIds : null;
      }

      if (department === 'Restaurant') {
        const foodIds: { id: string }[] = [];
        for (const item of items) {
          const res = await strapiService.getFoodItems({ 'filters[documentId][$eq]': item.documentId });
          const food = res?.[0];
          if (!food) throw new Error(`Food item not found: ${item.documentId}`);
          foodIds.push({ id: food.id });
        }
        food_items = foodIds.length > 0 ? foodIds : null;

        if (items[0]?.menu_category) {
          const catRes = await strapiService.getMenuCategory({
            'filters[documentId][$eq]': items[0].menu_category,
          });
          if (catRes?.[0]) {
            menu_category = { id: catRes[0].id };
          }
        }
      }

      if (department === 'Hotel-Services') {
        const serviceIds: { id: string }[] = [];
        for (const item of items) {
          const res = await strapiService.getHotelServices({ 'filters[documentId][$eq]': item.documentId });
          const service = res?.[0];
          if (!service) throw new Error(`Service not found: ${item.documentId}`);
          serviceIds.push({ id: service.id });
        }
        hotel_services = serviceIds.length > 0 ? serviceIds : null;
      }

      if (department === 'Games') {
        const gameIds: { id: string }[] = [];
        for (const item of items) {
          const res = await strapiService.getGamesList({ 'filters[documentId][$eq]': item.documentId });
          const game = res?.[0];
          console.log('Game Response:', game);
          if (!game) throw new Error(`Game not found: ${item.documentId}`);
          gameIds.push({ id: game.id });
        }
        games = gameIds.length > 0 ? gameIds : null;
      };

      const bookingItemPayload = {
        quantity: totalQuantity,
        drinks,  
        food_items,  
        hotel_services,  
        menu_category,  
        games: games ? { connect: games } : null, // Connect to all game items
        amount_paid: totalAmount,
        payment_type: paymentMethod.id,
        status: null,
      };

      try {
        const bookingItemRes = await strapiService.createBookingItem(bookingItemPayload);
        console.log(`Booking item created for department "${department}":`, bookingItemRes);
        bookingItems.push(bookingItemRes.id);
      } catch (error) {
        console.error(`Error creating booking item for department "${department}":`, error);
        throw new Error(`Failed to create booking item for department "${department}"`);
      }
    }

    // === Final Order Creation ===

  const orderPayload = {
  order_status: "Completed",
  total: totalAmount,   // Total amount for the order
  users_permissions_user:{ connect: {id: waiterId}},     // ID of the waiter handling the order
  booking_items: {
    connect: bookingItems.map(item => ({ id: item }))  // Using connect for booking_items relations
  },
  // customer: { connect: { id: customerId } }, // Connect to customer by their ID
  // payment_type: { connect: { id: paymentTypeId } }, // Connect to payment type by ID (e.g., "bank_transfer")
   ...(customerId && { customer: { connect: { id: customerId } } }), // Ensure customer connection
};

try {
  const orderRes = await strapiService.post('orders', orderPayload);
  console.log('Order created:', orderRes);
  return { success: true, orderId: orderRes.documentId };
} catch (error) {
  console.error('Error creating order:', error);
  throw new Error('Failed to create order');
}



  } catch (error) {
    console.error('Order processing failed:', error);
    return { success: false, error };
  }
};
