/* eslint-disable */

import { useState } from "react";
import { Button } from "@/components/ui-elements/button";
import { Select } from "@/components/ui-elements/select";
import { SelectItem } from "@/components/ui-elements/select-item";
import { Input } from "@/components/ui-elements/input";
import { strapiService } from "@/utils/dataEndPoint";
import { Product } from "../products-table/products-table";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "react-toastify";

interface TransferItem {
  productId: number;
  productName: string;
  productDocumentId: string;
  supplied: number;
  target: "supplied" | "quantity";
  error?: string;
  isSet?: boolean;
}

export default function StockAddForm({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  const [transferItems, setTransferItems] = useState<TransferItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const validate = (
    productId: number,
    field: "supplied" | "target",
    value: any
  ): string | undefined => {
    const supplied = Number(value);
    if (field === "supplied" && supplied < 0) return "Supplied cannot be negative";
    return;
  };

  const handleSelectProduct = (id: number) => {
    if (id === 0) return;
    const product = products.find((p) => p.id === id);
    if (!product || transferItems.find((item) => item.productId === id)) return;

    const error = validate(id, "supplied", 0);
    setTransferItems((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        productDocumentId: product.documentId,
        supplied: 0,
        target: "supplied",
        error,
      },
    ]);
    setSelectedProductId(0);
  };

  const handleChange = (
    productId: number,
    field: "supplied" | "target",
    value: any
  ) => {
    setTransferItems((prev) =>
      prev.map((item) =>
        item.productId === productId && !item.isSet
          ? {
              ...item,
              [field]: value,
              error: validate(productId, field, field === "supplied" ? value : item.supplied),
            }
          : item
      )
    );
  };

  const handleSet = (productId: number) => {
    setTransferItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? item.error
            ? item
            : { ...item, isSet: true }
          : item
      )
    );
  };

  const handleRemove = (productId: number) => {
    setTransferItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const validItems = transferItems.filter((item) => item.isSet && !item.error);

    for (const item of validItems) {
      try {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;

        const currentStock =
          item.target === "quantity" ? product.quantity ?? 0 : product.supplied ?? 0;
        const newTargetValue = currentStock + item.supplied;
        const newMainStock = (product.quantity ?? 0) + item.supplied;

        await strapiService.updateDrinksList(item.productDocumentId, {
          [item.target]: newTargetValue,
          quantity: newMainStock,
        });

        toast.success(`Updated ${product.name} (${item.target}) successfully`);
      } catch (err) {
        toast.error(`Failed to update ${item.productName || "product"}: ${err}`);
      }
    }

    setTransferItems([]);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Stock Supplied</h2>

      <div className="flex items-center gap-3">
        <Select
          value={selectedProductId}
          onChange={(value) => handleSelectProduct(Number(value))}
        >
          <SelectItem value={0}>Select Product</SelectItem>
          {products
            .filter((p) => !transferItems.find((t) => t.productId === p.id))
            .map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
        </Select>
      </div>

      {transferItems.map((item) => (
        <div
          key={item.productId}
          className="flex flex-col gap-1 mt-2 p-3 border rounded-md relative"
        >
          <div className="font-medium">{item.productName}</div>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={0}
              value={item.supplied || ""}
              onChange={(e) =>
                handleChange(item.productId, "supplied", Number(e.target.value))
              }
              disabled={item.isSet}
              className="w-24"
              placeholder="Qty"
            />
            <Select
              value={item.target}
              onChange={(val) =>
                handleChange(item.productId, "target", val as "supplied" | "quantity")
              }
              disabled={item.isSet}
            >
              <SelectItem value="supplied">Supplied</SelectItem>
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
      ))}

      {transferItems.length > 0 && (
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-600 text-white mt-3"
          label={submitting ? "Transferring..." : "Submit Supplied"}
        />
      )}
    </div>
  );
}
