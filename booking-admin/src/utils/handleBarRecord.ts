/* eslint-disable */
import { strapiService } from "@/utils/dataEndPoint";

interface OverviewData {
  cashSales: number;
  totalTransfers: number;
  totalSales: number;
}

interface ProductData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  barStock: number;
  restaurantStock: number;
}

interface BarRecordData {
  overview: OverviewData;
  products: ProductData[];
}

export async function handleBarRecord(
  startDate: string,
  endDate: string,
  barService: string
): Promise<BarRecordData> {
  try {
    // Fetch booking items (sales data) with filters
    const bookingItems = await strapiService.getBookingItems({
      populate: "*",
      "pagination[pageSize]": 55,
      "filters[hotel_services][name][$eq]": barService,
      "filters[createdAt][$gte]": formatDate(startDate),
      "filters[createdAt][$lte]": formatDate(endDate),
    });

    // Process sales data for the overview
    const overview = bookingItems.reduce(
      (acc: OverviewData, item: any) => {
        if (item.paymentMethod === "cash") {
          acc.cashSales += item.totalPrice;
        } else if (item.paymentMethod === "transfer") {
          acc.totalTransfers += item.totalPrice;
        }
        acc.totalSales += item.totalPrice;
        return acc;
      },
      { cashSales: 0, totalTransfers: 0, totalSales: 0 }
    );

    // Fetch drinks data (inventory)
    const drinks = await strapiService.getDrinksList({
      populate: "*",
      "pagination[pageSize]": 50,
    });

    // Process drinks data for the products table
    const products = drinks.map((drink: any) => ({
      id: drink.id,
      name: drink.name,
      price: drink.price,
      quantity: drink.quantity,
      barStock: drink.bar_stock,
      restaurantStock: drink.restaurant_stock,
    }));

    // Return the combined data
    return { overview, products };
  } catch (error) {
    console.error("Error handling bar record:", error);
    throw error;
  }
}

function formatDate(date: string): string {
  // Utility function to format date as needed by the API
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}
