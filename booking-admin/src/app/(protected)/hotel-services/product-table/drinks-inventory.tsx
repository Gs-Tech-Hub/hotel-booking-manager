import { Select } from "@/components/ui-elements/select";
import { SelectItem } from "@/components/ui-elements/select-item";
import { useState } from "react";
import { ProductsList } from "./products-table";
import type { ExtendedProduct } from "@/utils/ReportHelpers/mainHandle";

export default function DrinksInventoryPage({ products }: { products: ExtendedProduct[] }) {
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const serviceTypes: string[] = Array.from(
    new Set(products.map((p) => p.type || ""))
  ).filter(Boolean).sort();

  // Filter by selected type
  const filtered = products.filter((item) =>
    typeFilter ? item.type === typeFilter : true
  );

  // Sort by selected key
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    return Number(b[sortKey as keyof typeof b]) - Number(a[sortKey as keyof typeof a]);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          <Select value={typeFilter} onChange={(value: string | number) => setTypeFilter(String(value))}>
            <SelectItem value="">All Types</SelectItem>
            {serviceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </Select>

          <Select value={sortKey} onChange={(value: string | number) => setSortKey(String(value))}>
            <SelectItem value="">Sort by</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="profit">Profit</SelectItem>
          </Select>
        </div>
      </div>
      <ProductsList products={sorted} />
    </div>
  );
}
