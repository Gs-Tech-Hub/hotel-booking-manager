import { OverviewCard } from "./card";
import { formatPrice } from "@/utils/priceHandler";

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
          value: formatPrice((total_cash.value), 'NGN'),
        }}
      />

      <OverviewCard
        label="Card | Bank Transfer"
        data={{
          ...total_transfers,
          value: formatPrice((total_transfers.value), 'NGN'),
        }}
      />

      <OverviewCard
        label="Total Sold"
        data={{
          ...total_sold,
          value: formatPrice((total_sold.value), 'NGN'),
        }}
      />

      <OverviewCard
        label="Low Stock"
        data={{
          ...low_stock,
          value: (low_stock.value),
        }}
      />

      <OverviewCard
        label="Out-Of-Stock"
        data={{
          ...out_of_stock,
          value: (out_of_stock.value),
        }}
        // Icon={icons.CheckIn}
      />

  
    </div>
  );
}
