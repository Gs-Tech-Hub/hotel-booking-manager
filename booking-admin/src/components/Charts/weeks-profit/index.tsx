"use client";

import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { getWeeksBookingData } from "@/services/charts.services";
import { WeeksProfitChart } from "./chart";
import { useEffect, useState } from "react";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function WeeksBooking({ className, timeFrame }: PropsType) {
  const [data, setData] = useState<{
    sales: { x: string; y: number }[];
    revenue: { x: string; y: number }[];
  }>({
    sales: [],
    revenue: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await getWeeksBookingData(timeFrame);
      setData(result);
    };
    fetchData();
  }, [timeFrame]);

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Bookings {timeFrame || "this week"}
        </h2>

        <PeriodPicker
          items={["this week", "last week"]}
          defaultValue={timeFrame || "this week"}
          sectionKey="weeks_profit"
        />
      </div>

      <WeeksProfitChart data={data} />
    </div>
  );
}
