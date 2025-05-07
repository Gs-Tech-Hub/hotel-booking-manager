/* eslint-disable */
import { groupItemsByDepartment } from './groupItemsByDepartment';
import { resolveProductCountIds } from './resolveProductcountId';
import { fetchAndConnectItems } from './fetchAndConnectItems';
import { updateDrinkStock } from './updateDrinkStock';
import { createBookingItemForDepartment } from './createBookingItemsForDepartments';
import { strapiService } from '../dataEndPoint';
import { OrderItem, PaymentMethod, Order, ValidatedItem } from '@/types/order';
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
    const itemsByDepartment = groupItemsByDepartment(order.items.map(item => ({
      ...item,
      waiterId: item.waiterId || waiterId,
      customerName: item.customerName || ''
    })));

    let totalOrderAmount = 0;

    for (const [department, items] of Object.entries(itemsByDepartment) as [string, OrderItem[]][]) {
      let drinks = null;
      let food_items = null;
      let hotel_services = null;
      let validatedItems: ValidatedItem[] = [];

      if (department === 'bar') {
        // Step 1: Fetch drinks
        drinks = await fetchAndConnectItems(items, strapiService.getDrinksList, 'drinks', order, employeeOrders);
        validatedItems = (drinks || []).filter(
          item => typeof item.documentId === 'string'
        ) as ValidatedItem[];

        // Step 2: Resolve productCountIds
        const productCountMap = await resolveProductCountIds(items, validatedItems);
        const productCountIds = Array.from(productCountMap.values());

        // Step 3: Update stock
        await updateDrinkStock(items, validatedItems);

        // Step 4: Re-fetch drinks to ensure correct IDs
        const updatedDrinksList = await strapiService.getDrinksList();
        drinks = updatedDrinksList.filter((d: { name: string; id: number; }) =>
          items.some(i => i.name === d.name || i.id === d.id)
        );

        // Step 5: Create booking item with correct data
        const bookingItemRes = await createBookingItemForDepartment({
          department,
          items,
          productCountIds,
          paymentMethod,
          drinks,
          food_items: null,
          hotel_services: null,
        });

        bookingItems.push({ id: bookingItemRes.id });
      } else if (department === 'restaurant') {
        food_items = await fetchAndConnectItems(items, strapiService.getFoodItems, 'food_items', order, employeeOrders);
        validatedItems = (food_items || []) as ValidatedItem[];

        const productCountMap = await resolveProductCountIds(items, validatedItems);
        const productCountIds = Array.from(productCountMap.values());

        const bookingItemRes = await createBookingItemForDepartment({
          department,
          items,
          productCountIds,
          paymentMethod,
          drinks: null,
          food_items,
          hotel_services: null,
        });

        bookingItems.push({ id: bookingItemRes.id });
      } else if (department === 'hotel') {
        hotel_services = await fetchAndConnectItems(items, strapiService.getHotelServices, 'hotel_services', order, employeeOrders);
        validatedItems = (hotel_services || []) as ValidatedItem[];

        const productCountMap = await resolveProductCountIds(items, validatedItems);
        const productCountIds = Array.from(productCountMap.values());

        const bookingItemRes = await createBookingItemForDepartment({
          department,
          items,
          productCountIds,
          paymentMethod,
          drinks: null,
          food_items: null,
          hotel_services,
        });

        bookingItems.push({ id: bookingItemRes.id });
      } else if (department === 'Games') {
        validatedItems = items.map(item => ({
          id: item.id.toString(),
          documentId: item.documentId,
          name: item.name,
        }));

        const productCountMap = await resolveProductCountIds(items, validatedItems);
        const productCountIds = Array.from(productCountMap.values());

        const bookingItemRes = await createBookingItemForDepartment({
          department,
          items,
          productCountIds,
          paymentMethod,
        });

        bookingItems.push({ id: bookingItemRes.id });
      }

      totalOrderAmount += items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    // Final order payload
    const orderPayload = {
      order_status: 'Completed',
      total: totalOrderAmount,
      users_permissions_user: { connect: { id: waiterId } },
      booking_items: { connect: bookingItems },
      ...(customerId && { customer: { connect: { id: customerId } } }),
    };

    const orderRes = await strapiService.post('orders', orderPayload);

    // Create employee orders
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
