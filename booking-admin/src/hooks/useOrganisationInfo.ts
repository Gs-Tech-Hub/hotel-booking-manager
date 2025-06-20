/* eslint-disable */
import { useEffect, useState } from "react";
import { defaultOrganisationInfo } from "@/config/settings";
import { organisationInfoEndpoints } from "@/utils/dataEndpoint/organisation-info";

export function useOrganisationInfo() {
  const [organisation, setOrganisation] = useState(defaultOrganisationInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrganisation() {
      setLoading(true);
      try {
        const apiData = await organisationInfoEndpoints.getOrganisationInfos();
        let merged = { ...defaultOrganisationInfo };
        if (Array.isArray(apiData) && apiData.length > 0) {
          // If API returns logo as string, convert to object for compatibility
          let apiLogo = apiData[0].logo;
          if (typeof apiLogo === "string") {
            apiLogo = { light: apiLogo, dark: apiLogo };
          } else if (!apiLogo) {
            apiLogo = { light: merged.logo.light, dark: merged.logo.dark };
          }
          merged = { ...merged, ...apiData[0], logo: { ...merged.logo, ...apiLogo } };
        }
        setOrganisation(merged);
      } catch (err: any) {
        setError(err.message || "Failed to fetch organisation info");
        setOrganisation(defaultOrganisationInfo);
      } finally {
        setLoading(false);
      }
    }
    fetchOrganisation();
  }, []);

  return { organisation, loading, error };
}
