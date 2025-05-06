'use client'
import { handleMainRecord } from "@/utils/ReportHelpers/mainHandle";
import { useState, useEffect } from "react";
import type { OverviewCardData, ExtendedProduct } from "@/utils/ReportHelpers/mainHandle";

export default function DemoPage() {
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

  const [loadingStock, setLoadingStock] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: pastWeekDateRanges[4].value,
    endDate: pastWeekDateRanges[4].value,
  });
  const [records, setRecords] = useState<{ overview: OverviewCardData; products: ExtendedProduct[]; } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStock(true);
      try {
        console.log("Fetching data for date:", selectedDateRange.startDate);

        const result = await handleMainRecord(
          selectedDateRange.startDate,
          selectedDateRange.endDate,
          "games",
   
    );

        setRecords(result);
      } catch (error) {
        console.error("Failed to fetch bar data:", error);
      } finally {
        setLoadingStock(false);
      }
    };

    fetchData();
  }, [selectedDateRange]);

  return (
    <div>
      <h2>Demo Page</h2>
      {loadingStock ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(records, null, 2)}</pre>
      )}
    </div>
  );
}
