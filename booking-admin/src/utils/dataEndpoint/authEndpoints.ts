/* eslint-disable */
import ApiHandler from "@/utils/dataEndpoint/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const authEndpoints = {
  async loginUser(email: string, password: string) {
    const res = await apiHandlerInstance.createData({
      endpoint: "auth/local",
      data: {
        identifier: email,
        password,
      },
    });
    if (!res) throw new Error('No response received from server');
    if (res.error) throw new Error(res.error.message || 'Authentication failed');
    if (!res.jwt) throw new Error('Invalid response format from server');
    return {
      jwt: res.jwt,
      user: res.user,
    };
  },
  async verifyToken(token: string, userId: number) {
    try {
      const userProfile = await this.getUserProfileWithRole(userId);
      if (!userProfile) return { valid: false };
      return { valid: true };
    } catch {
      return { valid: false };
    }
  },
  async getUsers(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`users${queryString}`);
    if (result.error) throw new Error(result.error);
    return result;
  },
  async getUserProfileWithRole(userId: number) {
    const res = await apiHandlerInstance.fetchData(
      `users/${userId}?populate[role]=*`
    );
    if (!res) throw new Error('No response received from server');
    if (res.error) throw new Error(res.error.message || 'Failed to fetch user profile');
    return res;
  },
};
