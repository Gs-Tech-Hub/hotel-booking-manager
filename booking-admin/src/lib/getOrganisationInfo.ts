import { defaultOrganisationInfo } from "@/config/settings";
import { organisationInfoEndpoints } from "@/utils/dataEndpoint/organisation-info";

export async function getOrganisationInfo() {
  try {
    const apiData = await organisationInfoEndpoints.getOrganisationInfos();
    let merged = { ...defaultOrganisationInfo };
    if (Array.isArray(apiData) && apiData.length > 0) {
      let apiLogo = apiData[0].logo;
      if (typeof apiLogo === "string") {
        apiLogo = { light: apiLogo, dark: apiLogo };
      } else if (!apiLogo) {
        apiLogo = { light: merged.logo.light, dark: merged.logo.dark };
      }
      merged = { ...merged, ...apiData[0], logo: { ...merged.logo, ...apiLogo } };
    }
    return { organisation: merged };
  } catch (err: unknown) {
     console.error(`Failed to fetch organisation info:, ${err}`);
    return { organisation: defaultOrganisationInfo };
  }
}