import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";

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
          value: +compactFormat(not_payed.value),
        }}
        // Icon={icons.ClosedDoor}
      />

      <OverviewCard
        label="Payed"
        data={{
          ...payed,
          value: compactFormat(payed.value),
        }}
        // Icon={icons.CheckIn}
      />

      <OverviewCard
        label="Total Amount"
        data={{
          ...total_earned,
          value: compactFormat(total_earned.value),
        }}
        // Icon={icons.CheckOut}
      />
    </div>
  );
}
