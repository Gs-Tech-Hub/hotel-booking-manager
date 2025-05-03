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

// Helper function to process product counts
function processProductCount(
  productCount: any,
  department: string,
  item: any,
  salesByProduct: Record<string, { units: number; amount: number }>,
  paymentMethod: string,
  totals: { cashSales: number; totalTransfers: number; totalUnits: number; totalAmount: number; departmentSales: number }
) {
  const relatedProduct =
    productCount.drinks ||
    productCount.food_item ||
    productCount.hotel_services ||
    productCount.games;

  const matchedDocumentId = relatedProduct?.documentId;

  if (!matchedDocumentId) {
    console.warn(`No related product found in product_count ID: ${productCount.id}`);
    return;
  }

  const product =
    (department === "bar_services" && item.drinks?.find((p: any) => p.documentId === matchedDocumentId)) ||
    (department === "restaurant_services" && item.food_items?.find((p: any) => p.documentId === matchedDocumentId)) ||
    (department === "hotel_services" && item.hotel_services?.find((p: any) => p.documentId === matchedDocumentId)) ||
    (department === "Games" && item.games?.find((p: any) => p.documentId === matchedDocumentId));

  if (!product) {
    console.warn(`No matching product found for documentId: ${matchedDocumentId} in department: ${department}`);
    return;
  }

  const unitPrice = product.price || 0;
  const count = productCount.product_count;
  const itemAmount = unitPrice * count;

  console.log(`Matched Product: ${product.name} | Count: ${count} | Unit Price: ${unitPrice} | Item Amount: ${itemAmount}`);

  // Update totals
  totals.totalUnits += count;
  totals.totalAmount += itemAmount;

  if (paymentMethod === "cash") {
    totals.cashSales += itemAmount;
  } else {
    totals.totalTransfers += itemAmount;
  }

  totals.departmentSales += itemAmount;

  if (!salesByProduct[product.documentId]) {
    salesByProduct[product.documentId] = { units: 0, amount: 0 };
  }
  salesByProduct[product.documentId].units += count;
  salesByProduct[product.documentId].amount += itemAmount;

  console.log(`Updated Sales for Product: ${product.name} | Total Units: ${salesByProduct[product.documentId].units} | Total Amount: ${salesByProduct[product.documentId].amount}`);
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
): Promise<{ overview: OverviewCardData; products: ExtendedProduct[]; paymentDetailsByOrder: Record<string, { paymentMethod: string; amountPaid: number }> }> {
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
    let departmentSales = 0;

    let salesByProduct: Record<string, { units: number; amount: number }> = {};
    let paymentDetailsByOrder: Record<string, { paymentMethod: string; amountPaid: number }> = {};

    const totals = { cashSales, totalTransfers, totalUnits, totalAmount, departmentSales };

    for (const item of bookingItems) {
      const paymentMethod = item.payment_type?.types?.trim()?.toLowerCase() || "unknown";
      const amountPaid = item.amount_paid || 0;

      paymentDetailsByOrder[item.id] = { paymentMethod, amountPaid };

      if (department === "Games" && Array.isArray(item.games) && item.games.length > 0) {
        // Handle games differently by aggregating `amount_paid`
        for (const game of item.games) {
          const gameAmount = game.amount_paid || 0;
          totals.totalAmount += gameAmount;
          totals.departmentSales += gameAmount;

          console.log(`Game Amount Paid: ${gameAmount} | Total Amount: ${totals.totalAmount}`);
        }
      } else if (Array.isArray(item.product_count) && item.product_count.length > 0) {
        // Process items with product_count
        for (const pcEntry of item.product_count) {
          const relatedData = await strapiService.getProductCounts({
            "filters[id][$eq]": pcEntry.id,
            "populate": "*",
          });

          const productCount = relatedData?.data?.[0];
          if (!productCount) {
            console.warn(`No product_count found for ID: ${pcEntry.id}`);
            continue;
          }

          processProductCount(productCount, department, item, salesByProduct, paymentMethod, totals);
        }
      } else {
        // Fallback for items without product_count
        const count = item.quantity || 0;
        const product =
          (department === "bar_services" && item.drinks?.[0]) ||
          (department === "restaurant_services" && item.food_items?.[0]) ||
          (department === "hotel_services" && item.hotel_services?.[0]) ||
          (department === "Games" && item.games?.[0]);

        if (!product) {
          console.warn(`No associated product found for item in department: ${department}`);
          continue;
        }

        const unitPrice = product.price || 0;
        const itemAmount = unitPrice * count;

        console.log(`Fallback Product: ${product.name} | Count: ${count} | Unit Price: ${unitPrice} | Item Amount: ${itemAmount}`);

        totals.totalUnits += count;
        totals.totalAmount += itemAmount;

        if (paymentMethod === "cash") {
          totals.cashSales += itemAmount;
        } else {
          totals.totalTransfers += itemAmount;
        }

        totals.departmentSales += itemAmount;

        if (!salesByProduct[product.documentId]) {
          salesByProduct[product.documentId] = { units: 0, amount: 0 };
        }
        salesByProduct[product.documentId].units += count;
        salesByProduct[product.documentId].amount += itemAmount;

        console.log(`Updated Sales for Fallback Product: ${product.name} | Total Units: ${salesByProduct[product.documentId].units} | Total Amount: ${salesByProduct[product.documentId].amount}`);
      }
    }

    ({ cashSales, totalTransfers, totalUnits, totalAmount, departmentSales } = totals);

    console.log("Sales by Product:", salesByProduct);
    console.log("Payment Details by Order:", paymentDetailsByOrder);

    let inventory: any[] = [];
    if (fetchInventory) {
      inventory = await strapiService[inventoryEndpoint](
        {
          populate: "*",
          "pagination[pageSize]": 100,
        },
        {} as any,
        {} as any
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
      barSales: department === "bar_services" ? departmentSales : 0,
      foodSales: department === "restaurant_services" ? departmentSales : 0,
      hotelSales: department === "hotel_services" ? departmentSales : 0,
      gameSales: department === "Games" ? departmentSales : 0,
    };

    console.log("Overview Data:", overview);

    return { overview, products, paymentDetailsByOrder };
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
