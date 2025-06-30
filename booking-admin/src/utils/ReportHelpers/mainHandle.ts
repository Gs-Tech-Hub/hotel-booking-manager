/* eslint-disable */
import { strapiService } from "@/utils/dataEndpoint";
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
  gym_memberships: number;
  sport_memberships: number;
  gymItems?: Array<{ name: string; units: number }>;
  sportItems?: Array<{ name: string; units: number }>;
}

export interface ExtendedProduct extends Product {
  isRestaurant?: boolean;
  isGame?: boolean;
  isBar?: boolean;
  isHotel?: boolean;
  isGymAndSports?: boolean;
  showStock?: boolean;
  showProfit?: boolean;
}

async function fetchPaginatedData(fetchFunction: Function, params: any): Promise<any[]> {
  let page = 1;
  const pageSize = 50; // Adjust page size as needed
  let allData: any[] = [];
  let hasMoreData = true;

  while (hasMoreData) {
    const response = await fetchFunction({ ...params, "pagination[page]": page, "pagination[pageSize]": pageSize });
    if (response && response.length > 0) {
      allData = allData.concat(response);
      page++;
    } else {
      hasMoreData = false;
    }
  }

  return allData;
}

export async function handleMainRecord(
  startDate: string,
  endDate: string,
  department: "bar" | "restaurant" | "hotel" | "games" | "gym_memberships" | "sport_memberships",
  options: {
    inventoryEndpointGroup: string;
    inventoryMethod: string;
    departmentStockField: string;
    otherStockField: string;
    fetchInventory?: boolean;
  } = {
    inventoryEndpointGroup: "menuEndpoints",
    inventoryMethod: "getDrinksList",
    departmentStockField: "stock",
    otherStockField: "other_stock",
    fetchInventory: false,
  }
): Promise<{ overview: OverviewCardData; products: ExtendedProduct[] }> {
  const {
    inventoryEndpointGroup,
    inventoryMethod,
    departmentStockField,
    otherStockField,
    fetchInventory = false,
  } = options;

  try {
    const filters = generateFilters(startDate, endDate, department);
    const bookingItems = await strapiService.bookingEndpoints.getBookingItems(filters);
    console.log('booking-items:', bookingItems);
    const groupedItems = itemsByDepartment(bookingItems);
    console.log("grouped items:", groupedItems);

    const productCountFilters = generateFilters(startDate, endDate, "product_count");
    const productCountItems = await strapiService.bookingEndpoints.getBookingItems(productCountFilters);

    // Merge counts into grouped items
    const { updatedItems: mergedGroupedItems } = mergedProductCount(groupedItems, productCountItems);

    // Aggregate totals and flatten
    const { updatedItems: flatItems, salesByProduct, paymentMethods, departmentTotals } = calculateDepartmentTotals(mergedGroupedItems, productCountItems, department);

    console.log("Aggregated Items:", flatItems);
    console.log("Sales by Product:", salesByProduct);
    console.log("Department Totals:", departmentTotals);

    // Totals
    const totalUnits = flatItems.reduce((sum, item) => sum + item.quantity, 0);

    // Map gym and sport items for overview
    let gymItems: Array<{ name: string; units: number }> = [];
    let sportItems: Array<{ name: string; units: number }> = [];
    if (department === "gym_memberships") {
      gymItems = flatItems
        .filter((item) => item.department === "gym_memberships")
        .map((item) => ({ name: item.name, units: item.quantity }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
    }
    if (department === "sport_memberships") {
      sportItems = flatItems
        .filter((item) => item.department === "sport_memberships")
        .map((item) => ({ name: item.name, units: item.quantity }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
    }

    const overviewBase = {
      cashSales: departmentTotals.cashSales,
      totalTransfers: departmentTotals.totalTransfers,
      totalSales: departmentTotals.totalSales,
      totalUnits,
      totalProfit: 0, 
      barSales: 0,
      foodSales: 0,
      hotelSales: 0,
      gameSales: 0,
      gym_memberships: 0,
      sport_memberships: 0,
      gymItems,
      sportItems,
    };

    if (department === "bar") overviewBase.barSales = departmentTotals.totalSales;
    if (department === "restaurant") overviewBase.foodSales = departmentTotals.totalSales;
    if (department === "hotel") overviewBase.hotelSales = departmentTotals.totalSales;
    if (department === "games") overviewBase.gameSales = departmentTotals.totalSales;
    if (department === "gym_memberships") overviewBase.gym_memberships = departmentTotals.totalSales;
    if (department === "sport_memberships") overviewBase.sport_memberships = departmentTotals.totalSales;
    

    // Optional inventory fetch
    const inventoryData = fetchInventory
      ? await fetchInventoryData(inventoryEndpointGroup, inventoryMethod)
      : [];

    const products: ExtendedProduct[] = inventoryData.map((product: any) => {
      const sales = salesByProduct.find((p) => p.name === product.name) || {
        units: 0,
        amount: 0,
        amountPaid: 0,
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
        isGym: department === "gym_memberships",
        isSports: department === "sport_memberships",
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
    // console.error("Error in handleMainRecord:", error);
    throw error;
  }
}
