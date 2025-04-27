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
}

export interface ExtendedProduct extends Product {
  isRestaurant?: boolean;
}



export async function handleDepartmentRecord(
  startDate: string,
  endDate: string,
  department: "bar_services" | "restaurant_services" | "hotel_services", // Department type
  options: {
    inventoryEndpoint: keyof typeof strapiService;
    departmentStockField: string;
    otherStockField: string;
  }
): Promise<{ overview: OverviewCardData; products: ExtendedProduct[] }> {
  const { inventoryEndpoint, departmentStockField, otherStockField } = options;

  try {
    // --- Fetch booking items with drinks, food, and services ---
    const bookingItems = await strapiService.getBookingItems({
      "pagination[pageSize]": 70,
      "filters[createdAt][$gte]": formatDateRange(startDate),
      "filters[createdAt][$lte]": formatDateRange(endDate, true),
      "populate": "*",
    });

    console.log("Fetched Booking Items:", bookingItems);

    // --- Track cash, transfers, and product sales in one pass ---
    let cashSales = 0;
    let totalTransfers = 0;
    let salesByProduct: Record<string, { units: number; amount: number }> = {};
    let totalAmountCalculated = 0; // Track the total amount calculated from individual prices

    bookingItems.forEach((item: any) => {
      const paymentMethod = item.payment_type?.types?.trim().toLowerCase();
      const amountPaid = item.amount_paid || 0;

      // Calculate sales based on payment method
      if (paymentMethod === "cash") {
        cashSales += amountPaid;
      } else {
        totalTransfers += amountPaid;
      }

      let itemTotal = 0; // Track the calculated total price for this booking item

      // Check the department and only process related items
      if (department === "bar_services" && item.drinks) {
        item.drinks.forEach((drink: any) => {
          if (!drink?.documentId) return; // skip invalid drinks
          if (!salesByProduct[drink.documentId]) {
            salesByProduct[drink.documentId] = { units: 0, amount: 0 };
          }
          const qty = item.quantity || 0;
          const price = drink.price || 0;
          salesByProduct[drink.documentId].units += qty;
          salesByProduct[drink.documentId].amount += price * qty;
          itemTotal += price * qty; // Add the individual drink price to the total for this item
        });
      }

      if (department === "restaurant_services" && item.food_items) {
        item.food_items.forEach((food: any) => {
          if (!food?.documentId) return; // skip invalid food items
          if (!salesByProduct[food.documentId]) {
            salesByProduct[food.documentId] = { units: 0, amount: 0 };
          }
          const qty = item.quantity || 0;
          const price = food.price || 0;
          salesByProduct[food.documentId].units += qty;
          salesByProduct[food.documentId].amount += price * qty;
          itemTotal += price * qty; // Add the individual food price to the total for this item
        });
      }

      if (department === "hotel_services" && item.hotel_services) {
        item.hotel_services.forEach((service: any) => {
          if (!service?.documentId) return; // skip invalid hotel services
          if (!salesByProduct[service.documentId]) {
            salesByProduct[service.documentId] = { units: 0, amount: 0 };
          }
          const qty = item.quantity || 0;
          const price = service.price || 0;
          salesByProduct[service.documentId].units += qty;
          salesByProduct[service.documentId].amount += price * qty;
          itemTotal += price * qty; // Add the individual service price to the total for this item
        });
      }

      // Accumulate the total calculated amount for this booking item
      totalAmountCalculated += itemTotal;
    });

    // Now you can use `totalAmountCalculated` to compare with the `amount_paid`
    // or track total sales for each type of item

    console.log("Sales by Product:", salesByProduct);

    // --- Fetch inventory (NO department filter anymore) ---
    const inventory = await strapiService[inventoryEndpoint](
      {
        populate: "*",
        "pagination[pageSize]": 100,
      },
      {},
      {}
    );

    console.log("Fetched Inventory:", inventory);

// --- Map inventory with sales into Overview Cards ---
const products: ExtendedProduct[]  = inventory.map((product: any) => {
  const sales = salesByProduct[product.documentId] || { units: 0, amount: 0 };

  let stockField = 0;
  let otherStockField = 0;

  // Dynamically determine the stock fields based on the department
  if (department === "bar_services") {
    stockField = product[departmentStockField] || 0;  // Bar-specific stock
    otherStockField = product[otherStockField] || 0;  // For other products if needed
  } else if (department === "restaurant_services") {
    stockField = product[departmentStockField] || 0;  // Restaurant-specific stock
    otherStockField = product[otherStockField] || 0;  // For other products if needed
  } else if (department === "hotel_services") {
    stockField = product[departmentStockField] || 0;  // Hotel-specific stock
    otherStockField = product[otherStockField] || 0;  // For other products if needed
  }

  // Define flags for conditional display in the overview card
  const isFood = department === "restaurant_services";
  const isBar = department === "bar_services";
  const isHotel = department === "hotel_services";

  return {
    name: String(product.name || "Unnamed Product"),
    type: product.drink_type?.typeName || "",
    price: Number(product.price) || 0,
    stock: stockField,  // Use department-specific stock
    other_stock: otherStockField,  // For other products
    sold: sales.units,
    amount: sales.amount,
    profit: sales.amount - product.price * sales.units,
    isFood,  // Flag for food items
    isBar,   // Flag for bar items
    isHotel, // Flag for hotel items
  };
});

// --- Generate overview data ---
const overview = products.reduce(
  (acc, product) => {
    acc.totalSales += product.amount;
    acc.totalUnits += product.sold;
    acc.totalProfit += product.profit;

    // Track specific sales types
    if (product.isBar) acc.barSales += product.amount;
    if (product.isRestaurant) acc.foodSales += product.amount;
    if (product.isHotel) acc.hotelSales += product.amount;

    return acc;
  },
  {
    cashSales: cashSales,            
    totalTransfers: totalTransfers,
    totalSales: 0,
    totalUnits: 0,
    totalProfit: 0,
    barSales: 0,
    foodSales: 0,
    hotelSales: 0,
  }
);

// --- Return Overview Data with Conditional Flags ---
return {
  overview,
  products: products.map((product) => ({
    ...product,
    showStock: product.isBar || product.isRestaurant || product.isHotel,  // Only show stock for relevant products
    showProfit: product.isBar || product.isRestaurant || product.isHotel,  // Show profit where applicable
  })),
};

  } catch (error) {
    console.error("Error in handleDepartmentRecord:", error);
    throw error;
  }
}


// --- Format date helper (unchanged) ---
function formatDateRange(date: string, endOfDay = false): string {
  const d = new Date(date);
  if (endOfDay) {
    d.setHours(23, 59, 59, 999); // move to end of day
  } else {
    d.setHours(0, 0, 0, 0); // move to start of day
  }
  return d.toISOString();
}

