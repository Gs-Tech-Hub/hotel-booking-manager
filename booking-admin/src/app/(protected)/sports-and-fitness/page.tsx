"use client"
import dynamic from "next/dynamic";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { handleMainRecord } from "@/utils/ReportHelpers/mainHandle";

const GymMembershipTable = dynamic(() => import("./_components/gym-membership-table"), { ssr: false });
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


export default function SportsAndFitnessDashboard() {
  const [loadingData, setLoadingData] = useState(false);
  const [overviewData, setOverviewData] = useState({
    total_cash: { value: 0 },
    total_transfers: { value: 0 },
    total_sold: { value: 0 },
    low_stock: { value: 0 },
    out_of_stock: { value: 0 },
  });
const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: pastWeekDateRanges[0].value,
    endDate: pastWeekDateRanges[0].value,
  });

  
    useEffect(() => {
      const fetchData = async () => {
        setLoadingData(true); // Start loading
        try {
          console.log("Fetching data for date:", selectedDateRange.startDate);
  
          const { overview, products } = await handleMainRecord(
            selectedDateRange.startDate,
            selectedDateRange.endDate,
            "gym_memberships",
          );
  
          console.log("Data fetched successfully:", { overview, products });
  
          setOverviewData({
            total_cash: { value: overview.cashSales },
            total_transfers: { value: overview.totalTransfers },
            total_sold: { value: overview.totalSales },
            low_stock: { value: products.filter((p) => p.bar_stock <= 10).length },
            out_of_stock: { value: products.filter((p) => p.bar_stock === 0).length },
          });
          } catch (error) {
        console.error("Failed to fetch bar data:", error);
      } finally {
        setLoadingData(false); // Stop loading no matter what
      }
    };

    if (selectedDateRange.startDate) {
      fetchData();
    }
  }, [selectedDateRange]);
  return (
    <div>
        <Suspense fallback={<OverviewCardsSkeleton />}>
            <OverviewCardsGroup 
              registration={{ value: 0}}
              renewal={{ value: 0 }}
              total_earned={{ value: overviewData.total_sold.value }}
              cash={{ value: overviewData.total_cash.value}}
              transfer_card={{ value: overviewData.total_transfers.value }}
            />
          </Suspense>
      <div className="p-4">
      <GymMembershipTable />
    </div>
    </div>
   
  );
}