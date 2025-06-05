/* eslint-disable */
import { OrderItem, ConnectedItem, PaymentMethod, Order } from "@/types/order";
import { strapiService } from "../dataEndPoint";

export const createBookingItemForDepartment = async ({
  items,
  productCountIds,
  paymentMethod,
  drinks = null,
  food_items = null,
  hotel_services = null,
  gym_memberships = null,
  sport_memberships = null,
  discountPrice =null,
  finalPrice = null
}: {
  department: string;
  items: OrderItem[];
  productCountIds: number[];
  paymentMethod: PaymentMethod;
  drinks?: ConnectedItem[] | null;
  food_items?: ConnectedItem[] | null;
  hotel_services?: ConnectedItem[] | null;
  gym_memberships?: ConnectedItem[] | null;
  sport_memberships?: ConnectedItem[] | null;
  discountPrice?: number | null;
  finalPrice?: number | null;
}) => {
  try {
    console.log("Starting createBookingItemForDepartment...");

    // Calculate department total
    // console.log("order.discountPrice", discountPrice);
    const deptTotal =  items.reduce((sum, item) => (sum + item.price * item.quantity - (discountPrice ?? 0)), 0);
    // console.log("Department Total:", deptTotal);

    // Helper function to convert to id array
    const toIdArray = (data: any): { id: string }[] | null => {
      if (!data) return null;
      if (Array.isArray(data)) {
        return data.map(item => ({ id: String(item.id) }));
      }
      // Fallback for single object
      return [{ id: String(data.id) }];
    };

    // Log the input data
    // console.log("Input Data - Items:", items);
    // console.log("Input Data - Product Count IDs:", productCountIds);
    // console.log("Input Data - Payment Method:", paymentMethod);
    // console.log("Input Data - Drinks:", drinks);
    // console.log("Input Data - Food Items:", food_items);
    // console.log("Input Data - Hotel Services:", hotel_services);

    // Create the payload
    const bookingItemPayload = {
      quantity: items.reduce((sum, item) => sum + item.quantity, 0),
      drinks: toIdArray(drinks),
      food_items: toIdArray(food_items),
      hotel_services: toIdArray(hotel_services),
      gym_membership: toIdArray(gym_memberships),
      sport_membership: toIdArray(sport_memberships),
      product_count: {
        connect: productCountIds.map(id => ({ id }))
      },
      amount_paid: deptTotal,
      payment_type: paymentMethod.id,
      status: 'completed',
      menu_category: null,
    };

    console.log("Booking Item Payload:", bookingItemPayload);

    // Create the booking item
    const res = await strapiService.createBookingItem(bookingItemPayload);
    // console.log("Booking item created:", res);

    return res;
  } catch (error) {
    // console.error("Error in createBookingItemForDepartment:", error);
    throw error; // Rethrow the error to be handled by calling code if needed
  }
};
