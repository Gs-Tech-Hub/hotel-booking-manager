/* eslint-disable */
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const membershipPlansEndpoints = {
  async getMembershipPlans(params?: Record<string, string | number | boolean>) {    
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`membership-plans${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createMembershipPlan(planData: any) {       
    const result = await apiHandlerInstance.createData({
      endpoint: "membership-plans",
      data: planData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async updateMembershipPlan(planId: string | number, planData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: "membership-plans",
      id: planId,
      updatedData: planData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async deleteMembershipPlan(planId: string | number) {
    const result = await apiHandlerInstance.deleteData({
      endpoint: "membership-plans",
      id: planId,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
    async getMembershipPlanById(planId: string | number) {
        const result = await apiHandlerInstance.fetchData(`membership-plans/${planId}`);
        if (result.error) throw new Error(result.error);
        return result.data;
    },
}