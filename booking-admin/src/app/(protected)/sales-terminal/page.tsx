"use client"
import { Suspense, useState } from "react";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import POSLayout from "./_components/sales-section";
import { MenuItem } from "@/app/stores/useCartStore";


export default function POS() {
  const menuItems: MenuItem[] = []; // Initialize with your menu items data
  const [department, setDepartment] = useState<'Bar' | 'Restaurant' | 'Swimming-Pool'>('Bar');

  return (
    <>
      {/* Dropdown for selecting date */}
      <div className="mb-4">
        <select
          className="form-select w-auto"
          value={department}
          onChange={(e) => setDepartment(e.target.value as 'Bar' | 'Restaurant' | 'Swimming-Pool')}
        >
          <option value="today">Today&apos;s Games</option>
          <option value="yesterday">Yesterday&apos;s Games</option>
        </select>
      </div>
      <Suspense fallback={<OverviewCardsSkeleton />}>
       <POSLayout menuItems={menuItems} />
      </Suspense>
    </>
  );
}

