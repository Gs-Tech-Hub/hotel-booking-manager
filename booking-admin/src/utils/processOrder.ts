/* eslint-disable */
import { strapiService } from '@/utils/dataEndPoint';
import { PaymentMethod, Order } from '@/app/stores/useOrderStore';

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

        // Handle discounts and staff ID
        if (order.discountPrice && order.selectedStaffId && order.finalPrice) {
          console.log(`discount present: ${order.discountPrice}`);
          const discountPayload: any = {
            amount_paid: order.finalPrice,
            discount_amount: order.discountPrice,
            total: order.totalAmount,
            users_permissions_user: { connect: { id: order.selectedStaffId } },
          };
          discountPayload[type] = { connect: { id: found.id } };
          employeeOrders.push(discountPayload);
          console.log(`Employee order created:`, JSON.stringify(employeeOrders, null, 2));        }
      }
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

      if (department === 'Bar') {
        drinks = await fetchAndCollect(items, strapiService.getDrinksList, 'drinks');
      }

      if (department === 'Restaurant') {
        food_items = await fetchAndCollect(items, strapiService.getFoodItems, 'food_items');
      }

      if (department === 'Hotel-Services') {
        hotel_services = await fetchAndCollect(items, strapiService.getHotelServices, 'hotel_services');
      }

      const bookingItemPayload = {
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        drinks,
        food_items,
        hotel_services,
        amount_paid: deptTotal,
        payment_type: paymentMethod.id,
        status: null,
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
