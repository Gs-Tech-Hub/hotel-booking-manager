import qs from "qs";
import ApiHandler from "@/utils/apiHandler";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

interface BookingItemPayload {
  quantity: number;
  food_items: string | null;
  drinks: string | null;
  menu_category: string; // This should store the documentId from MenuType
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

  buildUrl(endpoint: string, params?: Record<string, string | number | boolean>) {
    const url = new URL(`${baseUrl}/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  },

  uploadFile: async function (file: File): Promise<number | null> {
    const formData = new FormData();
    formData.append("files", file);
  
    const response = await apiHandlerInstance.uploadToStrapi({
      endpoint: "upload",
      data: formData,
    });
  
    return response?.[0]?.id ?? null;
  },
  
  

  async  createJobApplication (formData: any) {
    const jobApplication = await this.post('job-applications', formData,);
    return jobApplication;
  },
  

  async createBooking(bookingData: any) {
    const booking = await this.post("boookings", bookingData);
    return booking;
  },

  async createTransaction(paymentData: any) {
    const payment = await this.post("payments", paymentData);
    return payment.documentId;
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
    const existing = await this.fetch(`customers?${query}`);
    if (existing && existing.length > 0) {
      return existing[0].documentId;
    }
    const customer = await this.createCustomer(customerData);
    return customer.documentId;
  },

  async createCustomer(customerData: any) {
    return await this.post("customers", customerData);
  },

  // Refactored function to create a single booking item
async createBookingItem( itemData: BookingItemPayload) {
  const result = await apiHandlerInstance.createData({
    endpoint: "booking-items",
    data: itemData,
  });
  if (result.error) throw new Error(result.error);
  return result.data.id;
},

  // Master booking creation handler
  async createOrGetBooking(bookingData: any) {
    const booking = await this.createBooking(bookingData);
    return booking.documentId;
  },
     
};
