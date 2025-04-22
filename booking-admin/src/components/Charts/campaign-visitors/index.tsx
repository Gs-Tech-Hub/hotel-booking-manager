"use client";

import { TrendingUpIcon } from "@/assets/icons";
import { compactFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getCampaignVisitorsData } from "@/services/charts.services";
import { CampaignVisitorsChart } from "./chart";
import { useEffect, useState } from "react";

export function CampaignVisitors({ className }: { className?: string }) {
  const [data, setData] = useState<{
    total_visitors: number;
    performance: number;
    chart: { x: string; y: number }[];
  }>({
    total_visitors: 0,
    performance: 0,
    chart: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCampaignVisitorsData();
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="border-b border-stroke px-6 py-5.5 dark:border-dark-3">
        <div className="flex justify-between">
          <h2 className="mb-1.5 text-2xl font-bold text-dark dark:text-white">
            Occupancy
          </h2>

          <div className="mb-0.5 text-2xl font-bold text-dark dark:text-white">
            {compactFormat(data.total_visitors)}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="text-sm font-medium">This weeks Occupancy</div>

          <div
            className={cn(
              "flex items-center gap-1.5",
              data.performance > 0 ? "text-green" : "text-red",
            )}
          >
            <TrendingUpIcon
              className={`${data.performance > 0 ? "-rotate-6" : "scale-y-[-1]"}`}
            />

            <span className="text-sm font-medium">{data.performance}%</span>
          </div>
        </div>
      </div>

      <CampaignVisitorsChart data={data.chart} />
    </div>
  );
}
