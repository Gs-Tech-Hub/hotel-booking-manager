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
  productCountId?: { productCountId: number }[];
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
  productCountIds: {productCountId: number }[];
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
        productCountId: item.productCountId?.map(pc => ({ productCountId: pc.id })) || [],
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

        // Only one employee order per department if discount applies
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

      // Filter and sanitize productCountIds for this department
      const departmentProductCounts = items
        .flatMap(item => item.productCountId || [])
        .filter(pc => typeof pc.productCountId === 'number');

      if (!departmentProductCounts.length) {
        throw new Error(`No valid product_count IDs provided for ${department} booking item.`);
      }

      if (department === 'Bar') {
        drinks = await fetchAndCollect(items, strapiService.getDrinksList, 'drinks');

        // Deduct bar stock
        for (const item of items) {
          const drink = drinks.find(d => d.documentId === item.documentId);
          if (drink) {
            const newStock = (drink.bar_stock ?? 0) - item.quantity;
            if (newStock < 0) throw new Error(`Not enough stock for drink: ${item.name}`);
            await strapiService.updateDrinksList(drink.id, { bar_stock: newStock });
          }
        }
      } else if (department === 'Restaurant') {
        food_items = await fetchAndCollect(items, strapiService.getFoodItems, 'food_items');
      } else if (department === 'Hotel-Services') {
        hotel_services = await fetchAndCollect(items, strapiService.getHotelServices, 'hotel_services');
      }

      const bookingItemPayload = {
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        drinks,
        food_items,
        product_count: { connect: departmentProductCounts.map(pc => ({ id: pc.productCountId })) },
        hotel_services,
        amount_paid: deptTotal,
        payment_type: paymentMethod.id,
        status: 'completed',
        menu_category: null,
        single_orders: items.map(item => ({ connect: { id: item.id } })), // Ensure item.id is Strapi ID
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
    console.log('Order created:', orderRes);

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
