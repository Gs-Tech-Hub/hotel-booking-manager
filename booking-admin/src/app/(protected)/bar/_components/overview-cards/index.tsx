import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";

type OverviewDataItem = {
  value: number;
};

type OverviewProps = {
  total_cash: OverviewDataItem;
  total_transfers: OverviewDataItem;
  total_sold: OverviewDataItem;

  low_stock: OverviewDataItem;
  out_of_stock: OverviewDataItem;
};

export function OverviewCardsGroup({ total_cash, total_transfers, low_stock, out_of_stock, total_sold }: OverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Cash"
        data={{
          ...total_cash,
          value: compactFormat(total_cash.value),
        }}
      />

      <OverviewCard
        label="Card | Bank Transfer"
        data={{
          ...total_transfers,
          value: compactFormat(total_transfers.value),
        }}
      />

      <OverviewCard
        label="Total Sold"
        data={{
          ...total_sold,
          value: compactFormat(total_sold.value),
        }}
      />

      <OverviewCard
        label="Low Stock"
        data={{
          ...low_stock,
          value: +compactFormat(low_stock.value),
        }}
      />

      <OverviewCard
        label="Out-Of-Stock"
        data={{
          ...out_of_stock,
          value: compactFormat(out_of_stock.value),
        }}
        // Icon={icons.CheckIn}
      />

  
    </div>
  );
}
