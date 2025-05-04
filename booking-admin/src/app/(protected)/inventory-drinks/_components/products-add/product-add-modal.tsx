import React, { useState } from "react";
import { Modal} from "@/components/ui-elements/modal"; 
import { Button } from "@/components/ui-elements/button";
import StockAddForm from "./add-new-stock";
import { Product } from "../products-table/products-table";

export default function StockAddModal({ products }: { products: Product[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button   
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white hover:bg-primary/90"
        label="Add New Stock"
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Stock"
        content={<StockAddForm products={products} 
        onClose={() => setIsOpen(false)} />}
      />
    </div>
  ); 
}
