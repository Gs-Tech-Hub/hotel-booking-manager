/* eslint-disable */
import ApiHandler from "@/utils/dataEndpoint/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });
import qs from "qs";

export const customerEndpoints = {
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
};
