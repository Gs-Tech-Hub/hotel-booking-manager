/* eslint-disable */
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const gymAndSportSessionsEndpoints = {
  async getGymAndSportSessionsList(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`gym-and-sport-sessions${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  
  async createGymAndSportSession(sessionData: any) {
    const result = await apiHandlerInstance.createData({
      endpoint: "gym-and-sport-sessions",
      data: sessionData
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  
  async updateGymAndSportSession(sessionId: string, sessionData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: `gym-and-sport-sessions/${sessionId}`,
      id: sessionId,
      updatedData: sessionData
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  
  async getGymAndSportSessionById(sessionId: string) {
    const result = await apiHandlerInstance.fetchData(`gym-and-sport-sessions/${sessionId}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  
  async getGymAndSportSessionsByCategory(category: string, params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`gym-and-sport-sessions/category/${category}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  // Additional methods for scheduling..
    async CreateScheduleSession(sessionId: string, scheduleData: any) {
        const result = await apiHandlerInstance.createData({
        endpoint: `schedules`,
        data: scheduleData
        });
        if (result.error) throw new Error(result.error);
        return result.data;
    },
};