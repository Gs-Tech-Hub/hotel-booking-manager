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
    let barSales = 0;
    let foodSales = 0;
    let hotelSales = 0;
    let gameSales = 0;

    let salesByProduct: Record<string, { units: number; amount: number }> = {};

    for (const item of bookingItems) {
      const paymentMethod = item.payment_type?.types?.trim().toLowerCase();
      const amountPaid = item.amount_paid || 0;

      console.log(`\n--- Processing bookingItem ID ${item.id} ---`);
      console.log("Payment Method:", paymentMethod);

      if (Array.isArray(item.product_count) && item.product_count.length > 0) {
        for (const pcEntry of item.product_count) {
          const relatedData = await strapiService.getProductCounts({
            "filters[id][$eq]": pcEntry.id,
            "populate": "*",
          });
      
          const productCount = relatedData?.data?.[0];
          console.log("Product Count Data:", productCount);
      
          if (!productCount?.product_count || productCount.product_count <= 0) {
            
            console.warn(`No valid count found for product_count ID: ${pcEntry.id}`);
            continue;
          }
      
          const relatedProduct =
            productCount.drinks ||
            productCount.food_items ||
            productCount.hotel_services ||
            productCount.games;
      
          const matchedDocumentId = relatedProduct?.documentId;
      
          if (!matchedDocumentId) {
            console.warn(`No related product found in product_count ID: ${pcEntry.id}`);
            continue;
          }
      
          const product =
            (department === "bar_services" && item.drinks?.find((p: any) => p.documentId === matchedDocumentId)) ||
            (department === "restaurant_services" && item.food_items?.find((p: any) => p.documentId === matchedDocumentId)) ||
            (department === "hotel_services" && item.hotel_services?.find((p: any) => p.documentId === matchedDocumentId)) ||
            (department === "Games" && item.games?.find((p: any) => p.documentId === matchedDocumentId));
      
          if (!product) {
            console.warn(`No matching product found for documentId: ${matchedDocumentId} in department: ${department}`);
            continue;
          }
      
          const unitPrice = product.price || 0;
          const count = productCount.product_count;
          const itemAmount = unitPrice * count;

          console.log(`Matched Product: ${product.name} | Count: ${count} | Unit Price: ${unitPrice} | Item Amount: ${itemAmount}`);

          totalUnits += count;
          totalAmount += itemAmount;

          if (paymentMethod === "cash") {
            cashSales += itemAmount;
          } else {
            totalTransfers += itemAmount;
          }

          if (department === "bar_services") {
            barSales += itemAmount;
          } else if (department === "restaurant_services") {
            foodSales += itemAmount;
          } else if (department === "hotel_services") {
            hotelSales += itemAmount;
          } else if (department === "Games") {
            gameSales += itemAmount;
          }

          if (!salesByProduct[product.documentId]) {
            salesByProduct[product.documentId] = { units: 0, amount: 0 };
          }
          salesByProduct[product.documentId].units += count;
          salesByProduct[product.documentId].amount += itemAmount;

          console.log(`Updated Sales for Product: ${product.name} | Total Units: ${salesByProduct[product.documentId].units} | Total Amount: ${salesByProduct[product.documentId].amount}`);
        }
      } else {
        const count = item.quantity || 0;
        console.log(`Falling back to quantity: ${count}`);

        const product =
          (department === "bar_services" && item.drinks?.[0]) ||
          (department === "restaurant_services" && item.food_items?.[0]) ||
          (department === "hotel_services" && item.hotel_services?.[0]);

        if (!product) {
          console.warn(`No associated product found for item in department: ${department}`);
          continue;
        }

        const unitPrice = product.price || 0;
        const itemAmount = unitPrice * count;

        console.log(`Fallback Product: ${product.name} | Count: ${count} | Unit Price: ${unitPrice} | Item Amount: ${itemAmount}`);

        totalUnits += count;
        totalAmount += itemAmount;

        if (paymentMethod === "cash") {
          cashSales += itemAmount;
        } else {
          totalTransfers += itemAmount;
        }

        if (department === "bar_services") barSales += itemAmount;
        else if (department === "restaurant_services") foodSales += itemAmount;
        else if (department === "hotel_services") hotelSales += itemAmount;

        if (!salesByProduct[product.documentId]) {
          salesByProduct[product.documentId] = { units: 0, amount: 0 };
        }
        salesByProduct[product.documentId].units += count;
        salesByProduct[product.documentId].amount += itemAmount;

        console.log(`Updated Sales for Fallback Product: ${product.name} | Total Units: ${salesByProduct[product.documentId].units} | Total Amount: ${salesByProduct[product.documentId].amount}`);
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
      barSales,
      foodSales,
      hotelSales,
      gameSales,
    };

    console.log("Overview Data:", overview);

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
