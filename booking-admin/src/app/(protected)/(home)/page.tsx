"use client";

import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { GuestList } from "@/app/(protected)/(home)/_components/guest-list";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/context/auth-context";
import { handleBookingRecords } from "@/utils/ReportHelpers/handleBookingRecords";

const generatePastWeekDateRanges = () => {
  const now = new Date();
  const ranges = [];
  for (let i = 0; i <= 7; i++) {
    const pastDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    ranges.push({
      label:
        i === 0
          ? `Today (${pastDate.toLocaleDateString()})`
          : i === 1
          ? `Yesterday (${pastDate.toLocaleDateString()})`
          : `${i} days ago (${pastDate.toLocaleDateString()})`,
      value: pastDate.toISOString().split("T")[0],
    });
  }
  return ranges;
};

const pastWeekDateRanges = generatePastWeekDateRanges();

export default function Home() {
  const router = useRouter();
  const { user, defaultLandingPage, loading } = useAuth();
  const [loadingData] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
     startDate: pastWeekDateRanges[0].value,
     endDate: pastWeekDateRanges[0].value,
   });
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
  // 👇 Redirect based on role
  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      // Use timeFrame if provided, otherwise use selectedDateRange
      const data = await handleBookingRecords({
        startDate:  selectedDateRange.startDate,
        endDate:  selectedDateRange.endDate,
      });
      setbookingStats(data);
      if (user && defaultLandingPage) {
        router.replace(defaultLandingPage);
      } else {
        router.replace("/auth/sign-in");
      }
    };
    fetchData();
  }, [user, defaultLandingPage, loading, router, selectedDateRange]);

  const { totalAvailableRooms: availableRooms, occupiedRooms, totalCheckIns: checkin, totalCheckOuts: checkout, cash, transfer, totalSales } = bookingStats

  return (
    <>
     <div className="mb-4">
        <label htmlFor="dateRange" className="block text-lg font-medium text-gray-700">
          Select Date:
        </label>
        <select
          id="dateRange"
          disabled={loadingData}
          className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={selectedDateRange.startDate}
          onChange={(e) => {
            const selectedDate = e.target.value;
            setSelectedDateRange({ startDate: selectedDate, endDate: selectedDate });
          }}
        >
          {loadingData ? (
            <option>... Getting Stock data</option>
          ) : (
            pastWeekDateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))
          )}
        </select>
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
            <GuestList dateRange={{ start: selectedDateRange.startDate, end: selectedDateRange.endDate }} />
          </Suspense>
       </div>
    </>
  );
}
