"use client";
/* eslint-disable */
import { Suspense, useEffect, useState } from "react";
import { OverviewCardsSkeleton } from "../account-summary/_components/overview-cards/skeleton";
import POSLayout from "./_components/sales-section";
import { MenuItem } from "@/app/stores/useCartStore";
import { strapiService } from "@/utils/dataEndPoint";

export default function POS() {
  const [department, setDepartment] = useState<'Bar' | 'Restaurant' | 'Hotel-Services'>('Bar');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);  // Loading state for menu items


  const fetchMenuItems = async (dept: typeof department) => {
    setLoading(true);  // Set loading to true when fetching data
    let items: MenuItem[] = [];

    if (dept === 'Bar') {
      const response = await strapiService.getBarAndClubs({
        populate: '*',
        'pagination[pageSize]': 50,
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
          department: 'Bar',
        })) || []
      ) || [];

    } else if (dept === 'Restaurant') {
      const response = await strapiService.getRestaurants({
        populate: '*',
        'pagination[pageSize]': 50,
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
          department: 'Restaurant',
        })) || []
      ) || [];

    } else if (dept === 'Hotel-Services') {
      const response = await strapiService.getHotelServices({
        populate: '*',
        'pagination[pageSize]': 50,
      });
        // console.log('Hotel Services Response:', response);
      items = response?.map((item: any) => ({
        id: item.id.toString(),
        documentId: item.documentId,
        name: item.name,
        price: item.price,
        quantity: 1,
        department: 'Hotel-Services',
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

  const handleDepartmentChange = (dept: 'Bar' | 'Restaurant' | 'Hotel-Services') => {
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
