import { strapiService } from "@/utils/dataEndpoint";
import { OverviewCardData } from "@/utils/deprecated/handleDepartmentRecord";
import { handleMainRecord } from "@/utils/ReportHelpers/mainHandle";

export async function getAllDepartmentOverviews(startDate: string, endDate: string) {
  try {
    // console.log("Fetching department overviews...");

    // Batch 1: Bar and Restaurant
    const [bar, restaurant] = await Promise.all([
      handleMainRecord(startDate, endDate, "bar"),
      handleMainRecord(startDate, endDate, "restaurant"),
    ]);
    // console.log("Batch 1 Loaded: Bar and Restaurant");

    // Batch 2: Hotel and Games
    const [hotel] = await Promise.all([
      handleMainRecord(startDate, endDate, "hotel"),
    ]);
    // console.log("Batch 2 Loaded: Hotel and Games");

    const gamesData = await strapiService.gameEndpoints.getGamesList({
      populate: '*',
      'pagination[pageSize]': 100,
      'filters[createdAt][$gte]': startDate,
      'filters[createdAt][$lte]': endDate,
    });

    let payed = 0;
    let notPayed = 0;
    let totalGames = 0;

    for (const game of gamesData || []) {
      const amountPaid = Number(game.amount_paid) || 0;
      const gameCount = Number(game.count) || 0;

      totalGames += gameCount;

      if (game.game_status === 'completed') {
        payed += amountPaid;
      } else if (game.game_status === 'ongoing') {
        notPayed += amountPaid;
      }
    }

    const games = {
      overview: {
        cashSales: payed,
        totalTransfers: 0, // Assuming no transfers for games
        totalSales: payed + notPayed,
        totalUnits: totalGames,
        totalProfit: payed, // Assuming profit equals payed amount
        gameSales: payed,
      },
    };

    // Combine results
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
