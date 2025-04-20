'use client'
import React, { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { ProductsListSkeleton } from "./_components/games-table/skeleton";
import DrinksInventoryPage from "./_components/games-table/games-list";
import { strapiService } from "@/utils/dataEndPoint";

export default function Games() {
  const [gamesList, setGamesList] = useState([]);
  const [overviewData, setOverviewData] = useState({
    not_payed: { value: 0 },
    payed: { value: 0 },
    total_earned: { value: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesData = await strapiService.getGamesList({ populate: '*' });

        // Set data for use by other components
        setGamesList(gamesData);

        // Compute overview stats without filtering the gamesList state
        let payedCount = 0;
        let notPayedCount = 0;
        let totalEarned = 0;

        for (const game of gamesData) {
          if (game.amount_paid > 0) {
            payedCount++;
            totalEarned += game.amount_paid;
          } else {
            notPayedCount++;
          }
        }

        setOverviewData({
          payed: { value: payedCount },
          not_payed: { value: notPayedCount },
          total_earned: { value: totalEarned }
        });

      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchData();
  }, []);

  console.log(gamesList);

  return (
    <div>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup 
          not_payed={overviewData.not_payed}
          payed={overviewData.payed}
          total_earned={overviewData.total_earned}
        />
      </Suspense>
      <div className="mt-4">
        <Suspense fallback={<ProductsListSkeleton />}>
          <DrinksInventoryPage games={gamesList} />
        </Suspense>
      </div>
    </div>
  );
}
