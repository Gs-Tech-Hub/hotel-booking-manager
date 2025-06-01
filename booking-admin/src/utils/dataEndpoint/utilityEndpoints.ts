// Utility endpoints (findDrinkByDocumentId, buildUrl, fetch, post, put, delete)
import qs from "qs";
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const utilityEndpoints = {
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
  async findDrinkByDocumentId(documentId: string, drinkId: number | string) {
    const query = qs.stringify({
      filters: {
        documentId: {
          $eq: documentId,
        },
      },
      populate: ['drinks'],
      encodeValuesOnly: true,
    });
    const result = await apiHandlerInstance.fetchData(`bar-and-clubs?${query}`);
    if (result.error) throw new Error(result.error?.message || 'Failed to fetch bar data');
    const bar = result.data?.[0];
    if (!bar) throw new Error(`Bar with documentId "${documentId}" not found`);
    const drink = bar.drinks?.find((d: any) => d.id === Number(drinkId));
    if (!drink) throw new Error(`Drink with ID ${drinkId} not found in bar "${documentId}"`);
    return drink;
  },
};
