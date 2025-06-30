"use client";
/* eslint-disable */
import { Suspense, useEffect, useState } from "react";
import { OverviewCardsSkeleton } from "../account-summary/_components/overview-cards/skeleton";
import POSLayout from "./_components/sales-section";
import { MenuItem } from "@/app/stores/useCartStore";
import { strapiService } from "@/utils/dataEndpoint";

export default function POS() {
  const [department, setDepartment] = useState<'bar' | 'restaurant' | 'hotel'>('bar');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);  // Loading state for menu items


  const fetchMenuItems = async (dept: typeof department) => {
    setLoading(true);  // Set loading to true when fetching data
    let items: MenuItem[] = [];

    if (dept === 'bar') {
      const response = await strapiService.menuEndpoints.getBarAndClubs({
        populate: '*',
        'pagination[pageSize]': 100,
      });
        // console.log('Bar Response:', response);
      items = response?.flatMap((bar: any) =>
        bar.drinks?.map((drink: any) => ({
          id: drink.id.toString(),
          documentId: drink.documentId,
          name: drink.name,
          price: drink.price,
          available: drink.bar_stock,
          quantity: drink.quantity || 1,
          department: 'bar',
        })) || []
      ) || [];

    } else if (dept === 'restaurant') {
      const response = await strapiService.menuEndpoints.getRestaurants({
        populate: '*',
        'pagination[pageSize]': 100,
      });
        // console.log('Hotel Response:', response);
      items = response?.flatMap((restaurant: any) =>
        restaurant.food_items?.map((item: any) => ({
          id: item.id.toString(),
          documentId: item.documentId,
          name: item.name,
          price: item.price,
          quantity: 1,
          available: 100,
          department: 'restaurant',
        })) || []
      ) || [];

    } else if (dept === 'hotel') {
      const response = await strapiService.menuEndpoints.getHotelServices({
        populate: '*',
        'pagination[pageSize]': 100,
      });
        // console.log('Hotel Services Response:', response);
      items = response?.map((item: any) => ({
        id: item.id.toString(),
        documentId: item.documentId,
        name: item.name,
        price: item.price,
        quantity: 1,
        department: 'hotel',
        available:  100, // Assuming a default value for available items
      })) || [];
    }

    // console.log("Fetched Items:", items);
    setMenuItems(items);
    setLoading(false); // Set loading to false after fetching is complete
  };

  useEffect(() => {
    fetchMenuItems(department);
  }, []);

  const handleDepartmentChange = (dept: 'bar' | 'restaurant' | 'hotel') => {
    setDepartment(dept);
    fetchMenuItems(dept);
  };

  return (
    <div className="mb-4">
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <POSLayout
          menuItems={menuItems}
          onDepartmentChange={handleDepartmentChange}
          loading={loading}  // Pass loading state to POSLayout
        />
      </Suspense>
    </div>
  );
}
