import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const sportsAndFitnessEndpoints = {
  async getSportsAndFitnessList(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`sports-and-fitness${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createSportAndFitness(sportData: any) {
    const result = await apiHandlerInstance.createData({
      endpoint: "sports-and-fitness",
      data: sportData
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async updateSportAndFitness(sportId: string, sportData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: `sports-and-fitness/${sportId}`,
      id: sportId,
      updatedData: sportData
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  } ,
 async getSportAndFitnessById(sportId: string) {
    const result = await apiHandlerInstance.fetchData(`sports-and-fitness/${sportId}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  } ,
  async getSportAndFitnessByCategory(category: string, params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`sports-and-fitness/category/${category}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
}