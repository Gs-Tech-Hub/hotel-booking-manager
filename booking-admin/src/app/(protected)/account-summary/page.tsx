'use client'
import React, { useEffect, useState } from "react";
import OverviewCardsGroup from "./_components/overview-cards/overview-account-summary";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { getAllDepartmentOverviews } from "./_components/allDepartmentRecords";

export default function AccountSummary() {
  useRoleGuard(["admin", "manager", "sales"]);

  const [overviewData, setOverviewData] = useState({
    cashSales: 0,
    totalTransfers: 0,
    totalSales: 0,
    totalUnits: 0,
    totalProfit: null as number | null,
    barSales: 0,
    foodSales: 0,
    hotelSales: 0,
    gameSales: 0,
    // products: [] as any[], // Added to store products
  });

  const [loading, setLoading] = useState(true);

  const [timeFrame, setTimeFrame] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    endDate: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        const departmentOverview = await getAllDepartmentOverviews(timeFrame.startDate, timeFrame.endDate);

        if (departmentOverview) {
          setOverviewData({
            cashSales: departmentOverview.cashSales,
            totalTransfers: departmentOverview.totalTransfers,
            totalSales: departmentOverview.totalSales,
            totalUnits: departmentOverview.totalUnits,
            totalProfit: departmentOverview.totalProfit,
            barSales: departmentOverview.barSales,
            foodSales: departmentOverview.foodSales,
            hotelSales: departmentOverview.hotelSales,
            gameSales: departmentOverview.gameSales,
            // products: departmentOverview.products, // Add the products data
          });
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [timeFrame]);

  return (
    <div>
      <h1>Sales Overview</h1>
      <div className="mb-4">
        <label>
          Start Date:
          <input
            type="date"
            value={new Date(timeFrame.startDate).toISOString().split("T")[0]}
            onChange={(e) =>
              setTimeFrame((prev) => ({
                ...prev,
                startDate: new Date(e.target.value).toISOString(),
              }))
            }
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={new Date(timeFrame.endDate).toISOString().split("T")[0]}
            onChange={(e) =>
              setTimeFrame((prev) => ({
                ...prev,
                endDate: new Date(e.target.value).toISOString(),
              }))
            }
          />
        </label>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <OverviewCardsGroup
          overview={overviewData}  // Pass the full overview data
        />
      )}
    </div>
  );
}
