'use client';

interface ProductData {
  name: string;
  price: number;
  departmentStock?: number;
  restaurant_stock?: number;
  bar_stock: number; // Required for Product type
  type: string;
  sold: number; // Required to match Product type
  amount: number;
  profit: number;
  [key: string]: any;
}

import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { ProductsListSkeleton } from "./_components/products-table/skeleton";
import DrinksInventoryPage from "./_components/products-table/drinks-inventory";
import { handleDepartmentRecord } from "@/utils/handleDepartmentRecord";

export default function Products() {
  const [overviewData, setOverviewData] = useState({
    total_cash: { value: 0 },
    total_transfers: { value: 0 },
    total_sold: { value: 0 },
    low_stock: { value: 0 },
    out_of_stock: { value: 0 },
  });
  const [productsList, setProductsList] = useState<ProductData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for the bar department
        const { overview, products } = await handleDepartmentRecord(
          "2025-04-01", // Example start date
          "2025-04-26", // Example end date
          "Bar", // Department name
          {
            inventoryEndpoint: "getDrinksList",
            departmentStockField: "bar_stock",
            otherStockField: "restaurant_stock",
          }
        );

        // Map overview data to match the OverviewCardsGroup structure
        setOverviewData({
          total_cash: { value: overview.cashSales },
          total_transfers: { value: overview.totalTransfers },
          total_sold: { value: overview.totalSales },
          low_stock: { value: products.filter((p) => p.bar_stock <= 10).length },
          out_of_stock: { value: products.filter((p) => p.bar_stock === 0).length },
        });

        // Set products list for the table
        setProductsList(products);
      } catch (error) {
        console.error("Failed to fetch bar data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup
          total_cash={overviewData.total_cash}
          total_transfers={overviewData.total_transfers}
          total_sold={overviewData.total_sold}
          low_stock={overviewData.low_stock}
          out_of_stock={overviewData.out_of_stock}
        />
      </Suspense>
      <div className="mt-4">
        <Suspense fallback={<ProductsListSkeleton />}>
          <DrinksInventoryPage products={productsList} />
        </Suspense>
      </div>
    </div>
  );
}