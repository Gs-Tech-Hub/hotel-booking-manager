/* eslint-disable */
import { menuEndpoints } from "@/utils/dataEndpoint/menuEndpoints";
import { gameEndpoints } from "@/utils/dataEndpoint/gameEndpoints";
// Add other endpoint imports as needed

const endpointGroups: Record<string, any> = {
  menuEndpoints,
  gameEndpoints,
  // Add other endpoint groups here as needed
};

export const fetchInventoryData = async (
  endpointGroup: keyof typeof endpointGroups,
  methodName: string
) => {
  const group = endpointGroups[endpointGroup];
  if (!group || typeof group[methodName] !== "function") {
    throw new Error(`Invalid endpoint group or method: ${endpointGroup}.${methodName}`);
  }
  return await group[methodName]({
    populate: "*",
    "pagination[pageSize]": "100",
  });
};
