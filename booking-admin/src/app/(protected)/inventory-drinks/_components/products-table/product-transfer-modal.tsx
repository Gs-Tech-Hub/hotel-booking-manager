import React, { useState } from "react";
import { Modal} from "@/components/ui-elements/modal"; 
import { Button } from "@/components/ui-elements/button";
import StockTransferForm from "./product-transfer";
import { Product } from "./products-table";

export default function StockTransferModal({ products }: { products: Product[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button   
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white hover:bg-primary/90"
        label="Transfer Stock"
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Transfer Stock"
        content={<StockTransferForm products={products} 
        onClose={() => setIsOpen(false)} />}
      />
    </div>
  ); 
}
