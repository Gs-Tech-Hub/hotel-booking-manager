import { strapiService } from "@/utils/dataEndPoint";

export const fetchInventoryData = async (
    inventoryEndpoint: keyof typeof strapiService
) => {
    return await strapiService[inventoryEndpoint](null, null, {
      populate: "*",
      "pagination[pageSize]": 100,
    });
  };
  