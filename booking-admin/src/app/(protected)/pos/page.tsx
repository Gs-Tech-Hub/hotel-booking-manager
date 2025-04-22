"use client"
import { Suspense } from "react";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import POSLayout from "./_components/sales-section";


export default function POS() {
 

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
       <POSLayout />
      </Suspense>
    </>
  );
}
