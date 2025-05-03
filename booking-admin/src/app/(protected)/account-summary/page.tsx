  'use client'
import React, { useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { getAllDepartmentOverviews } from "./_components/allDepartmentRecords";
import { handleBookingRecords } from "@/utils/handleBookingRecords";

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
    hotelBooking: 0,
    hotelBookingCash: 0,
    hotelBookingTransfer: 0,
    gameSales: 0,
    hotelServices: 0,
  });

  const [loading, setLoading] = useState(true);

  const [timeFrame, setTimeFrame] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    endDate: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        const bookingOview = await handleBookingRecords(timeFrame);
        console.log("booking data:", bookingOview);

        const departmentOverview = await getAllDepartmentOverviews(timeFrame.startDate, timeFrame.endDate);

        if (departmentOverview) {
          setOverviewData({
            //general departments total
            cashSales: departmentOverview.cashSales,
            totalTransfers: departmentOverview.totalTransfers,
            totalSales: departmentOverview.totalSales,
            //bar account
            totalUnits: departmentOverview.totalUnits,
            totalProfit: departmentOverview.totalProfit,
            barSales: departmentOverview.barSales,
            //restaurant
            foodSales: departmentOverview.foodSales,
            //swimming-pool/others
            hotelServices: departmentOverview.hotelSales,
            //games
            gameSales: departmentOverview.gameSales,
            //hote Records
            hotelBooking: bookingOview.hotel.total,
            hotelBookingCash: bookingOview.hotel.cash,
            hotelBookingTransfer: bookingOview.hotel.online,

            
          });
        }

        console.log("check the hotel services data:", overviewData.cashSales)

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
        <p>Loading...</p>
      ) : (
        <OverviewCardsGroup
        hotel={{
          hotelBookingTotal: overviewData.hotelBooking,
          Totalcash: (overviewData.cashSales + overviewData.hotelBookingCash),
          totalTransfers: (overviewData.totalTransfers + overviewData.hotelBookingTransfer),
          totalSales: (overviewData.hotelBooking + overviewData.totalSales),
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
