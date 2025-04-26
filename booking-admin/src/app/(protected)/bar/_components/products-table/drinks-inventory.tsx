import { Select,} from "@/components/ui-elements/select"
import {  SelectItem } from "@/components/ui-elements/select-item"
import { ProductsList } from "./products-table"
import { useState } from "react";
import { Product } from "./products-table";

export default function DrinksInventoryPage({ products }: { products: Product[] }) {
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = products.filter((item) =>
    typeFilter ? item.type === typeFilter : true
  );

  return (
    <div>
      <Select value={typeFilter} onChange={setTypeFilter}>
        <SelectItem value="">All Types</SelectItem>
        <SelectItem value="Alcoholic">Alcoholic</SelectItem>
        <SelectItem value="Non-Alcoholic">Non-Alcoholic</SelectItem>
      </Select>
      <ProductsList products={filtered} />
    </div>
  );
}