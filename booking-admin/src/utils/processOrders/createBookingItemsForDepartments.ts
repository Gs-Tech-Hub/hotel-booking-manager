import { OrderItem, ConnectedItem, PaymentMethod } from "@/types/order";
import { strapiService } from "../dataEndPoint";

export const createBookingItemForDepartment = async ({
    department,
    items,
    productCountIds,
    paymentMethod,
    drinks = null,
    food_items = null,
    hotel_services = null,
  }: {
    department: string;
    items: OrderItem[];
    productCountIds: number[];
    paymentMethod: PaymentMethod;
    drinks?: ConnectedItem[] | null;
    food_items?: ConnectedItem[] | null;
    hotel_services?: ConnectedItem[] | null;
  }) => {
    const deptTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    const toIdArray = (data: any): { id: string }[] | null => {
        if (!data) return null;
        if (Array.isArray(data)) {
          return data.map(item => ({ id: String(item.id) }));
        }
        // Fallback for single object
        return [{ id: String(data.id) }];
      };
      
      const bookingItemPayload = {
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        drinks: toIdArray(drinks),
        food_items: toIdArray(food_items),
        hotel_services: toIdArray(hotel_services),
        product_count: {
          connect: productCountIds.map(id => ({ id })),
        },
        amount_paid: deptTotal,
        payment_type: paymentMethod.id,
        status: 'completed',
        menu_category: null,
      };
      
  
    return await strapiService.createBookingItem(bookingItemPayload);
  };