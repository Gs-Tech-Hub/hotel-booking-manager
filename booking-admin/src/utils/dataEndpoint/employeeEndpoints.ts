/* eslint-disable */
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const employeeEndpoints = {
  async createEmployeeOrder(orderData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "employee-orders", 
      data: orderData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getEmployeeOrders(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`employee-orders${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async getEmployeeSummary(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`employee-summaries${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async createEmployeeSummary(employeeData: any) {
    const result = await apiHandlerInstance.createData({
      endpoint: "employee-summaries",
      data: employeeData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  async updateEmployeeSummary(employeeId: string | number, employeeData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: "employee-summaries",
      id: employeeId,
      updatedData: employeeData, 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
};
