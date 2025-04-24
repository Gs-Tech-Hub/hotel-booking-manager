'use client';
import React, { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { ProductsListSkeleton } from "./_components/games-table/skeleton";
import DrinksInventoryPage from "./_components/games-table/games-list";
import { strapiService } from "@/utils/dataEndPoint";
import { useRoleGuard } from '@/hooks/useRoleGuard';

export default function Games() {
  useRoleGuard(['admin', 'manager', 'games']);

  const [gamesList, setGamesList] = useState([]);
  const [overviewData, setOverviewData] = useState({
    not_payed: { value: 0 },
    payed: { value: 0 },
    total_earned: { value: 0 },
    total_games: { value: 0 }
  });
  const [dateRange, setDateRange] = useState<'today' | 'yesterday'>('today');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        let startOfDay, endOfDay;

        if (dateRange === 'today') {
          startOfDay = new Date(now.setHours(0, 0, 0, 0));
          endOfDay = new Date(now.setHours(23, 59, 59, 999));
        } else {
          const yesterday = new Date(now.setDate(now.getDate() - 1));
          startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
          endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));
        }

        const gamesData = await strapiService.getGamesList({
          populate: '*',
          'pagination[pageSize]': 50,
          'filters[createdAt][$gte]': startOfDay.toISOString(),
          'filters[createdAt][$lte]': endOfDay.toISOString(),
        });
        console.log("Games data:", gamesData);

        setGamesList(gamesData);

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
  }, [dateRange]);

  return (
    <div>
      {/* Dropdown for selecting date */}
      <div className="mb-4">
        <select
          className="form-select w-auto"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as 'today' | 'yesterday')}
        >
          <option value="today">Today's Games</option>
          <option value="yesterday">Yesterday's Games</option>
        </select>
      </div>

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
