import { Select,} from "@/components/ui-elements/select"
import {  SelectItem } from "@/components/ui-elements/select-item"
import { ProductsList } from "./products-table"
import { useState } from "react";
import { Product } from "./products-table";

export default function DrinksInventoryPage({ products }: { products: Product[] }) {
 const [typeFilter, setTypeFilter] = useState("");
   const [sortKey, setSortKey] = useState("");
 
  
   const drinkTypes: string[] = Array.from(
     new Set(products.map(p => p.type || ""))
   ).filter(Boolean).sort();
   
 
   // Filter by selected type
   const filtered = products.filter(item =>
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
         <Select value={typeFilter} onChange={setTypeFilter}>
             <SelectItem value="">All Types</SelectItem>
             {drinkTypes.map(type => (
               <SelectItem key={type} value={type}>
                 {type}
               </SelectItem>
             ))}
           </Select>
 
           <Select value={sortKey} onChange={setSortKey}>
             <SelectItem value="">Sort by</SelectItem>
             <SelectItem value="price">Price</SelectItem>
             <SelectItem value="quantity">Quantity</SelectItem>
             <SelectItem value="sold">Sold</SelectItem>
             <SelectItem value="bar_stock">Bar Stock</SelectItem>
           </Select>
         </div>
       </div>
      <ProductsList products={sorted} />
    </div>
  );
}