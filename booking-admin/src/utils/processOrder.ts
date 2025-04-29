/* eslint-disable */
import { strapiService } from '@/utils/dataEndPoint';
import { PaymentMethod } from '@/app/stores/useOrderStore';

interface OrderItem {
  id: number;
  documentId: string;
  name: string;
  price: number;
  quantity: number;
  paymentMethod?: string;
  department?: string;
  menu_category?: string;
  discount?: number;
  selectedStaffId?: string | null;
}

interface Order {
  items: OrderItem[];
  status: string;
  discount: number;
}

interface ConnectedItem {
  id: string;
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
  paymentMethod: PaymentMethod;
}) => {
  try {
    console.log('Starting order processing...', order);

    const bookingItems: { id: string }[] = [];
    const employeeOrders: any[] = [];

    const itemsByDepartment = order.items.reduce((acc, item) => {
      const dept = item.department || 'General';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(item);
      return acc;
    }, {} as { [key: string]: OrderItem[] });

    const fetchAndCollect = async (
      items: OrderItem[],
      fetchFn: Function,
      type: string
    ): Promise<ConnectedItem[]> => {
      const ids: ConnectedItem[] = [];
      for (const item of items) {
        const res = await fetchFn({ 'filters[documentId][$eq]': item.documentId });
        const found = res?.[0];
        if (!found) throw new Error(`${type} not found: ${item.documentId}`);
        ids.push({ id: found.id });

        const amount = item.price * item.quantity;
        if (item.discount && item.selectedStaffId && amount > 0) {
          const discountPayload: any = {
            quantity: item.quantity,
            amount,
            discount: item.discount,
            staff: { connect: { id: item.selectedStaffId } },
          };
          discountPayload[type] = { connect: { id: found.id } };
          employeeOrders.push(discountPayload);
        }
      }
      return ids;
    };

    let totalOrderAmount = 0;

    for (const [department, items] of Object.entries(itemsByDepartment)) {
      console.log(`Processing department: ${department}`);

      const deptTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      totalOrderAmount += deptTotal;
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

      let drinks: ConnectedItem[] | null = null;
      let food_items: ConnectedItem[] | null = null;
      let hotel_services: ConnectedItem[] | null = null;
      let games: ConnectedItem[] | null = null;
      let menu_category: { id: string } | null = null;

      if (department === 'Bar') {
        // Stock update
        for (const item of items) {
          const drinkRes = await strapiService.getDrinksList({ 'filters[documentId][$eq]': item.documentId });
          const drinkItem = drinkRes?.[0];
          if (!drinkItem) throw new Error(`Drink not found: ${item.documentId}`);
          const currentStock = drinkItem.bar_stock ?? 0;
          const newStock = currentStock - item.quantity;

          if (newStock < 0) throw new Error(`Insufficient stock for drink "${item.name}"`);
          await strapiService.updateDrinksList(drinkItem.documentId, { bar_stock: newStock });
          console.log(`Updated stock for "${item.name}": ${currentStock} → ${newStock}`);
        }

        drinks = await fetchAndCollect(items, strapiService.getDrinksList, 'drinks');
      }

      if (department === 'Restaurant') {
        food_items = await fetchAndCollect(items, strapiService.getFoodItems, 'food_items');

        const uniqueCategories = Array.from(new Set(items.map(i => i.menu_category).filter(Boolean)));
        if (uniqueCategories.length > 1) {
          throw new Error('Multiple menu categories found in restaurant order');
        }
        if (uniqueCategories[0]) {
          const catRes = await strapiService.getMenuCategory({ 'filters[documentId][$eq]': uniqueCategories[0] });
          if (catRes?.[0]) {
            menu_category = { id: catRes[0].id };
          }
        }
      }

      if (department === 'Hotel-Services') {
        hotel_services = await fetchAndCollect(items, strapiService.getHotelServices, 'hotel_services');
      }

      if (department === 'Games') {
        games = await fetchAndCollect(items, strapiService.getGamesList, 'games');
      }

      const bookingItemPayload = {
        quantity: totalQuantity,
        drinks,
        food_items,
        hotel_services,
        menu_category,
        games: games ? { connect: games } : null,
        amount_paid: deptTotal,
        payment_type: paymentMethod.id,
        status: null,
      };

      const bookingItemRes = await strapiService.createBookingItem(bookingItemPayload);
      console.log(`Created booking item for ${department}:`, bookingItemRes);
      bookingItems.push({ id: bookingItemRes.id });
    }

    const orderPayload = {
      order_status: 'Completed',
      total: totalOrderAmount,
      users_permissions_user: { connect: { id: waiterId } },
      booking_items: { connect: bookingItems },
      ...(customerId && { customer: { connect: { id: customerId } } }),
    };

    const orderRes = await strapiService.post('orders', orderPayload);
    console.log('Order created:', orderRes);

    if (employeeOrders.length > 0) {
      for (const empOrder of employeeOrders) {
        if (empOrder.amount > 0) {
          await strapiService.createEmployeeOrder(empOrder);
          console.log('Employee order created:', empOrder);
        }
      }
    }

    return { success: true, orderId: orderRes.documentId };

  } catch (error) {
    console.error('Order processing failed:', error);
    return { success: false, error };
  }
};
