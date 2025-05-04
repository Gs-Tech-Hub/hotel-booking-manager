"use client";

import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Suspense, useEffect } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { GuestList } from "@/app/(protected)/(home)/_components/guest-list";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/context/auth-context";

export default function Home() {
  const router = useRouter();
  const { user, defaultLandingPage, loading } = useAuth();
  
  // 👇 Redirect based on role
  useEffect(() => {
    if (loading) return;

    if (user && defaultLandingPage) {
      router.replace(defaultLandingPage);
    } else {
      router.replace("/auth/sign-in");
    }
  }, [user, defaultLandingPage, loading, router]);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup
          views={{ value: 0 }}
          profit={{ value: 0 }}
          products={{ value: 0 }}
          users={{ value: 0 }}
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
