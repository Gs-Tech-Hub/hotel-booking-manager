/* eslint-disable */
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

export const organisationInfoEndpoints = {
  async getOrganisationInfos(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`organisation-infos${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
    async getOrganisationInfoById(id: number | string) {
        const result = await apiHandlerInstance.fetchData(`organisation-infos/${id}`);
        if (result.error) throw new Error(result.error);
        return result.data;
    },
    async createOrganisationInfo(data: any) {
        const result = await apiHandlerInstance.createData({
            endpoint: "organisation-infos",
            data,
        });
        if (result.error) throw new Error(result.error);
        return result.data.documentId;
    },
    async updateOrganisationInfo(id: number | string, data: any) {
        const result = await apiHandlerInstance.updateData({
            endpoint: 'organisation-infos',
            id: id,
            updatedData: data,
        });
        if (result.error) throw new Error(result.error);
        return result.data.documentId;
    },
    async deleteOrganisationInfo(id: number | string) {
        const result = await apiHandlerInstance.deleteData({
            endpoint: 'organisation-infos',
            id: id,
        });
        if (result.error) throw new Error(result.error);
        return result.data.documentId;
    },
};

