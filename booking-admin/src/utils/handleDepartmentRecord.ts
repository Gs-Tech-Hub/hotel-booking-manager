import { strapiService } from "@/utils/dataEndPoint";
import { Product } from "@/app/(protected)/bar/_components/products-table/products-table"; // Import the ProductData interface

interface OverviewData {
  cashSales: number;
  totalTransfers: number;
  totalSales: number;
}

interface DepartmentRecordData {
  overview: OverviewData;
  products?: Product[]; // Optional, as inventory may not always be needed
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
): Promise<{ overview: any; products: Product[] }> {
  const { inventoryEndpoint, departmentStockField, otherStockField } = options;

  // Fetch data from the API
  const products = await strapiService[inventoryEndpoint](
    { startDate, endDate, department },
    {},
    {}
  );

  // Map the products to match the ProductData interface
  const mappedProducts: Product[] = products.map((product: any) => ({
    ...product,
    bar_stock: product[departmentStockField] || 0,
    restaurant_stock: product[otherStockField] || 0,
    type: product.type || "",
    sold: product.sold || 0,
    amount: product.amount || 0,
    profit: product.profit || 0,
  }));

  // Example overview data
  const overview = {
    cashSales: 1000,
    totalTransfers: 500,
    totalSales: 1500,
  };

  return { overview, products: mappedProducts };
}

export async function fetchInventoryData(
  inventoryEndpoint: keyof typeof strapiService,
  departmentStockField: string,
  otherStockField: string
): Promise<Product[]> {
  try {
    // Fetch inventory data from the specified endpoint
    const inventory = await strapiService[inventoryEndpoint](
      {},
      {
        populate: "*",
        "pagination[pageSize]": 50,
      },
      {}
    );

    // Process inventory data for the products table
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

function formatDate(date: string): string {
  // Utility function to format date as needed by the API
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}