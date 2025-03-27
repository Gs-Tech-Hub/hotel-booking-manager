
import qs from "qs";
import  ApiHandler  from "@/utils/apiHandler";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

const apiHandlerInstance = ApiHandler({ baseUrl });

export const strapiService = {
  async fetch(endpoint: string, params?: Record<string, string | number | boolean>) {
    const queryString = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    const result = await apiHandlerInstance.fetchData(`${endpoint}${queryString}`);

    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async post(endpoint: string, body: any) {
    const result = await apiHandlerInstance.createData({ endpoint, data: body });

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

  // Helper functions following apiHandler structure for on-the-fly creation
  async createBooking(bookingData: any) {
    const booking = await this.post("boookings", bookingData);
    return booking;
  },

  async createTransaction(transactionData: any) {
    const transaction = await this.post("transactions", transactionData);
    return transaction;
  },

  async createOrGetCustomer(customerData: any) {
    const query = qs.stringify({
      filters: {
        email: {
          $eq: customerData.email,
        },
      },
    });
    const existing = await this.fetch(`customers?${query}`);

    if (existing && existing.length > 0) {
      return existing[0].id;
    }
    const customer = await this.createCustomer(customerData);
    console.log(customerData);
    return customer.id;
  },
  
  async createCustomer(customerData: any) {
    const customer = await this.post("customers", customerData);
    return customer;
  },

  async createOrGetBooking(bookingData: any) {
    // Optionally, check if a booking exists or just create
    const booking = await this.createBooking(bookingData);
    return booking.id;
  }
};
