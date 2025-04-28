'use client'
import React, { useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { strapiService } from "@/utils/dataEndPoint";
import { Booking } from "@/types/bookingTypes";
import { ServiceItem } from "@/types/serviceTypes";

export default function AccountSummary() {
  useRoleGuard(["admin", "manager", "sales"]);

  const [overviewData, setOverviewData] = useState({
    hotel: { total: 0, cash: 0, online: 0, debt: 0 },
    bar: { total: 0, cash: 0, online: 0, debt: 0 },
    restaurant: { total: 0, cash: 0, online: 0, debt: 0 },
    swimming_pool: { total: 0, cash: 0, online: 0, debt: 0 },
    games: { total: 0, cash: 0, online: 0, debt: 0 },
  });

  const [timeFrame, setTimeFrame] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(), // Default: Last 30 days
    endDate: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingData = await strapiService.getBookings({
          populate: "*",
          "pagination[pageSize]": 50,
          "filters[createdAt][$gte]": timeFrame.startDate,
          "filters[createdAt][$lte]": timeFrame.endDate,
        });

        const otherServicesData = await strapiService.getBookingItems({
          populate: "*",
          "pagination[pageSize]": 100,
          "filters[createdAt][$gte]": timeFrame.startDate,
          "filters[createdAt][$lte]": timeFrame.endDate,
        });

        console.log("Booking Data:", bookingData);
        console.log("Other Services Data:", otherServicesData);

        const aggregatedData = {
          hotel: { total: 0, cash: 0, online: 0, debt: 0 },
          bar: { total: 0, cash: 0, online: 0, debt: 0 },
          restaurant: { total: 0, cash: 0, online: 0, debt: 0 },
          swimming_pool: { total: 0, cash: 0, online: 0, debt: 0 },
          games: { total: 0, cash: 0, online: 0, debt: 0 },
        };

        // Process booking data
        if (Array.isArray(bookingData)) {
          bookingData.forEach((booking: Booking) => {
            const roomPrice: number = booking.room?.price || 0;
            const nights: number = booking.nights || 0;
            const totalRoomPrice: number = roomPrice * nights;
            const paymentStatus: string = booking.payment?.PaymentStatus || "debt";
            const paymentMethod = (booking.payment?.paymentMethod || "cash") as "cash" | "online";

            aggregatedData.hotel.total += totalRoomPrice;

            if (paymentStatus === "success") {
              aggregatedData.hotel[paymentMethod] += totalRoomPrice;
            } else {
              aggregatedData.hotel.debt += totalRoomPrice;
            }
          });
        } else {
          console.warn("No booking data available or invalid format.");
        }

        // Process other services data
        if (Array.isArray(otherServicesData)) {
          otherServicesData.forEach((service: ServiceItem) => {
            const amountPaid: number = service.amount_paid || 0;
            const paymentStatus: string = service.status || "debt";
            const department: string = service.menu_category?.categoryName || "unknown";

            if (department === "Bar") {
              aggregatedData.bar.total += amountPaid;
              if (paymentStatus === "success") {
                aggregatedData.bar.cash += amountPaid;
              } else {
                aggregatedData.bar.debt += amountPaid;
              }
            } else if (department === "Restaurant") {
              aggregatedData.restaurant.total += amountPaid;
              if (paymentStatus === "success") {
                aggregatedData.restaurant.cash += amountPaid;
              } else {
                aggregatedData.restaurant.debt += amountPaid;
              }
            } else if (department === "Swimming Pool") {
              aggregatedData.swimming_pool.total += amountPaid;
              if (paymentStatus === "success") {
                aggregatedData.swimming_pool.cash += amountPaid;
              } else {
                aggregatedData.swimming_pool.debt += amountPaid;
              }
            }
          });
        } else {
          console.warn("No other services data available or invalid format.");
        }

        setOverviewData(aggregatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      <OverviewCardsGroup
        hotel={overviewData.hotel}
        restaurant={overviewData.restaurant}
        bar={overviewData.bar}
        swimming_pool={overviewData.swimming_pool}
        games={overviewData.games} // Placeholder for games data
      />
    </div>
  );
}