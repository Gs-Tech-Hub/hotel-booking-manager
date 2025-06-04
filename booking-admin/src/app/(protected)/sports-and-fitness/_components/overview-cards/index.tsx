import { OverviewCard } from "./card";
import { formatPrice } from "@/utils/priceHandler";

type OverviewDataItem = {
  value: number;
};

type OverviewProps = {
  registration: OverviewDataItem;
  renewal: OverviewDataItem;
  total_earned: OverviewDataItem;
  cash: OverviewDataItem;
  transfer_card: OverviewDataItem;

};

export function OverviewCardsGroup({  registration, renewal, total_earned, transfer_card, cash }: OverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
  
      <OverviewCard
        label="Cash"
        data={{
          ...registration,
          value: formatPrice((cash.value), 'NGN'),
          date: 24

        }}
        // Icon={icons.ClosedDoor}
      />

      <OverviewCard
        label="Bank Transfer & Card"
        data={{
          ...transfer_card,
          value: formatPrice((transfer_card.value), 'NGN'),
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
        label="Registrations"
        data={{
          ...cash,
          value: (registration.value),
          date: 24
        }}
        // Icon={icons.CheckOut}
      />
      <OverviewCard
        label="Renewals"
        data={{
          ...cash,
          value: (renewal.value),
          date: 24
        }}
        // Icon={icons.CheckOut}
      />
    </div>
  );
}
