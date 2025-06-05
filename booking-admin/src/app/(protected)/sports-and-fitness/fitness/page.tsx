"use client"
import dynamic from "next/dynamic";
import { OverviewCardsSkeleton } from "../_components/overview-cards/skeleton";
import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "../_components/overview-cards";
import { handleMainRecord } from "@/utils/ReportHelpers/mainHandle";

const GymMembershipTable = dynamic(() => import("../_components/gym-membership-table"), { ssr: false });
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
    registration: { value: 0, name: "" },
    renewal: { value: 0, name: "" },
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
  
          const { overview } = await handleMainRecord(
            selectedDateRange.startDate,
            selectedDateRange.endDate,
            "gym_memberships",
          );

          // Extract registration and renewal from gymItems
          let registration = { value: 0, name: "" };
          let renewal = { value: 0, name: "" };
          if (overview.gymItems && Array.isArray(overview.gymItems)) {
            for (const item of overview.gymItems) {
              if (item.name.toLowerCase().includes("registration")) {
                registration = { value: item.units, name: item.name };
              } else if (item.name.toLowerCase().includes("renewal")) {
                renewal = { value: item.units, name: item.name };
              }
            }
          }
  
          setOverviewData({
            total_cash: { value: overview.cashSales },
            total_transfers: { value: overview.totalTransfers },
            total_sold: { value: overview.totalSales },
            registration,
            renewal,
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
        <div className="mb-4">
        <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
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
            <option>... Getting data</option>
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
            registration={{ value: overviewData.registration.value }}
            renewal={{ value: overviewData.renewal.value }}
            total_earned={{ value: overviewData.total_sold.value }}
            cash={{ value: overviewData.total_cash.value}}
            transfer_card={{ value: overviewData.total_transfers.value }}
          />
        </Suspense>
      <div className="p-4">
      <GymMembershipTable 
      dataType={"gym"} 
      title="Gym Memberships"
      />
    </div>
    </div>
   
  );
}