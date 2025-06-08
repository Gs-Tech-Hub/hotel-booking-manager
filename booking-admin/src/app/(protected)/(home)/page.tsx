"use client";

import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { GuestList } from "@/app/(protected)/(home)/_components/guest-list";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/context/auth-context";
import { handleBookingRecords } from "@/utils/handleBookingRecords";

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
  
  // 👇 Redirect based on role
  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const data = await handleBookingRecords({
        startDate: yesterday.toISOString(),
        endDate: now.toISOString()
      })
       setbookingStats(data);
      if (user && defaultLandingPage) {
        router.replace(defaultLandingPage);
      } else {
        router.replace("/auth/sign-in");
      }
    };
    fetchData();
  }, [user, defaultLandingPage, loading, router]); 

  const { totalAvailableRooms: availableRooms, occupiedRooms, totalCheckIns: checkin, totalCheckOuts: checkout, cash, transfer, totalSales } = bookingStats

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup
          availableRooms={{ value: availableRooms }}
          occupiedRooms={{ value: occupiedRooms }}
          checkin={{ value: checkin }}
          checkout={{ value: checkout }}
          cash={{value: cash}}
          Transfer={{value: transfer}}
          TotalSales={{value: totalSales}}
        />
      </Suspense>

      
      <div className="mt-12 col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <GuestList />
          </Suspense>
       </div>
    </>
  );
}
