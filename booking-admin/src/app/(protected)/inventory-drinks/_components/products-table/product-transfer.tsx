import { useState } from "react";
import { Button } from "@/components/ui-elements/button";
import { Select } from "@/components/ui-elements/select";
import { SelectItem } from "@/components/ui-elements/select-item";
import { Input } from "@/components/ui-elements/input";
import { strapiService } from "@/utils/dataEndPoint";
import { Product } from "./products-table";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "react-toastify";

interface TransferItem {
  productId: number;
  productName?: string;
  productDocumentId?: string;
  quantity: number;
  target: "bar" | "restaurant";
  error?: string;
  isSet?: boolean;
}

export default function StockTransferForm({ products, onClose }: { products: Product[],   onClose: () => void;
}) {
  const [transferItems, setTransferItems] = useState<TransferItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);


  const validate = (productId: number, field: string, value: any): string | undefined => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const mainStock = product.quantity ?? 0;
    let quantity = value;

    if (field === "quantity") {
      quantity = Number(value);
      if (quantity <= 0) return "Quantity must be greater than 0";
      if (quantity > mainStock) return `Only ${mainStock} in main stock`;
      if (mainStock <= (product.threshold ?? 0))
        return `⚠️ Stock is low (below threshold: ${product.threshold})`;
    }

    return;
  };

  const handleSelectProduct = (id: number) => {
    if (id === 0) return;
    if (!transferItems.find(item => item.productId === id)) {
      const error = validate(id, "quantity", 0);
      setTransferItems(prev => [...prev, { productId: id, quantity: 0, target: "bar", error }]);
      setSelectedProductId(0);
    }
  };

  const handleChange = (
    productId: number,
    field: "quantity" | "target",
    value: any
  ) => {
    setTransferItems(prev =>
      prev.map(item =>
        item.productId === productId && !item.isSet
          ? { ...item, [field]: value, error: validate(productId, field, value) }
          : item
      )
    );
  };

  const handleSet = (productId: number) => {
    setTransferItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? item.error
            ? item // don't set if error
            : { ...item, isSet: true }
          : item
      )
    );
  };

  const handleRemove = (productId: number) => {
    setTransferItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const validItems = transferItems.filter(item => item.isSet && !item.error);
    if (validItems.length === 0) {
      toast.error("No valid items to transfer");
      return;
    }

    for (const item of validItems) {
      try {
        const product = products.find(p => p.id === item.productId);
        if (!product) continue;

        const currentTargetStock =
          item.target === "bar" ? product.bar_stock ?? 0 : product.restaurant_stock ?? 0;
        const newTargetStock = currentTargetStock + item.quantity;
        const newMainStock = (product.quantity ?? 0) - item.quantity;
        if (newMainStock < 0) {
          toast.error(`Not enough stock for ${product.name}`);
          continue;
        }

        await strapiService.updateDrinksList(product.documentId, {
          [item.target === "bar" ? "bar_stock" : "restaurant_stock"]: newTargetStock,
          quantity: newMainStock,
        });
        
        toast.success(`Updated ${product.name} to ${item.target}`);
      } catch (err) {
        toast.error(`Failed to update product ID ${item.productName}`);
      }
    }

    setTransferItems([]);
    setSubmitting(false);
    onClose(); 

  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Stock Transfer</h2>

      <div className="flex items-center gap-3">
        <Select
          value={selectedProductId}
          onChange={(value) => handleSelectProduct(Number(value))}
        >
          <SelectItem value={0}>Select Product</SelectItem>
          {products
            .filter(p => !transferItems.find(t => t.productId === p.id))
            .map(product => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
        </Select>
      </div>

      {transferItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        return (
          <div
            key={item.productId}
            className="flex flex-col gap-1 mt-2 p-3 border rounded-md relative"
          >
            <div className="font-medium">{product?.name}</div>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min={1}
                value={item.quantity || ""}
                onChange={e =>
                  handleChange(item.productId, "quantity", Number(e.target.value))
                }
                disabled={item.isSet}
                className="w-24"
                placeholder="Qty"
              />
              <Select
                value={item.target}
                onChange={val =>
                  handleChange(item.productId, "target", val as "bar" | "restaurant")
                }
              >
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
              </Select>
              {!item.isSet && (
                <Button 
                  onClick={() => handleSet(item.productId)} 
                  className="bg-blue-600 text-white"
                  label="Set"
                />
              )}
              <button
                onClick={() => handleRemove(item.productId)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {item.error && (
              <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertTriangle className="w-4 h-4" /> {item.error}
              </div>
            )}
          </div>
        );
      })}

      {transferItems.length > 0 && (
        <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-green-600 text-white mt-3"
        label={submitting ? "Transferring..." : "Submit Transfer"}
      />
      
      )}
    </div>
  );
}
