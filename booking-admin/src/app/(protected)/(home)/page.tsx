"use client";

import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { GuestList } from "@/app/(protected)/(home)/_components/guest-list";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/context/auth-context";
import { handleBookingRecords } from "@/utils/handleBookingRecords";
import { DateRangePicker } from "@/components/FormElements/DateRangePicker";

export default function Home() {
  const router = useRouter();
  const { user, defaultLandingPage, loading } = useAuth();
  const [bookingStats, setbookingStats] = useState<{
    totalAvailableRooms: number;
    occupiedRooms: number;
    totalCheckIns: number;
    totalCheckOuts: number;
    cash: number;
    transfer: number;
    totalSales: number;
  }>({
    totalAvailableRooms: 0,
    occupiedRooms: 0,
    totalCheckIns: 0,
    totalCheckOuts: 0,
    cash: 0,
    transfer: 0,
    totalSales: 0
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  
  // 👇 Redirect based on role
  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      const data = await handleBookingRecords({
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
      setbookingStats(data);
      if (user && defaultLandingPage) {
        router.replace(defaultLandingPage);
      } else {
        router.replace("/auth/sign-in");
      }
    };
    fetchData();
  }, [user, defaultLandingPage, loading, router, dateRange]);

  const { totalAvailableRooms: availableRooms, occupiedRooms, totalCheckIns: checkin, totalCheckOuts: checkout, cash, transfer, totalSales } = bookingStats

  return (
    <>
      <div className="mb-4">
        <DateRangePicker
          onChange={(start, end) => setDateRange({ start, end })}
        />
      </div>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup
          availableRooms={{ value: availableRooms }}
          occupiedRooms={{ value: occupiedRooms }}
          checkin={{ value: checkin }}
          checkout={{ value: checkout }}
          cash={{ value: cash }}
          Transfer={{ value: transfer }}
          TotalSales={{ value: totalSales }}
        />
      </Suspense>

      
      <div className="mt-12 col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <GuestList dateRange={dateRange} />
          </Suspense>
       </div>
    </>
  );
}
