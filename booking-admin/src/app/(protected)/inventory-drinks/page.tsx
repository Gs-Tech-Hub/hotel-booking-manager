"use client"
/* eslint-disable */

import { Suspense, useEffect, useState } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import DrinksInventoryPage from "./_components/products-table/drinks-inventory";
import { ProductsListSkeleton } from "./_components/products-table/skeleton";
import { strapiService } from "@/utils/dataEndpoint";
import { useRoleGuard } from "@/hooks/useRoleGuard";


export default function Bar() {
  useRoleGuard(['admin', 'manager']);
  const [productsList, setProductsList] = useState([]);
  const [stockSummary, setStockSummary] = useState({
    out_of_stock: 0,
    low_stock: 0,
    total_stock: 0,
    bar_stock_total: 0,
    restaurant_stock_total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await strapiService.menuEndpoints.getDrinksList({
          'populate': '*',
          'pagination[pageSize]': 120,
        });
  
        const products = productsData;
  
        let outOfStock = 0;
        let lowStock = 0;
        let totalStock = 0;
        let barStockTotal = 0;
        let restaurantStockTotal = 0;
  
        products.forEach((product: any) => {
          const quantity = product.quantity ?? 0;
          const threshold = product.threshold ?? 0;
  
          if (quantity === 0) {
            outOfStock += 1;
          } else {
            if (quantity < threshold) {
              lowStock += 1;
            }
            totalStock += 1;
          }
          if ((product.bar_stock ?? 0) > 0) {
            barStockTotal += 1;
          }
  
          if ((product.restaurant_stock ?? 0) > 0) {
            restaurantStockTotal += 1;
          }
        });
        
  
        setProductsList(products);
        setStockSummary({
          out_of_stock: outOfStock,
          low_stock: lowStock,
          total_stock: totalStock,
          bar_stock_total: barStockTotal,
          restaurant_stock_total: restaurantStockTotal,   
        });
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup 
        out_of_stock={{
          value: stockSummary.out_of_stock
        }} 
        low_stock={{
          value: stockSummary.low_stock
        }} 
        total_stock={{
          value: stockSummary.total_stock
        }} 
        bar_stock_total={{
          value: stockSummary.bar_stock_total
        }}
        restaurant_stock_total={{
          value: stockSummary.restaurant_stock_total
        }}
        />
      </Suspense>

      <Suspense fallback={<ProductsListSkeleton />}>
        <DrinksInventoryPage products={productsList} />
      </Suspense>
    </>
  );
}
