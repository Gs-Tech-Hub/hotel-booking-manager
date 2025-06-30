/* eslint-disable */
import ApiHandler from "@/utils/dataEndpoint/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const checkInEndpoints = {
  async getCheckIns(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`check-ins${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createCheckIn(checkInData: any) {   
    const result = await apiHandlerInstance.createData({
      endpoint: "check-ins",
      data: checkInData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async updateCheckIn(checkInId: string | number, checkInData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: "check-ins",
      id: checkInId,
      updatedData: checkInData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async deleteCheckIn(checkInId: string | number) {
    const result = await apiHandlerInstance.deleteData({
      endpoint: "check-ins",
      id: checkInId,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getCheckInById(checkInId: string | number) {
    const result = await apiHandlerInstance.fetchData(`check-ins/${checkInId}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getCheckInsByMember(memberId: string | number, params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`check-ins/member/${memberId}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getCheckInsByDate(date: string, params?: Record<string, string | number | boolean>) {   
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`check-ins/date/${date}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  } ,
  async getCheckInsByMembershipPlan(planId: string | number, params?: Record<string, string | number | boolean>) {          
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`check-ins/membership-plan/${planId}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  } ,
  async getCheckInsBySport(sportId: string | number, params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`check-ins/sport/${sportId}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
    async getCheckInsByGame(gameId: string | number, params?: Record<string, string | number | boolean>) {
        const queryString = params
        ? '?' + new URLSearchParams(params as Record<string, string>).toString()
        : '';
        const result = await apiHandlerInstance.fetchData(`check-ins/game/${gameId}${queryString}`);
        if (result.error) throw new Error(result.error);
        return result.data;
    },
}