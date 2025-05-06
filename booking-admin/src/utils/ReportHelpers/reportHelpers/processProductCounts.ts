/* eslint-disable */
import { BookingItem } from "@/types/bookingItem";

// Type for sales data for each product
interface SalesByProduct {
  [documentId: string]: {
    units: number;
    amount: number;
  };
}

// Function to process product_count
export const processProductCount = (
  bookingItems: BookingItem[],
  department: string, // department to filter by
  salesByProduct: SalesByProduct, // to accumulate sales per product
  departmentTotals: any // to keep track of department totals
) => {
  bookingItems.forEach((item: any) => {
    // Handle product_count for each item
    item.product_count?.forEach((productCount: any) => {
      if (productCount.department === department) {
        const unitsSold = productCount.product_count || 0;
        const pricePerUnit = productCount.price || 0;
        const productAmount = pricePerUnit * unitsSold;

        // Update department total sales
        departmentTotals.totalUnits += unitsSold;
        departmentTotals.totalAmount += productAmount;

        // Update sales totals for each product
        if (!salesByProduct[productCount.documentId]) {
          salesByProduct[productCount.documentId] = { units: 0, amount: 0 };
        }

        salesByProduct[productCount.documentId].units += unitsSold;
        salesByProduct[productCount.documentId].amount += productAmount;
      }
    });
  });
};

// The function to build department-wise product counts and also map each product to its department
export const getProductCountsByDepartment = (
  bookingItems: BookingItem[],
  department: string // department to process
) => {
  const productCountsByDept: Record<string, any[]> = {
    bar: [],
    restaurant: [],
    hotel: [],
    games: [],
    account: [],
    product_count: [], // this will store product_count items separately
  };

  bookingItems.forEach((item: any) => {
    // Process department-level items like drinks, food_items, etc.
    const { drinks, food_items, hotel_services, games, product_count } = item;

    // Process product_count separately
    product_count?.forEach((productCount: any) => {
      if (productCount.department === department) {
        productCountsByDept.product_count.push({
          id: item.id,
          documentId: item.bookings?.[0]?.id ?? item.documentId ?? null,
          name: productCount.name || "Unnamed Product",
          price: productCount.price || 0,
          quantity: productCount.product_count || 1,
          department: productCount.department,
        });
      }
    });

    // Process regular departmental items
    if (drinks.length > 0) {
      drinks.forEach((drink: { name: any; price: any; }, i: string | number) => {
        productCountsByDept.bar.push({
          id: item.id,
          documentId: item.bookings?.[0]?.id ?? item.documentId ?? null,
          name: drink.name,
          price: drink.price ?? 0,
          quantity: product_count?.[i]?.product_count ?? 1,
        });
      });
    }

    if (food_items.length > 0) {
      food_items.forEach((food: { name: any; price: any; }, i: string | number) => {
        productCountsByDept.restaurant.push({
          id: item.id,
          documentId: item.bookings?.[0]?.id ?? item.documentId ?? null,
          name: food.name,
          price: food.price ?? 0,
          quantity: product_count?.[i]?.product_count ?? 1,
        });
      });
    }

    if (hotel_services.length > 0) {
      hotel_services.forEach((svc: { name: any; price: any; }, i: string | number) => {
        productCountsByDept.hotel.push({
          id: item.id,
          documentId: item.bookings?.[0]?.id ?? item.documentId ?? null,
          name: svc.name,
          price: svc.price ?? 0,
          quantity: product_count?.[i]?.product_count ?? 1,
        });
      });
    }

    if (games.length > 0) {
      games.forEach((game: { name: any; price: any; }, i: string | number) => {
        productCountsByDept.games.push({
          id: item.id,
          documentId: item.bookings?.[0]?.id ?? item.documentId ?? null,
          name: game.name,
          price: game.price ?? 0,
          quantity: product_count?.[i]?.product_count ?? 1,
        });
      });
    }

    // Handle account-based items
    if (drinks.length === 0 && food_items.length === 0 && hotel_services.length === 0 && games.length === 0) {
      productCountsByDept.account.push({
        id: item.id,
        documentId: item.bookings?.[0]?.id ?? item.documentId ?? null,
        name: item.payment_type?.types ?? 'Account',
        price: item.amount_paid ?? 0,
        quantity: 1,
      });
    }
  });

  return productCountsByDept;
};
