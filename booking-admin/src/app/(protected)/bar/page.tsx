'use client';

import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { ProductsListSkeleton } from "./_components/products-table/skeleton";
import DrinksInventoryPage from "./_components/products-table/drinks-inventory";
import { handleDepartmentRecord } from "@/utils/handleDepartmentRecord";

interface ProductData {
  name: string;
  price: number;
  departmentStock?: number;
  restaurant_stock?: number;
  bar_stock: number;
  type: string;
  sold: number;
  amount: number;
  profit: number;
  [key: string]: any;
}

// Use formatDate if you want cleaner dates here
const generatePastWeekDateRanges = () => {
  const now = new Date();
  const ranges = [];

  for (let i = 1; i <= 7; i++) {
    const pastDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    ranges.push({
      label: `${i === 1 ? "Yesterday" : `${i} days ago`} (${pastDate.toLocaleDateString()})`,
      value: pastDate.toISOString().split("T")[0], // already formatted well
    });
  }

  return ranges;
};

const pastWeekDateRanges = generatePastWeekDateRanges();

export default function Products() {
  const [overviewData, setOverviewData] = useState({
    total_cash: { value: 0 },
    total_transfers: { value: 0 },
    total_sold: { value: 0 },
    low_stock: { value: 0 },
    out_of_stock: { value: 0 },
  });
  const [productsList, setProductsList] = useState<ProductData[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: pastWeekDateRanges[0].value, // ✅ default immediately instead of setting inside useEffect
    endDate: pastWeekDateRanges[0].value,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for date:", selectedDateRange.startDate);

        const { overview, products } = await handleDepartmentRecord(
          selectedDateRange.startDate,
          selectedDateRange.endDate,
          "bar_services",
          {
            inventoryEndpoint: "getDrinksList",
            departmentStockField: "bar_stock",
            otherStockField: "restaurant_stock",
          }
        );

        console.log("Data fetched successfully:", { overview, products });

        setOverviewData({
          total_cash: { value: overview.cashSales },
          total_transfers: { value: overview.totalTransfers },
          total_sold: { value: overview.totalSales },
          low_stock: { value: products.filter((p) => p.bar_stock <= 10).length },
          out_of_stock: { value: products.filter((p) => p.bar_stock === 0).length },
        });

        setProductsList(products);
      } catch (error) {
        console.error("Failed to fetch bar data:", error);
      }
    };

    if (selectedDateRange.startDate) {
      fetchData();
    }
  }, [selectedDateRange]);

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
          Select Date:
        </label>
        <select
          id="dateRange"
          className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={selectedDateRange.startDate} // keep the select value in sync
          onChange={(e) => {
            const selectedDate = e.target.value;
            setSelectedDateRange({ startDate: selectedDate, endDate: selectedDate });
          }}
        >
          {pastWeekDateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

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
