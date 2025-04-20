"use client";

import { useState } from "react";
import { Button } from "@/components/ui-elements/button";
import { Select } from "@/components/ui-elements/select";
import { SelectItem } from "@/components/ui-elements/select-item";
import { ProductsList } from "./products-table";

export default function DrinksInventoryPage({ products }: { products: any[] }) {
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  

  const filtered = products.filter((item) =>
    typeFilter ? item.type === typeFilter : true
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    return b[sortKey as keyof typeof b] - a[sortKey as keyof typeof a];
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <Button className="bg-primary text-white hover:bg-primary/90" label="+ Add Product" />

        <div className="flex gap-2 flex-wrap">
          <Select value={typeFilter} onChange={setTypeFilter}>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="Soft">Soft</SelectItem>
            <SelectItem value="Alcoholic">Alcoholic</SelectItem>
            <SelectItem value="Juice">Juice</SelectItem>
            <SelectItem value="Water">Water</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </Select>

          <Select value={sortKey} onChange={setSortKey}>
            <SelectItem value="">Sort by</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="quantity">Quantity</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="profit">Profit</SelectItem>
          </Select>
        </div>
      </div>

      <ProductsList products={sorted} />
    </div>
  );
}
