import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";

type OverviewDataItem = {
  value: number;
};

type OverviewProps = {
  categories: OverviewDataItem;
  low_stock: OverviewDataItem;
  out_of_stock: OverviewDataItem;
  total_sold: OverviewDataItem;
};

export function OverviewCardsGroup({ categories, low_stock, out_of_stock, total_sold }: OverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Categories"
        data={{
          ...categories,
          value: compactFormat(categories.value),
        }}
        Icon={icons.OpenDoor}
      />

      <OverviewCard
        label="Low Stock"
        data={{
          ...low_stock,
          value: +compactFormat(low_stock.value),
        }}
        Icon={icons.ClosedDoor}
      />

      <OverviewCard
        label="Out-Of-Stock"
        data={{
          ...out_of_stock,
          value: compactFormat(out_of_stock.value),
        }}
        Icon={icons.CheckIn}
      />

      <OverviewCard
        label="Total Sold"
        data={{
          ...total_sold,
          value: compactFormat(total_sold.value),
        }}
        Icon={icons.CheckOut}
      />
    </div>
  );
}
