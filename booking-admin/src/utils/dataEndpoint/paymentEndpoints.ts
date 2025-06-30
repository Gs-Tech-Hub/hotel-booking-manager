/* eslint-disable */
import ApiHandler from "@/utils/dataEndpoint/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const paymentEndpoints = {
  async createTransaction(paymentData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "payments", 
      data: paymentData 
    });
    if (result.error) throw new Error(result.error);
    return result.data.documentId;
  },
  async getTransactions(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`payments${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
};
