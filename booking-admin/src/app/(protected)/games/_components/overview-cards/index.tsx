import { OverviewCard } from "./card";
import { formatPrice } from "@/utils/deprecated/priceHandler";

type OverviewDataItem = {
  value: number;
};

type OverviewProps = {
  payed: OverviewDataItem;
  not_payed: OverviewDataItem;
  total_earned: OverviewDataItem;
  total_games: OverviewDataItem;
};

export function OverviewCardsGroup({  not_payed, payed, total_earned, total_games }: OverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
  
      <OverviewCard
        label="Not Payed"
        data={{
          ...not_payed,
          value: formatPrice((not_payed.value), 'NGN'),
          date: 24

        }}
        // Icon={icons.ClosedDoor}
      />

      <OverviewCard
        label="Payed"
        data={{
          ...payed,
          value: formatPrice((payed.value), 'NGN'),
          date: 24
        }}
        // Icon={icons.CheckIn}
      />

      <OverviewCard
        label="Total Amount Earned"
        data={{
          ...total_earned,
          value: formatPrice((total_earned.value), 'NGN'),
          date: 24
        }}
        // Icon={icons.CheckOut}
      />

      <OverviewCard
        label="Total Games Played"
        data={{
          ...total_games,
          value: (total_games.value),
          date: 24
        }}
        // Icon={icons.CheckOut}
      />
    </div>
  );
}
