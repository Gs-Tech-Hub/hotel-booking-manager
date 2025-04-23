'use client'
import React, { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { ProductsListSkeleton } from "./_components/games-table/skeleton";
import DrinksInventoryPage from "./_components/games-table/games-list";
import { strapiService } from "@/utils/dataEndPoint";
import { useRoleGuard } from '@/hooks/useRoleGuard';


export default function Games() {
  useRoleGuard(['admin', 'manager', 'games']); // only these can access

  const [gamesList, setGamesList] = useState([]);
  const [overviewData, setOverviewData] = useState({
    not_payed: { value: 0 },
    payed: { value: 0 },
    total_earned: { value: 0 },
    total_games: { value: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const gamesData = await strapiService.getGamesList({
           populate: '*', 
           'pagination[pageSize]': 50, 
          'filters[createdAt][$gte]': startOfDay.toISOString(),
          'filters[createdAt][$lte]': endOfDay.toISOString(),  
         });

        // Set data for use by other components
        setGamesList(gamesData);

        // Compute overview stats without filtering the gamesList state
        let payed = 0;
        let notPayed = 0;
        let totalGames = 0;

        for (const game of gamesData || []) {
          const amountPaid = Number(game.amount_paid) || 0; 
          const amountOwed = Number(game.amount_owed) || 0;
          const gameCount = Number(game.count) || 0;

          totalGames += gameCount;

          if (game.game_status === 'completed') {
            payed += amountPaid;
          } else if (game.game_status === 'ongoing') {
            notPayed += amountOwed;
          }
        }
        
        const totalEarned = payed + notPayed;
        
        setOverviewData({
          payed: { value: payed },
          not_payed: { value: notPayed },
          total_earned: { value: totalEarned },
          total_games: { value: totalGames }
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
          total_games={overviewData.total_games}
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
