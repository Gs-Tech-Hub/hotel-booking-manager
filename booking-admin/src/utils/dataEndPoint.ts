import qs from "qs";
import ApiHandler from "@/utils/apiHandler";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

interface BookingItemPayload {
  quantity: number;
  food_items: string | null;
  drinks: string | null;
  menu_category: string; 
}

// Main service function
export const strapiService = {
  async fetch(endpoint: string, params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`${endpoint}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async post(endpoint: string, body: any) {
    const result = await apiHandlerInstance.createData({ endpoint, data: body });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async put(endpoint: string, id: string | number, body: any) {
    const result = await apiHandlerInstance.updateData({ endpoint, id, updatedData: body });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async delete(endpoint: string, id: string | number) {
    const result = await apiHandlerInstance.deleteData({ endpoint, id });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  buildUrl(endpoint: string, params?: Record<string, string | number | boolean>) {
    const url = new URL(`${baseUrl}/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  },

  // Booking related methods
  async createBooking(bookingData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "bookings", 
      data: bookingData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async createOrGetBooking(bookingData: any) {
    const booking = await this.createBooking(bookingData);
    return booking.documentId;
  },

  async createBookingItem(itemData: BookingItemPayload) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "booking-items", 
      data: itemData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

 async findCustomerByPhoneOrEmail(input: any) {
    const query = qs.stringify({
      filters: {
        $or: [
          { email: { $eq: input } },
          { phone: { $eq: input } },
        ]
      }
    });
    const result = await apiHandlerInstance.fetchData(`customers?${query}`);
    if (result.error) throw new Error(result.error);
  
    return result.data?.[0] || null;
  },
  

  // Customer related methods
  async createCustomer(customerData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "customers", 
      data: customerData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async createOrGetCustomer(customerData: any) {
    const query = qs.stringify({
      filters: {
        $or: [
          { email: { $eq: customerData.email } },
          { phone: { $eq: customerData.phone } },
        ]
      }      
    });
    const result = await apiHandlerInstance.fetchData(`customers?${query}`);
    if (result.error) throw new Error(result.error);
    
    const existing = result.data;
    if (existing && existing.length > 0) {
      return existing[0].documentId;
    }
    const customer = await this.createCustomer(customerData);
    return customer.documentId;
  },

  // Payment related methods
  async createTransaction(paymentData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "payments", 
      data: paymentData 
    });
    if (result.error) throw new Error(result.error);
    return result.data.documentId;
  },

  // Menu related methods
  async getDrinksList(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`drinks${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

   // Games related methods
   async getGamesList(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`games${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

   // Add a new game
   async createGame(gameData: any) {
    const result = await apiHandlerInstance.createData({
      endpoint: "games",
      data: gameData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  // Update an existing game
  async updateGame(gameId: string | number, gameData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: "games",
      id: gameId,
      updatedData: gameData, 
    });
  
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  

  // Delete a game
  async deleteGame(gameId: string | number) {
    const result = await apiHandlerInstance.deleteData({
      endpoint: "games",
      id: gameId,
      
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  // Additional utility methods can be added here following the same pattern
};

