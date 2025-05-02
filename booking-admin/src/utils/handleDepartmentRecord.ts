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
      "pagination[pageSize]": 200,
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

    for (const item of bookingItems) {
      const paymentMethod = item.payment_type?.types?.trim().toLowerCase();
      const amountPaid = item.amount_paid || 0;
      const productCounts = Array.isArray(item.product_count) ? item.product_count : [];
    
      console.log(`\n--- Processing bookingItem ID ${item.id} ---`);
      console.log("Payment Method:", paymentMethod);
      console.log("Product Counts:", productCounts);
    
      for (const pcEntry of productCounts) {
        console.log("\nLooking up Product Count with documentId:", pcEntry.documentId);
      
        const productCountData = await strapiService.getProductCounts({
          "filters[documentId][$eq]": pcEntry.documentId,
          populate: "*",
        });
      
        const productCount = productCountData?.data?.[0];
        if (!productCount) {
          console.warn("No product count entry found for:", pcEntry.documentId);
          continue;
        }
      
        const count = productCount.product_count || 1;
      
        // Identify the actual product (food, drink, etc.)
        const product =
          productCount.food_item || productCount.drink || productCount.game || productCount.hotel_service;
      
        if (!product) {
          console.warn("No associated product found in product_count:", productCount);
          continue;
        }
      
        const productDocumentId = product.documentId;
        const unitPrice = product.price || 0;
        const itemAmount = unitPrice * count;
      
        // Department filter
        let productList: any[] = [];
        if (department === "bar_services") productList = item.drinks || [];
        else if (department === "restaurant_services") productList = item.food_items || [];
        else if (department === "hotel_services") productList = item.hotel_services || [];
        else if (department === "Games") productList = item.games || [];
      
        console.log("Checking against department products:", productList.map(p => p.documentId));
      
        const matchedProduct = productList.find(p => p.documentId === productDocumentId);
        if (!matchedProduct) {
          console.warn("No matching product found for documentId:", productDocumentId);
          continue;
        }
      
        console.log(`Matched Product: ${matchedProduct.name} | Count: ${count} | Price: ${unitPrice} | Amount: ${itemAmount}`);
      
        totalUnits += count;
        totalAmount += itemAmount;
      
        if (paymentMethod === "cash") {
          cashSales += itemAmount;
        } else {
          totalTransfers += itemAmount;
        }
      
        if (!salesByProduct[productDocumentId]) {
          salesByProduct[productDocumentId] = { units: 0, amount: 0 };
        }
      
        salesByProduct[productDocumentId].units += count;
        salesByProduct[productDocumentId].amount += itemAmount;
      }
    }      

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
