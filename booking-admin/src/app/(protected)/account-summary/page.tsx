'use client'
import React, { useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { getAllDepartmentOverviews } from "./_components/allDepartmentRecords";
import { Spinner } from "@/components/Spinner";

export default function AccountSummary() {
  useRoleGuard(["admin", "manager", "sales"]);

  const demoData = {
    cashSales: 0,
    totalTransfers: 0,
    totalSales: 0,
    totalUnits: 0,
    totalProfit: 0,
    barSales: 0,
    foodSales: 0,
    hotelBooking: 0,
    hotelBookingCash: 0,
    hotelBookingTransfer: 0,
    gameSales: 0,
    hotelServices: 0,
  };

  const [overviewData, setOverviewData] = useState(demoData);
  const [loading, setLoading] = useState(true);

  const [timeFrame, setTimeFrame] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    endDate: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const departmentOverview = await getAllDepartmentOverviews(
          timeFrame.startDate,
          timeFrame.endDate
        );

        setOverviewData((prev) => ({
          ...prev,
          ...departmentOverview,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame]);

  return (
    <div>
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
      <h1>SALES OVERVIEW</h1>
      {loading ? (
        <div>
          <Spinner />
          <OverviewCardsGroup
            hotel={{
              hotelBookingTotal: demoData.hotelBooking,
              Totalcash: demoData.cashSales,
              totalTransfers: demoData.totalTransfers,
              totalSales: demoData.totalSales,
            }}
            restaurant={{
              foodSales: demoData.foodSales,
            }}
            bar={{
              barSales: demoData.barSales,
            }}
            games={{
              gameSales: demoData.gameSales,
            }}
            hotel_services={{
              hotelServiceSales: demoData.hotelServices,
            }}
          />
        </div>
      ) : (
        <OverviewCardsGroup
          hotel={{
            hotelBookingTotal: overviewData.hotelBooking,
            Totalcash: overviewData.cashSales,
            totalTransfers: overviewData.totalTransfers,
            totalSales: overviewData.totalSales,
          }}
          restaurant={{
            foodSales: overviewData.foodSales,
          }}
          bar={{
            barSales: overviewData.barSales,
          }}
          games={{
            gameSales: overviewData.gameSales,
          }}
          hotel_services={{
            hotelServiceSales: overviewData.hotelServices,
          }}
        />
      )}
    </div>
  );
}
