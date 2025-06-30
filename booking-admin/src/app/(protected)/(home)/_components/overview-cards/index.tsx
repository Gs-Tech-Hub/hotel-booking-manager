import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { formatPrice } from "@/utils/deprecated/priceHandler";

type OverviewDataItem = {
  value: number;
};

type OverviewProps = {
  availableRooms: OverviewDataItem;
  occupiedRooms: OverviewDataItem;
  checkin: OverviewDataItem;
  checkout: OverviewDataItem;
  cash: OverviewDataItem;
  Transfer: OverviewDataItem;
  TotalSales: OverviewDataItem;
};

export function OverviewCardsGroup({ availableRooms, occupiedRooms, checkin, checkout, cash, Transfer, TotalSales }: OverviewProps) {

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Available Rooms"
        data={{
          ...availableRooms,
          value: compactFormat(availableRooms.value),
          date: 24

        }}
        Icon={icons.OpenDoor}
      />

      <OverviewCard
        label="Occupied Rooms"
        data={{
          ...occupiedRooms,
          value:  + compactFormat(occupiedRooms.value),
          date: 24

        }}
        Icon={icons.ClosedDoor}
      />

      <OverviewCard
        label="Check In"
        data={{
          ...checkin,
          value: compactFormat(checkin.value),
          date: 24

        }}
        Icon={icons.CheckIn}
      />

      <OverviewCard
        label="Check Out"
        data={{
          ...checkout,
          value: compactFormat(checkout.value),
          date: 24

        }}
        Icon={icons.CheckOut}
      />

       <OverviewCard
        label="Cash"
        data={{
          ...checkout,
          value: formatPrice(cash.value, "NGN"),
          date: 24

        }}
        // Icon={icons.CheckOut}
      />

       <OverviewCard
        label="Bank Transfer | Card "
        data={{
          ...checkout,
          value: formatPrice(Transfer.value, "NGN"),
          date: 24

        }}
        // Icon={icons.CheckOut}
      />

       <OverviewCard
        label="Total Sales"
        data={{
          ...checkout,
          value: formatPrice(TotalSales.value, "NGN"),
          date: 24

        }}
        // Icon={icons.CheckOut}
      />
    </div>
  );
}
