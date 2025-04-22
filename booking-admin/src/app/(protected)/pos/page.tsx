"use client"
import { strapiService } from "@/utils/dataEndPoint";
import { useState, useEffect, Suspense } from "react";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import POSLayout from "./_components/sales-section";

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
       <POSLayout />
      </Suspense>
    </>
  );
}
