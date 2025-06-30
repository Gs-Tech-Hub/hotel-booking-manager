/* eslint-disable */
import ApiHandler from "@/utils/dataEndpoint/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const roomEndpoints = {
  async getRooms(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`rooms${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
};
