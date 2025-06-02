import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const sportsAndFitnessEndpoints = {
  async getSportsAndFitnessList(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`gym-and-sports${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createSportAndFitness(sportData: any) {
    const result = await apiHandlerInstance.createData({
      endpoint: "gym-and-sports",
      data: sportData
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async updateSportAndFitness(sportId: string, sportData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: `gym-and-sports/${sportId}`,
      id: sportId,
      updatedData: sportData
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  } ,
 async getSportAndFitnessById(sportId: string) {
    const result = await apiHandlerInstance.fetchData(`gym-and-sports/${sportId}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  } ,
  async getSportAndFitnessByCategory(category: string, params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`gym-and-sports/category/${category}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
}