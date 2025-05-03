/* eslint-disable */
import { strapiService } from "@/utils/dataEndPoint";
import { Product } from "@/app/(protected)/bar/_components/products-table/products-table";

export interface OverviewCardData {
  cashSales: number;
  totalTransfers: number;
  totalSales: number;
  totalUnits: number;
  totalProfit: number;
  barSales: number;
  foodSales: number;
  hotelSales: number;
  gameSales: number;
}

export interface ExtendedProduct extends Product {
  isRestaurant?: boolean;
  isGame?: boolean;
  isBar?: boolean;
  isHotel?: boolean;
  showStock?: boolean;
  showProfit?: boolean;
}

export async function handleDepartmentRecord(
  startDate: string,
  endDate: string,
  department: "bar_services" | "restaurant_services" | "hotel_services" | "Games",
  options: {
    inventoryEndpoint: keyof typeof strapiService;
    departmentStockField: string;
    otherStockField: string;
    fetchInventory?: boolean;
  },
  fetchInventory = true
): Promise<{ overview: OverviewCardData; products: ExtendedProduct[] }> {
  const { inventoryEndpoint, departmentStockField, otherStockField } = options;

  try {
    // Fetch booking items
    const bookingItems = await strapiService.getBookingItems({
      "pagination[pageSize]": 70,
      "filters[createdAt][$gte]": formatDateRange(startDate),
      "filters[createdAt][$lte]": formatDateRange(endDate, true),
      "populate": "*",
    });

    console.log("Fetched Booking Items:", bookingItems);

    let cashSales = 0;
    let totalTransfers = 0;
    let totalUnits = 0;
    let totalAmount = 0;

    let salesByProduct: Record<string, { units: number; amount: number }> = {};

    bookingItems.forEach((item: any) => {
      const paymentMethod = item.payment_type?.types?.trim().toLowerCase();
      const amountPaid = item.amount_paid || 0;

      let products: any[] = [];

      if (department === "bar_services" && item.drinks?.length > 0) {
        products = item.drinks;
      } else if (department === "restaurant_services" && item.food_items?.length > 0) {
        products = item.food_items;
      } else if (department === "hotel_services" && item.hotel_services?.length > 0) {
        products = item.hotel_services;
      } else if (department === "Games" && item.games?.length > 0) {
        products = item.games;
      }

      if (products.length > 0) {
        const count = item.count || 1; // default 1 if missing
        const itemUnits = products.length * count;
        const itemAmount = amountPaid; // assume full item paid

        totalUnits += itemUnits;
        totalAmount += itemAmount;

        // Handle sales breakdown by payment method
        if (paymentMethod === "cash") {
          cashSales += itemAmount;
        } else {
          totalTransfers += itemAmount;
        }

        // Track each product sale
        products.forEach((prod: any) => {
          if (!prod?.documentId) return;
          if (!salesByProduct[prod.documentId]) {
            salesByProduct[prod.documentId] = { units: 0, amount: 0 };
          }
          salesByProduct[prod.documentId].units += count;
          salesByProduct[prod.documentId].amount += (prod.price || 0) * count;
        });
      }
    });

    console.log("Sales by Product:", salesByProduct);

    let inventory: any[] = [];
    if (fetchInventory) {
      inventory = await strapiService[inventoryEndpoint](
        {
          populate: "*",
          "pagination[pageSize]": 100,
        },
        {},
        {}
      );
      console.log("Fetched Inventory:", inventory);
    }

    const products: ExtendedProduct[] = inventory.map((product: any) => {
      const sales = salesByProduct[product.documentId] || { units: 0, amount: 0 };

      return {
        name: String(product.name || "Unnamed Product"),
        type: product.drink_type?.typeName || "",
        price: Number(product.price) || 0,
        stock: product[departmentStockField] || 0,
        other_stock: product[otherStockField] || 0,
        sold: sales.units,
        amount: sales.amount,
        profit: sales.amount - (product.price * sales.units),
        isBar: department === "bar_services",
        isRestaurant: department === "restaurant_services",
        isHotel: department === "hotel_services",
        isGame: department === "Games",
        bar_stock: product.bar_stock || 0,
        drink_type: product.drink_type || null,
        showStock: true,
        showProfit: true,
      };
    });

    const overview: OverviewCardData = {
      cashSales,
      totalTransfers,
      totalSales: totalAmount,
      totalUnits,
      totalProfit: products.reduce((acc, p) => acc + p.profit, 0),
      barSales: department === "bar_services" ? totalAmount : 0,
      foodSales: department === "restaurant_services" ? totalAmount : 0,
      hotelSales: department === "hotel_services" ? totalAmount : 0,
      gameSales: department === "Games" ? totalAmount : 0,
    };

    return { overview, products };
  } catch (error) {
    console.error("Error in handleDepartmentRecord:", error);
    throw error;
  }
}

function formatDateRange(date: string, endOfDay = false): string {
  const d = new Date(date);
  if (endOfDay) {
    d.setHours(23, 59, 59, 999);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d.toISOString();
}