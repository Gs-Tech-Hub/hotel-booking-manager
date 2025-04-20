import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";

type OverviewDataItem = {
  value: number;
};

type OverviewProps = {
  views: OverviewDataItem;
  profit: OverviewDataItem;
  products: OverviewDataItem;
  users: OverviewDataItem;

};

export async function OverviewCardsGroup({ views, profit, products, users }: OverviewProps) {

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Available Rooms"
        data={{
          ...views,
          value: compactFormat(views.value),
          date: 24

        }}
        Icon={icons.OpenDoor}
      />

      <OverviewCard
        label="Occupied Rooms"
        data={{
          ...profit,
          value:  + compactFormat(profit.value),
          date: 24

        }}
        Icon={icons.ClosedDoor}
      />

      <OverviewCard
        label="Check In"
        data={{
          ...products,
          value: compactFormat(products.value),
          date: 24

        }}
        Icon={icons.CheckIn}
      />

      <OverviewCard
        label="Check Out"
        data={{
          ...users,
          value: compactFormat(users.value),
          date: 24

        }}
        Icon={icons.CheckOut}
      />
    </div>
  );
}
