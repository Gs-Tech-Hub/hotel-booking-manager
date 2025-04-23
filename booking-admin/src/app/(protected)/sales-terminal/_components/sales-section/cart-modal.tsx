import React, { useState } from "react";
import { Modal } from "@/components/ui-elements/modal";
import { Button } from "@/components/ui-elements/button";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: {
    customerName: string;
    table: string;
    waiter: string;
    items: CartItem[];
  }) => void;
  initialItems?: CartItem[];
}

export function CartModal({
  isOpen,
  onClose,
  onSubmit,
  initialItems = [],
}: CartModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [table, setTable] = useState("");
  const [waiter, setWaiter] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);

  const incrementItem = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const processTransaction = async () => {
    if (!customerName || !table || !waiter || cartItems.length === 0) {
      toast.warning("Please fill out all fields and add items.");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        customerName,
        table,
        waiter,
        items: cartItems,
      });
      toast.success("Order placed successfully!");
      onClose();
    } catch (error) {
      toast.error(`"Failed to process order." ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <fieldset className="space-y-4" disabled={isLoading}>
      <div>
        <label className="block font-medium">Customer Name</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-3 py-2 mt-1 border rounded"
          placeholder="Enter customer name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Table</label>
          <select
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded"
          >
            <option value="">Select Table</option>
            <option value="Table 1">Table 1</option>
            <option value="Table 2">Table 2</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Waiter</label>
          <select
            value={waiter}
            onChange={(e) => setWaiter(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded"
          >
            <option value="">Select Waiter</option>
            <option value="Waiter A">Waiter A</option>
            <option value="Waiter B">Waiter B</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Order Details</h3>
        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-500">No items added yet.</p>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ₦{item.price} x {item.quantity}
                  </p>
                </div>
                <Button
                  label="+"
                  onClick={() => incrementItem(item.id)}
                  className="px-3 py-1"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </fieldset>
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <Button label="Cancel" onClick={onClose} />
      <Button
        label={isLoading ? "Processing..." : "Process Transaction"}
        onClick={processTransaction}
        className={cn(isLoading && "opacity-50")}
      />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cart & Checkout"
      content={content}
      footer={footer}
    />
  );
}
