import { handleDepartmentRecord, OverviewCardData } from "@/utils/handleDepartmentRecord";

export async function getAllDepartmentOverviews(startDate: string, endDate: string) {
  try {
    console.log("Fetching department overviews...");

    // Fetch overviews for each department
    const bar = await handleDepartmentRecord(startDate, endDate, "bar_services", {
      inventoryEndpoint: "getBookingItems",
      departmentStockField: "bar_stock",
      otherStockField: "restaurant_stock",
    });
    console.log("Bar Overview:", bar);

    const restaurant = await handleDepartmentRecord(startDate, endDate, "restaurant_services", {
      inventoryEndpoint: "getFoodItems",
      departmentStockField: "restaurant_stock",
      otherStockField: "bar_stock",
    });
    console.log("Restaurant Overview:", restaurant);

    const hotel = await handleDepartmentRecord(startDate, endDate, "hotel_services", {
      inventoryEndpoint: "getBookingItems",
      departmentStockField: "hotel_stock",
      otherStockField: "bar_stock",
    });
    console.log("Hotel Overview:", hotel);

    const games = await handleDepartmentRecord(startDate, endDate, "Games", {
      inventoryEndpoint: "getBookingItems",
      departmentStockField: "available_sessions",
      otherStockField: "available_sessions",
      fetchInventory: false
    });
    console.log("Games Overview:", games);

    // Now merge them carefully
    const combinedOverview: OverviewCardData = {
      cashSales: bar.overview.cashSales + restaurant.overview.cashSales + hotel.overview.cashSales + games.overview.cashSales,
      totalTransfers: bar.overview.totalTransfers + restaurant.overview.totalTransfers + hotel.overview.totalTransfers + games.overview.totalTransfers,
      totalSales: bar.overview.totalSales + restaurant.overview.totalSales + hotel.overview.totalSales + games.overview.totalSales,
      totalUnits: bar.overview.totalUnits + restaurant.overview.totalUnits + hotel.overview.totalUnits + games.overview.totalUnits,
      totalProfit: bar.overview.totalProfit + restaurant.overview.totalProfit + hotel.overview.totalProfit + games.overview.totalProfit,
      
      barSales: bar.overview.barSales,
      foodSales: restaurant.overview.foodSales,
      hotelSales: hotel.overview.hotelSales,
      gameSales: games.overview.gameSales,
    };

    console.log("Combined Overview:", combinedOverview);

    return combinedOverview;
    
  } catch (error) {
    console.error("Failed to get department overviews:", error);
    throw error;
  }
}
