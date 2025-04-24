import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";


type OverviewDataItem = {
  value: number;
};

type OverviewProps = {
  out_of_stock: OverviewDataItem;
  low_stock: OverviewDataItem;
  total_stock: OverviewDataItem;
  bar_stock_total: OverviewDataItem;
  restaurant_stock_total: OverviewDataItem;
};

export function OverviewCardsGroup({  out_of_stock, low_stock, total_stock, bar_stock_total, restaurant_stock_total }: OverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
  
      <OverviewCard
        label="Out Of Stock"
        data={{
          ...out_of_stock,
          value: +compactFormat(out_of_stock.value),
          date: 24
        }}
        // Icon={icons.ClosedDoor}
      />

      <OverviewCard
        label="Low Stock"
        data={{
          ...low_stock,
          value: compactFormat(low_stock.value),
          date: 24
        }}
        // Icon={icons.CheckIn}
      />
 
      <OverviewCard
        label="Total Available Stock"
        data={{
          ...total_stock,
          value: compactFormat(total_stock.value),
          date: 24
        }}
        // Icon={icons.CheckOut}
      />

    <OverviewCard
        label="Total Bar Stock"
        data={{
          ...bar_stock_total,
          value: compactFormat(bar_stock_total.value),
          date: 24
        }}
        // Icon={icons.CheckOut}
      />

   <OverviewCard
        label="Total Restaurant Stock"
        data={{
          ...total_stock,
          value: compactFormat(restaurant_stock_total.value),
          date: 24
        }}
        // Icon={icons.CheckOut}
      />
    </div>
  );
}
