/* eslint-disable */
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const gymMembershipsEndpoints = {
  async getGymMemberships(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`gym-memberships${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createGymMembership(membershipData: any) {
    const result = await apiHandlerInstance.createData({
      endpoint: "gym-memberships",
      data: membershipData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async updateGymMembership(membershipId: string | number, membershipData: any) {   
    const result = await apiHandlerInstance.updateData({
      endpoint: "gym-memberships",
      id: membershipId,
      updatedData: membershipData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async deleteGymMembership(membershipId: string | number) {    
    const result = await apiHandlerInstance.deleteData({
      endpoint: "gym-memberships",
      id: membershipId,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getGymMembershipById(membershipId: string | number) {
    const result = await apiHandlerInstance.fetchData(`gym-memberships/${membershipId}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getGymMembershipsByCategory(category: string, params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`gym-memberships/category/${category}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  } 
};
// This code defines a set of endpoints for managing gym memberships, including fetching, creating, updating, and deleting memberships, as well as retrieving memberships by ID or category. It uses an instance of ApiHandler to handle API requests and responses. The endpoints are designed to work with a RESTful API structure.