
const departmentFieldMap: Record<string, string> = {
  bar: "drinks",
  restaurant: "food_items",
  hotel: "hotel_services",
  games: "games",
  product_count: "product_count", 
  gym_membership: "gym_memberships",
  sport_membership: "sport_memberships"
};

export const generateFilters = (
  startDate: string,
  endDate: string,
  department: keyof typeof departmentFieldMap
) => {
  const departmentKey = departmentFieldMap[department];

  const baseFilters = {
    "populate": "*",
    "pagination[pageSize]": "100",
    "filters[createdAt][$gte]": formatDateRange(startDate),
    "filters[createdAt][$lte]": formatDateRange(endDate, true),
  };

  if (department === "product_count") {
    return {
      ...baseFilters,
      "[product_count][populate]": "*",
      "filters[product_count][product_count][$notNull]": "true",
    };
  }

  if (departmentKey) {
    return {
      ...baseFilters,
    };
  }

  console.warn(`Invalid department passed to generateFilters: ${department}`);
  return baseFilters;
};



  // Helper function to format date range
  const formatDateRange = (date: string, endOfDay = false): string => {
    const d = new Date(date);
    if (endOfDay) d.setHours(23, 59, 59, 999);
    else d.setHours(0, 0, 0, 0);
    return d.toISOString();
  };
  
  // "filters[product_count][product_count][$notNull]": "true",
  // "[product_count][populate]": "*",
  // [`filters[${departmentKey}][id][$notNull]`]: "true",


  // "filters[product_count][product_count][$notNull]": "true",
  //     "populate[product_count][populate]": "*"

  // [`filters[${departmentKey}][id][$notNull]`]: "true",
