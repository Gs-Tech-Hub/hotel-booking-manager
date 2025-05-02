/* eslint-disable */
import { strapiService } from '@/utils/dataEndPoint';
import { PaymentMethod, Order } from '@/app/stores/useOrderStore';

export interface OrderItem {
  id: number;
  documentId: string;
  name: string;
  price: number;
  quantity: number;
  paymentMethod?: string;
  department?: string;
  menu_category?: string;
  productCountId: {productCountId: number }[];
}

interface ConnectedItem {
  id: string;
}

export const processOrder = async ({
  order,
  waiterId,
  customerId = null,
  paymentMethod,
  productCountIds,
}: {
  order: Order;
  waiterId: string;
  customerId?: string | null;
  paymentMethod: PaymentMethod;
  productCountIds: { productCountId: number }[];
}) => {
  try {
    console.log('Starting order processing...', order);

    const bookingItems: { id: string }[] = [];
    const employeeOrders: any[] = [];

    const itemsByDepartment = order.items.reduce((acc, item) => {
      const dept = item.department || 'General';
      if (!acc[dept]) acc[dept] = [];
      const formattedItem = {
        ...item,
        productCountId: item.productCountId ? item.productCountId.map(pc => ({ productCountId: pc.id })) : []
      };
      acc[dept].push(formattedItem);
      return acc;
    }, {} as { [key: string]: OrderItem[] });

    const fetchAndCollect = async (
      items: OrderItem[],
      fetchFn: Function,
      type: string
    ): Promise<ConnectedItem[]> => {
      const ids: ConnectedItem[] = [];
      console.log(`Fetching data for type: ${type}`, items);

      for (const item of items) {
        const res = await fetchFn({ 'filters[documentId][$eq]': item.documentId });
        console.log(`Response for ${type} with documentId ${item.documentId}:`, res);

        const found = res?.[0];
        if (!found) {
          console.error(`${type} not found: ${item.documentId}`);
          throw new Error(`${type} not found: ${item.documentId}`);
        }

        ids.push({ id: found.id });
        console.log(`Collected ID for ${type}:`, found.id);
      }

      console.log(`Final collected IDs for ${type}:`, ids);
      return ids;
    };

    let totalOrderAmount = 0;

    for (const [department, items] of Object.entries(itemsByDepartment)) {
      console.log(`Processing department: ${department}`);

      const deptTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      totalOrderAmount += deptTotal;

      let drinks: ConnectedItem[] | null = null;
      let food_items: ConnectedItem[] | null = null;
      let hotel_services: ConnectedItem[] | null = null;
      let ProductCounts: { productCountId: number }[] = productCountIds.map(item => ({ productCountId: item.productCountId })); 

      if (department === 'Bar') {
        drinks = await fetchAndCollect(items, strapiService.getDrinksList, 'drinks');
      }

      if (department === 'Restaurant') {
        food_items = await fetchAndCollect(items, strapiService.getFoodItems, 'food_items');
      }

      if (department === 'Hotel-Services') {
        hotel_services = await fetchAndCollect(items, strapiService.getHotelServices, 'hotel_services');
      }

      // Extract product_count IDs from props
      productCountIds = items
        .flatMap((item) => item.productCountId || [])
        .map((pc) => ({ productCountId: pc.productCountId })); // Extract the correct productCountId

      console.log('Extracted product_count IDs:', ProductCounts);

      if (!ProductCounts || ProductCounts.length === 0) {
        throw new Error('No valid product_count IDs provided for booking item.');
      }

      const bookingItemPayload = {
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        drinks,
        food_items,
        product_count: { connect: ProductCounts.map(pc => ({ id: pc.productCountId })) }, // Connect correct product_count IDs
        hotel_services,
        amount_paid: deptTotal,
        payment_type: paymentMethod.id,
        status: "completed",
        menu_category: null,
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
        if (empOrder.amount_paid > 0) {
          await strapiService.createEmployeeOrder(empOrder);
          console.log('Employee order created:', empOrder);
        }
      }
    }

    // Ensure all employee orders were processed
    if (order.discountPrice && employeeOrders.length === 0) {
      throw new Error('Order processing failed: Discount price exists but no employee orders were created.');
    }

    return { success: true, orderId: orderRes.documentId };

  } catch (error) {
    console.error('Order processing failed:', error);
    return { success: false, error };
  }
};
