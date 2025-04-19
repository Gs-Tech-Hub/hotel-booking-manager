'use client'
import React from "react"
import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { ProductsListSkeleton } from "./_components/games-table/skeleton";
import DrinksInventoryPage from "./_components/games-table/games-list";
import { strapiService } from "@/utils/dataEndPoint";

export default function Games() {
    const [gamesList, setGamesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesData = await strapiService.getGamesList({ populate: '*' });
        setGamesList(gamesData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
    <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup 
         not_payed={{
          value: 20
        }} payed={{
          value: 30
        }} total_earned={{
          value: 2000
        }} />
      </Suspense>
      <div className="mt-4">
        <Suspense fallback={<ProductsListSkeleton />}>
          <DrinksInventoryPage games={gamesList} />
        </Suspense>
      </div>

    </div>
  );
}