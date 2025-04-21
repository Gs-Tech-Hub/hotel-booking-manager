"use client"

import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import DrinksInventoryPage from "./_components/products-table/drinks-inventory";
import { ProductsListSkeleton } from "./_components/products-table/skeleton";
import { strapiService } from "@/utils/dataEndPoint";

type PropsType = {
  searchParams: {
    selected_time_frame?: string;
  };
};

export default function Bar({ searchParams }: PropsType) {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await strapiService.getDrinksList({ 'pagination[pageSize]': 50 });
        setProductsList(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup payed={{
          value: 0
        }} not_payed={{
          value: 0
        }} total_earned={{
          value: 0
        }} />
      </Suspense>
      <div className="mt-4">
        <Suspense fallback={<ProductsListSkeleton />}>
          <DrinksInventoryPage products={productsList} />
        </Suspense>
      </div>
    </>
  );
}
