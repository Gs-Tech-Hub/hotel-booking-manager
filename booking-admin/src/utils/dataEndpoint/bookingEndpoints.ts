/* eslint-disable */
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const bookingEndpoints = {
  async createBooking(bookingData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "boookings", 
      data: bookingData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createOrGetBooking(bookingData: any) {
    const booking = await this.createBooking(bookingData);
    return booking.documentId;
  },
  async updateBooking(bookingId: string | number, bookingData: any) {
    const result = await apiHandlerInstance.updateData({ 
      endpoint: "boookings", 
      id: bookingId, 
      updatedData: bookingData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getBookings(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`boookings${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createBookingItem(itemData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "booking-items", 
      data: itemData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getBookingItems(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`booking-items${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
};
