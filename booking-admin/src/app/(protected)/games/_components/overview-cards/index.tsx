import { compactFormat, standardFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { formatPrice } from "@/utils/priceHandler";

type OverviewDataItem = {
  value: number;
};

type OverviewProps = {
  payed: OverviewDataItem;
  not_payed: OverviewDataItem;
  total_earned: OverviewDataItem;
};

export function OverviewCardsGroup({  not_payed, payed, total_earned }: OverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
  
      <OverviewCard
        label="Not Payed"
        data={{
          ...not_payed,
          value: formatPrice((not_payed.value), 'NGN'),
        }}
        // Icon={icons.ClosedDoor}
      />

      <OverviewCard
        label="Payed"
        data={{
          ...payed,
          value: formatPrice((payed.value), 'NGN'),
        }}
        // Icon={icons.CheckIn}
      />

      <OverviewCard
        label="Total Amount Earned"
        data={{
          ...total_earned,
          value: formatPrice((total_earned.value), 'NGN'),
        }}
        // Icon={icons.CheckOut}
      />
    </div>
  );
}
