/* eslint-disable */
import ApiHandler from "@/utils/dataEndpoint/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const sportMembershipsEndpoints = {
  async getSportMemberships(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`sport-memberships${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createSportMembership(membershipData: any) {
    const result = await apiHandlerInstance.createData({
      endpoint: "sport-memberships",
      data: membershipData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async updateSportMembership(membershipId: string | number, membershipData: any) {   
    const result = await apiHandlerInstance.updateData({
      endpoint: "sport-memberships",
      id: membershipId,
      updatedData: membershipData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async deleteSportMembership(membershipId: string | number) {    
    const result = await apiHandlerInstance.deleteData({
      endpoint: "Sport-memberships",
      id: membershipId,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getSportMembershipById(membershipId: string | number) {
    const result = await apiHandlerInstance.fetchData(`sport-memberships/${membershipId}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getSportMembershipsByCategory(category: string, params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`sport-memberships/category/${category}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  } 
};
// This code defines a set of endpoints for managing gym memberships, including fetching, creating, updating, and deleting memberships, as well as retrieving memberships by ID or category. It uses an instance of ApiHandler to handle API requests and responses. The endpoints are designed to work with a RESTful API structure.