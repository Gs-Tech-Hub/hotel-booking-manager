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
  productCountId?: ({ productCountId: number } | { id: number })[]; // expected structure
}

interface ConnectedItem {
  id: string;
  documentId?: string;
  bar_stock?: number;
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
  productCountIds?: number[];
}) => {
  try {
    console.log('Starting order processing...', order);

    const bookingItems: { id: string }[] = [];
    const employeeOrders: any[] = [];

    const itemsByDepartment = order.items.reduce((acc, item) => {
      const dept = item.department || 'General';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push({
        ...item,
      });
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

        const correctId = found.id;

        if (order.discountPrice && order.selectedStaffId && !employeeOrders.some(e => e[type])) {
          employeeOrders.push({
            discount_amount: order.discountPrice,
            total: order.totalAmount,
            amount_paid: order.finalPrice,
            users_permissions_user: { connect: { id: order.selectedStaffId } },
            [type]: { connect: { id: correctId } },
          });
        }

        ids.push({ id: correctId, documentId: found.documentId, bar_stock: found.bar_stock });
      }

      return ids;
    };

    let totalOrderAmount = 0;

    for (const [department, items] of Object.entries(itemsByDepartment)) {
      const deptTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      totalOrderAmount += deptTotal;

      let drinks: ConnectedItem[] | null = null;
      let food_items: ConnectedItem[] | null = null;
      let hotel_services: ConnectedItem[] | null = null;

      // Extract normalized productCountIds
      const departmentProductCounts = items
        .flatMap(item =>
          (item.productCountId || []).map(pc =>
            'productCountId' in pc ? pc.productCountId : pc.id
          )
        );

      if (!departmentProductCounts.length) {
        throw new Error(`No valid product_count IDs provided for ${department} booking item.`);
      }

      if (department === 'Bar') {
        drinks = await fetchAndCollect(items, strapiService.getDrinksList, 'drinks');
        for (const item of items) {
          const drink = drinks.find(d => d.documentId === item.documentId);
          if (drink) {
            const newStock = (drink.bar_stock ?? 0) - item.quantity;
            if (newStock < 0) throw new Error(`Insufficient stock for drink: ${item.name}`);
            await strapiService.updateDrinksList(drink.id, { bar_stock: newStock });
            drink.bar_stock = newStock;
          }
        }
      } else if (department === 'Restaurant') {
        food_items = await fetchAndCollect(items, strapiService.getFoodItems, 'food_items');
      } else if (department === 'Hotel-Services') {
        hotel_services = await fetchAndCollect(items, strapiService.getHotelServices, 'hotel_services');
      }

      console.log(`Resolved product_count IDs for ${department}:`, departmentProductCounts);

      const bookingItemPayload = {
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        drinks,
        food_items,
        hotel_services,
        product_count: {
          connect: departmentProductCounts.map(id => ({ id })),
        },
        amount_paid: deptTotal,
        payment_type: paymentMethod.id,
        status: 'completed',
        menu_category: null,
        single_orders: items.length === 1
          ? { connect: { id: items[0].id } }
          : items.map(item => ({ connect: { id: item.id } })),
      };

      const bookingItemRes = await strapiService.createBookingItem(bookingItemPayload);
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

    for (const empOrder of employeeOrders) {
      await strapiService.createEmployeeOrder(empOrder);
    }

    if (order.discountPrice && employeeOrders.length === 0) {
      throw new Error('Order processing failed: Discount exists but no employee orders created.');
    }

    return { success: true, orderId: orderRes.documentId };

  } catch (error) {
    console.error('Order processing failed:', error);
    return { success: false, error };
  }
};
