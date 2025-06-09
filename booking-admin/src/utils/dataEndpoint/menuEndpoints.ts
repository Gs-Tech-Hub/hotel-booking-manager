/* eslint-disable */
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const menuEndpoints = {
  async getDrinksList(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`drinks${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async updateDrinksList(drinkId: string | number, drinkData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: "drinks",
      id: drinkId,
      updatedData: drinkData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getMenuCategory(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`menu-categories${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getFoodItems(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`food-items${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getRestaurants(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`restaurants${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getBarAndClubs(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`bar-and-clubs${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getHotelServices(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`hotel-services${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
};
