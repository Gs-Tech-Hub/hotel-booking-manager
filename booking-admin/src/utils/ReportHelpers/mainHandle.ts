/* eslint-disable */
import { strapiService } from "@/utils/dataEndPoint";
import { Product } from "@/app/(protected)/bar/_components/products-table/products-table";
import { fetchInventoryData } from "./reportHelpers/fetchInventoryData";
import { calculateDepartmentTotals } from "./reportHelpers/calculateDepartmentTotals";
import { generateFilters } from "./reportHelpers/filtersBuilder";
import { itemsByDepartment } from "./reportHelpers/itemByDepartment";
import { mergedProductCount } from "./reportHelpers/mergedProductCount";

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

export async function handleMainRecord(
  startDate: string,
  endDate: string,
  department: "bar" | "restaurant" | "hotel" | "games",
  options: {
    inventoryEndpoint: keyof typeof strapiService;
    departmentStockField: string;
    otherStockField: string;
    fetchInventory?: boolean;
  } = {
    inventoryEndpoint: "fetch",
    departmentStockField: "stock",
    otherStockField: "other_stock",
    fetchInventory: false,
  }
): Promise<{ overview: OverviewCardData; products: ExtendedProduct[] }> {
  const {
    inventoryEndpoint,
    departmentStockField,
    otherStockField,
    fetchInventory = false,
  } = options;

  try {
    const filters = generateFilters(startDate, endDate, department);
    const bookingItems = await strapiService.getBookingItems(filters);
    console.log('booking-items:', bookingItems);
    const groupedItems = itemsByDepartment(bookingItems);
    console.log("grouped items:", groupedItems);

    const productCountFilters = generateFilters(startDate, endDate, "product_count");
    const productCountItems = await strapiService.getBookingItems(productCountFilters);

    // Merge counts into grouped items
    const { updatedItems: mergedGroupedItems } = mergedProductCount(groupedItems, productCountItems);

    // Aggregate totals and flatten
    const { updatedItems: flatItems, salesByProduct } = calculateDepartmentTotals(mergedGroupedItems, productCountItems);

    console.log("Aggregated Items:", flatItems);
    console.log("Sales by Product:", salesByProduct);
    // Totals
    const totalUnits = flatItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = flatItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const overviewBase = {
      cashSales: 0, // Add logic here if needed
      totalTransfers: 0, // Add logic here if needed
      totalSales: totalAmount,
      totalUnits,
      totalProfit: 0, // calculated below
      barSales: 0,
      foodSales: 0,
      hotelSales: 0,
      gameSales: 0,
    };

    if (department === "bar") overviewBase.barSales = totalAmount;
    if (department === "restaurant") overviewBase.foodSales = totalAmount;
    if (department === "hotel") overviewBase.hotelSales = totalAmount;
    if (department === "games") overviewBase.gameSales = totalAmount;

    // Optional inventory fetch
    const inventoryData = fetchInventory
      ? await fetchInventoryData(inventoryEndpoint)
      : [];

    const products: ExtendedProduct[] = inventoryData.map((product: any) => {
      const sales = salesByProduct[product.name] || {
        units: 0,
        amount: 0,
      };

      const profit = sales.amount - (Number(product.price) * sales.units);

      return {
        name: String(product.name || "Unnamed Product"),
        price: Number(product.price) || 0,
        stock: product[departmentStockField] || 0,
        other_stock: product[otherStockField] || 0,
        sold: sales.units,
        amount: sales.amount,
        profit,
        isBar: department === "bar",
        isRestaurant: department === "restaurant",
        isHotel: department === "hotel",
        isGame: department === "games",
        showStock: true,
        showProfit: true,
        type: product.type || "",
        bar_stock: product.bar_stock || 0,
        drink_type: product.drink_type || "",
      };
    });

    overviewBase.totalProfit = products.reduce((acc, p) => acc + p.profit, 0);

    return {
      overview: overviewBase,
      products,
    };
  } catch (error) {
    console.error("Error in handleMainRecord:", error);
    throw error;
  }
}
