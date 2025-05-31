"use client"
import dynamic from "next/dynamic";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";

const GymMembershipTable = dynamic(() => import("./_components/gym-membership-table"), { ssr: false });

export default function SportsAndFitnessDashboard() {
  return (
    <div>
        <Suspense fallback={<OverviewCardsSkeleton />}>
            <OverviewCardsGroup 
              registration={{ value: 0}}
              renewal={{ value: 0 }}
              total_earned={{ value: 0}}
              cash={{ value: 0}}
              transfer_card={{ value: 0 }}
            />
          </Suspense>
      <div className="p-4">
      <GymMembershipTable />
    </div>
    </div>
   
  );
}