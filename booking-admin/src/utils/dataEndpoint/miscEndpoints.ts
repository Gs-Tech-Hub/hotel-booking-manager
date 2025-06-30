/* eslint-disable */
import ApiHandler from "@/utils/dataEndpoint/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const miscEndpoints = {
  async createProductCount(productCountData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "product-counts", 
      data: productCountData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  getProductCounts(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return apiHandlerInstance.fetchData(`product-counts${queryString}`);
  },
  async getJobApplications(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`job-applications${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createSportAndFitness(sportData: any) { 
    const result = await apiHandlerInstance.createData({ 
      endpoint: "sport-and-fitness", 
      data: sportData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
};
