/* eslint-disable */
import { useAuth } from "@/components/Auth/context/auth-context";
import ApiHandler from "@/utils/apiHandler";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

export const userEndpoints = () => {
    const { user } = useAuth();
    const apiHandlerInstance = ApiHandler({ baseUrl });

    return {
        async createUser(username: string, email: string, password: string, role: number = 1) {
            // For auth endpoint, send unwrapped payload (handled by ApiHandler)
            const result = await apiHandlerInstance.createData({
                endpoint: "auth/local/register",
                data: {
                    username,
                    email,
                    password,
                },
            });
            if (result.error) throw new Error(result.error);
            // Return the same structure as other endpoints
            return result;
        },
        async getUserById(userId: string) {
            // Always use fetchWithAuth for protected user endpoints
            const result = await apiHandlerInstance.fetchWithAuth(`users/${userId}`);
            if (result.error) throw new Error(result.error);
            return result;
        },
        // Add a generic updateUser to match the structure
        async updateUser(userId: string, updatedData: any) {
            const result = await apiHandlerInstance.updateData({
                endpoint: "users",
                id: userId,
                updatedData,
            });
            if (result.error) throw new Error(result.error);
            return result;
        },
        // Add a generic deleteUser to match the structure
        async deleteUser(userId: string) {
            const result = await apiHandlerInstance.deleteData({
                endpoint: "users",
                id: userId,
            });
            if (result.error) throw new Error(result.error);
            return result;
        },
    };
};
