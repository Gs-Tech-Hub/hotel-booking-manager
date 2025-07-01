'use client'
import { useEffect, useState } from "react";
import { getOrganisationInfo } from "@/lib/getOrganisationInfo";
import { defaultOrganisationInfo } from "@/config/settings";

export function useOrganisationInfo() {
  const [organisation, setOrganisation] = useState(defaultOrganisationInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchOrganisation() {
      setLoading(true);
      try {
        // Always use getOrganisationInfo to fetch and merge API data with defaults
        const { organisation: apiOrganisation } = await getOrganisationInfo();
        if (isMounted) setOrganisation(apiOrganisation);
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch organisation info");
          setOrganisation(defaultOrganisationInfo);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchOrganisation();
    return () => { isMounted = false; };
  }, []);

  return { organisation, loading, error };
}
