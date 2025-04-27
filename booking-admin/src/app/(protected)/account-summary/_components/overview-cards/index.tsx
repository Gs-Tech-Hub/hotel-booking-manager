import { OverviewCard } from "./card";
import * as icons from "./icons";
import { formatPrice } from "@/utils/priceHandler";

type OverviewDataItem = {
    total: number; 
    cash: number; 
    online: number; 
    debt: number; 
};

type OverviewProps = {
  hotel: OverviewDataItem;
  restaurant: OverviewDataItem;
  bar: OverviewDataItem;
  games: OverviewDataItem;
  swimming_pool: OverviewDataItem;
};

export function OverviewCardsGroup({  hotel, restaurant, bar, games, swimming_pool }: OverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
  
      <OverviewCard
        label="Hotel Sales Total"
        data={{
          ...hotel,
          value: formatPrice((hotel.total), 'NGN'),
          date: 24 
        }}
        Icon={icons.ClosedDoor}
      />

      <OverviewCard
        label="Restaurant Sales Total"
        data={{
          ...restaurant,
          value: formatPrice((restaurant.total), 'NGN'),
          date: 24
        }}
        Icon={icons.CheckIn}
      />

      <OverviewCard
        label="Bar Sales Total"
        data={{
          ...bar,
          value: formatPrice((bar.total), 'NGN'),
          date: 24
        }}
        Icon={icons.CheckOut}
      />

     <OverviewCard
        label="Swimming Pool Sales Total"
        data={{
          ...swimming_pool,
          value: formatPrice((swimming_pool.total), 'NGN'),
          date: 24
        }}
        Icon={icons.CheckOut}
      />

      <OverviewCard
        label="Games Sales Total"
        data={{
          ...games,
          value: formatPrice((games.total), 'NGN'),
          date: 24
        }}
        Icon={icons.CheckOut}
      />
    </div>
  );
}
