import { OverviewCard } from "./card";
import * as icons from "./icons";
import { formatPrice } from "@/utils/deprecated/priceHandler";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/Spinner";

export interface OverviewDataItem {
  // lodgment
  hotelBookingTotal?: number;
  hotelBookingCash?: number;
  hotelBookingTransfer?: number;
  hotelBookingNotPaid?: number;
  //general account
  Totalcash?: number;
  totalTransfers?: number;
  totalSales?: number;
  //bar account
  totalUnits?: number;
  totalProfit?: number | null;
  barSales?: number;
  //restaurant account
  foodSales?: number;
  //swimming-pool and other services and sales
  hotelServiceSales?: number;
  //games
  gameSales?: number;
  //staff and employee
  debt?: number;
}

type OverviewProps = {
  hotel: OverviewDataItem;
  restaurant: OverviewDataItem;
  bar: OverviewDataItem;
  games: OverviewDataItem;
  hotel_services: OverviewDataItem;
};

export function OverviewCardsGroup({
  hotel,
  restaurant,
  bar,
  games,
  hotel_services,
}: OverviewProps) {
  const [loadedBatches, setLoadedBatches] = useState<number>(0);

  useEffect(() => {
    const loadBatches = async () => {
      for (let i = 1; i <= 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        setLoadedBatches(i);
      }
    };
    loadBatches();
  }, []);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        {/* Total Hotel Sales */}
        <OverviewCard
          label="Total"
          data={{
            value: formatPrice(hotel.totalSales ?? 0, "NGN"),
            date: 24,
          }}
          Icon={icons.ClosedDoor}
        />

        {/* Restaurant Cash Sales */}
        <OverviewCard
          label="Cash"
          data={{
            value: formatPrice(hotel.Totalcash ?? 0, "NGN"),
            date: 24,
          }}
          Icon={icons.CheckIn}
        />

        {/* Card & Bank Transfer Sales for Bar */}
        <OverviewCard
          label="Card | Transfer"
          data={{
            value: formatPrice(hotel.totalTransfers ?? 0, "NGN"),
            date: 24,
          }}
          Icon={icons.CheckOut}
        />
      </div>

      <div className="mt-4">
        <h2>DEPARTMENT SUMMARY</h2>
      </div>

      <div className="grid mt-4 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Swimming Pool Total */}
        {loadedBatches >= 1 ? (
          <OverviewCard
            label="Swimming Pool Total"
            data={{
              value: formatPrice(hotel_services.hotelServiceSales ?? 0, "NGN"),
              date: 24,
            }}
            Icon={icons.ClosedDoor}
          />
        ) : (
          <Spinner />
        )}

        {/* Games Total */}
        {loadedBatches >= 2 ? (
          <OverviewCard
            label="Games Total"
            data={{
              value: formatPrice(games.gameSales ?? 0, "NGN"),
              date: 24,
            }}
            Icon={icons.CheckIn}
          />
        ) : (
          <Spinner />
        )}

        {/* Restaurant Total */}
        {loadedBatches >= 3 ? (
          <OverviewCard
            label="Restaurant"
            data={{
              value: formatPrice(restaurant.foodSales ?? 0, "NGN"),
              date: 24,
            }}
            Icon={icons.CheckOut}
          />
        ) : (
          <Spinner />
        )}

        {/* Bar Total */}
        {loadedBatches >= 3 ? (
          <OverviewCard
            label="Bar"
            data={{
              value: formatPrice(bar.barSales ?? 0, "NGN"),
              date: 24,
            }}
            Icon={icons.CheckOut}
          />
        ) : (
          <Spinner />
        )}

        {/* Hotel Services Total */}
        {loadedBatches >= 3 ? (
          <OverviewCard
            label="Hotel"
            data={{
              value: formatPrice(hotel.hotelBookingTotal ?? 0, "NGN"),
              date: 24,
            }}
            Icon={icons.CheckOut}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
