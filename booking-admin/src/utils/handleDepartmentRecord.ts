/* eslint-disable */
import { strapiService } from "@/utils/dataEndPoint";
import { Product } from "@/app/(protected)/bar/_components/products-table/products-table";

export interface OverviewCardData {
  // products: any[];
  cashSales: number;
  totalTransfers: number;
  totalSales: number;
  totalUnits: number;
  totalProfit: number;
  barSales: number;
  foodSales: number;
  hotelSales: number;
  gameSales: number; // Add game sales if needed
}

export interface ExtendedProduct extends Product {
  isRestaurant?: boolean;
  isGame?: boolean; // Flag for game items
}



export async function handleDepartmentRecord(
  startDate: string,
  endDate: string,
  department: "bar_services" | "restaurant_services" | "hotel_services" | "Games", // Department type
  options: {
    inventoryEndpoint: keyof typeof strapiService;
    departmentStockField: string;
    otherStockField: string;
    fetchInventory?: boolean; // Optional parameter to control fetching inventory
  },
  fetchInventory = true // New optional parameter to control fetching inventory
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
      const totalItemAmountPaid = item.amount_paid || 0;
    
      let departmentHasRecord = false;
      let itemTotal = 0; // Track the total for this item within the specific department
    
      if (department === "bar_services" && item.drinks?.length > 0) {
        departmentHasRecord = true;
        item.drinks.forEach((drink: any) => {
          if (!drink?.documentId) return;
          if (!salesByProduct[drink.documentId]) {
            salesByProduct[drink.documentId] = { units: 0, amount: 0 };
          }
          const qty = item.quantity || 0;
          const price = drink.price || 0;
          salesByProduct[drink.documentId].units += qty;
          salesByProduct[drink.documentId].amount += price * qty;
          itemTotal += price * qty;
        });
      }
    
      if (department === "restaurant_services" && item.food_items?.length > 0) {
        departmentHasRecord = true;
        item.food_items.forEach((food: any) => {
          if (!food?.documentId) return;
          if (!salesByProduct[food.documentId]) {
            salesByProduct[food.documentId] = { units: 0, amount: 0 };
          }
          const qty = item.quantity || 0;
          const price = food.price || 0;
          salesByProduct[food.documentId].units += qty;
          salesByProduct[food.documentId].amount += price * qty;
          itemTotal += price * qty;
        });
      }
    
      if (department === "hotel_services" && item.hotel_services?.length > 0) {
        departmentHasRecord = true;
        item.hotel_services.forEach((service: any) => {
          if (!service?.documentId) return;
          if (!salesByProduct[service.documentId]) {
            salesByProduct[service.documentId] = { units: 0, amount: 0 };
          }
          const qty = item.quantity || 0;
          const price = service.price || 0;
          salesByProduct[service.documentId].units += qty;
          salesByProduct[service.documentId].amount += price * qty;
          itemTotal += price * qty;
        });
      }
    
      if (department === "Games" && item.games?.length > 0) {
        departmentHasRecord = true;
        item.games.forEach((game: any) => {
          if (!game?.documentId) return;
          if (!salesByProduct[game.documentId]) {
            salesByProduct[game.documentId] = { units: 0, amount: 0 };
          }
          const qty = game.count || 0;  // for games use 'count'
          const price = game.amount_paid || 0; // game amount paid might differ per session
          salesByProduct[game.documentId].units += qty;
          salesByProduct[game.documentId].amount += price * qty;
          itemTotal += price * qty;
      
          // Debugging log to check sales data being added
          console.log(`Adding Game Sale: ${game.documentId}, Qty: ${qty}, Amount: ${price * qty}`);
        });
      }      
    
      // Only if this item belongs to the selected department, track its payment
      if (departmentHasRecord) {
        if (paymentMethod === "cash") {
          cashSales += totalItemAmountPaid;
        } else {
          totalTransfers += totalItemAmountPaid;
        }
        totalAmountCalculated += itemTotal;
      }
    });
    
    // Now you can use `totalAmountCalculated` to compare with the `amount_paid`
    // or track total sales for each type of item

    console.log("Sales by Product:", salesByProduct);

    let inventory: any[] = [];
    if (fetchInventory) {
      // --- Fetch inventory (NO department filter anymore) ---
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

    // --- Map inventory with sales into Overview Cards ---
    const products: ExtendedProduct[] = inventory.map((product: any) => {
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
      } else if (department === "Games") {
        stockField = product[departmentStockField] || 0;  // Game-specific stock
        otherStockField = product[otherStockField] || 0;  // For other products if needed
      }

      // Define flags for conditional display in the overview card
      const isFood = department === "restaurant_services";
      const isBar = department === "bar_services";
      const isHotel = department === "hotel_services";
      const isGame = department === "Games";

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
        isGame, // Flag for game items,
        bar_stock: product.bar_stock || 0,
        drink_type: product.drink_type || null
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
        if (product.isGame) acc.gameSales += product.amount; // Add game sales if needed

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
        gameSales: 0, 
      }
    );

    // --- Return Overview Data with Conditional Flags ---
    return {
      overview,
      products: products.map((product) => ({
        ...product,
        showStock: product.isBar || product.isRestaurant || product.isHotel,  // Only show stock for relevant products
        showProfit: product.isBar || product.isRestaurant || product.isHotel || product.isGame,  // Show profit where applicable
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

