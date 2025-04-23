'use client';

import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { ProductsListSkeleton } from "./_components/products-table/skeleton";
import DrinksInventoryPage from "./_components/products-table/drinks-inventory";
import { strapiService } from "@/utils/dataEndPoint";

export default function Products() {
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
    <div>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup categories={{
          value: 5
        }} low_stock={{
          value: 20
        }} out_of_stock={{
          value: 30
        }} total_sold={{
          value: 20
        }} />
      </Suspense>
      <div className="mt-4">
        <Suspense fallback={<ProductsListSkeleton />}>
          <DrinksInventoryPage products={productsList} />
        </Suspense>
      </div>
    </div>
  );
}
