import { strapiService } from "@/utils/dataEndPoint";
import { Product } from "@/app/(protected)/bar/_components/products-table/products-table";

interface OverviewData {
  cashSales: number;
  totalTransfers: number;
  totalSales: number;
}

export async function handleDepartmentRecord(
  startDate: string,
  endDate: string,
  department: string,
  options: {
    inventoryEndpoint: keyof typeof strapiService;
    departmentStockField: string;
    otherStockField: string;
  }
): Promise<{ overview: OverviewData; products: Product[] }> {
  const { inventoryEndpoint, departmentStockField, otherStockField } = options;

  try {
    // --- Fetch booking items with drinks ---
    const bookingItems = await strapiService.getBookingItems({
      "pagination[pageSize]": 200,
        "filters[createdAt][$gte]": formatDate(startDate),
        "filters[createdAt][$lte]": formatDate(endDate),
      populate: "*"
    });

    console.log("Fetched Booking Items:", bookingItems);

    // --- Track cash, transfers, and product sales in one pass ---
    const salesByProduct: Record<string, { units: number; amount: number }> = {};
    let cashSales = 0;
    let totalTransfers = 0;

    bookingItems.forEach((item: any) => {
      const paymentMethod = item.paymentMethod;
      const amountPaid = item.amount_paid || 0;

      // Calculate sales based on payment method
      if (paymentMethod === "cash") {
        cashSales += amountPaid;
      } else {
        totalTransfers += amountPaid;
      }

      // Track drinks sold
      if (item.drinks && Array.isArray(item.drinks)) {
        item.drinks.forEach((drink: any) => {
          if (!drink?.documentId) return; // skip invalid drinks
          if (!salesByProduct[drink.documentId]) {
            salesByProduct[drink.documentId] = { units: 0, amount: 0 };
          }
          const qty = item.quantity || 0;
          salesByProduct[drink.documentId].units += qty;
          salesByProduct[drink.documentId].amount += (drink.price || 0) * qty;
        });
      }
    });

    console.log("Sales by Product:", salesByProduct);

    // --- Fetch inventory (NO department filter anymore) ---
    const inventory = await strapiService[inventoryEndpoint](
      {},
      {
        populate: "*",
        "pagination[pageSize]": 100,
      },
      {}
    );

    console.log("Fetched Inventory:", inventory);

    // --- Map inventory with sales ---
    const products: Product[] = inventory.map((product: any) => {
      const sales = salesByProduct[product.documentId] || { units: 0, amount: 0 };

      return {
        name: String(product.name || "Unnamed Product"),
        type: product.type || "",
        price: Number(product.price) || 0,
        bar_stock: Number(product[departmentStockField]) || 0,
        restaurant_stock: Number(product[otherStockField]) || 0,
        sold: sales.units,
        amount: sales.amount,
        profit: sales.amount - (product.price * sales.units),
      };
    });

    const overview: OverviewData = {
      cashSales,
      totalTransfers,
      totalSales: cashSales + totalTransfers,
    };

    console.log("Overview Data:", overview);

    return { overview, products };
  } catch (error) {
    console.error("Error in handleDepartmentRecord:", error);
    throw error;
  }
}

// --- Fetch Inventory Utility ---
export async function fetchInventoryData(
  inventoryEndpoint: keyof typeof strapiService,
  departmentStockField: string,
  otherStockField: string
): Promise<Product[]> {
  try {
    const inventory = await strapiService[inventoryEndpoint](
      {},
      {
        populate: "*",
        "pagination[pageSize]": 100,
      },
      {}
    );

    console.log("Fetched Inventory (Simple):", inventory);

    return inventory.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      departmentStock: item[departmentStockField],
      otherStock: item[otherStockField],
    }));
  } catch (error) {
    console.error(`Error fetching inventory data:`, error);
    throw error;
  }
}

// --- Format date helper (unchanged) ---
function formatDate(date: string): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}
