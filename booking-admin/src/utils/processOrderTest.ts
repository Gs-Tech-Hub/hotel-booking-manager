/* eslint-disable */
// import { strapiService } from '@/utils/dataEndPoint';
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
      console.log('=== Starting order processing ===');
      console.log('Order data:', order);
      console.log('Discount Price:', order.discountPrice);
      console.log('Selected Staff ID:', order.selectedStaffId);
  
      const bookingItems: { id: string }[] = [];
      const employeeOrders: any[] = [];
  
      const itemsByDepartment = order.items.reduce((acc, item) => {
        const dept = item.department || 'General';
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(item);
        return acc;
      }, {} as { [key: string]: OrderItem[] });
  
      const mockFetch = async (params: any) => {
        return [{ id: `mocked-${params['filters[documentId][$eq]']}` }];
      };
  
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
  
          if (order.discountPrice && order.selectedStaffId) {
            const discountPayload: any = {
              quantity: item.quantity,
              amount: item.price * item.quantity,
              discount: order.discountPrice,
              staff: { connect: { id: order.selectedStaffId } },
            };
            discountPayload[type] = { connect: { id: found.id } };
  
            console.log(`Adding employee order for ${type}:`, discountPayload);
            employeeOrders.push(discountPayload);
          } else {
            console.log(`Skipping employee order for ${type}: missing discount or staff ID`);
          }
        }
        return ids;
      };
  
      let totalOrderAmount = 0;
  
      for (const [department, items] of Object.entries(itemsByDepartment)) {
        console.log(`=== Processing department: ${department} ===`);
  
        const deptTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalOrderAmount += deptTotal;
  
        let drinks: ConnectedItem[] | null = null;
        let food_items: ConnectedItem[] | null = null;
        let hotel_services: ConnectedItem[] | null = null;
  
        if (department === 'Bar') {
          drinks = await fetchAndCollect(items, mockFetch, 'drinks');
        }
  
        if (department === 'Restaurant') {
          food_items = await fetchAndCollect(items, mockFetch, 'food_items');
        }
  
        if (department === 'Hotel-Services') {
          hotel_services = await fetchAndCollect(items, mockFetch, 'hotel_services');
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
  
        console.log('Mock creating booking item with payload:', bookingItemPayload);
        const bookingItemRes = { id: `mock-booking-item-${department}` };
        bookingItems.push({ id: bookingItemRes.id });
      }
  
      const orderPayload = {
        order_status: 'Completed',
        total: totalOrderAmount,
        users_permissions_user: { connect: { id: waiterId } },
        booking_items: { connect: bookingItems },
        ...(customerId && { customer: { connect: { id: customerId } } }),
      };
  
      console.log('Mock creating final order with payload:', orderPayload);
      const orderRes = { documentId: 'mock-order-id-123' };
      console.log('Mock final order created:', orderRes);
  
      if (employeeOrders.length > 0) {
        console.log(`=== Processing ${employeeOrders.length} employee orders ===`);
        for (const empOrder of employeeOrders) {
          console.log('Mock creating employee order:', empOrder);
          if (empOrder.amount > 0) {
            console.log('Mock employee order created:', empOrder);
          } else {
            console.log('Skipped employee order due to 0 amount:', empOrder);
          }
        }
      } else {
        console.log('No employee orders to process.');
      }
  
      return { success: true, orderId: orderRes.documentId };
  
    } catch (error) {
      console.error('Order processing failed:', error);
      return { success: false, error };
    }
  };
  