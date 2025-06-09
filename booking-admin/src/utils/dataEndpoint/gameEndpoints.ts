/* eslint-disable */
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const gameEndpoints = {
  async getGamesList(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`games${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createGame(gameData: any) {
    const result = await apiHandlerInstance.createData({
      endpoint: "games",
      data: gameData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async updateGame(gameId: string | number, gameData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: "games",
      id: gameId,
      updatedData: gameData, 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async deleteGame(gameId: string | number) {
    const result = await apiHandlerInstance.deleteData({
      endpoint: "games",
      id: gameId,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
};
