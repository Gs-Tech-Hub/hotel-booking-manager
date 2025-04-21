import React, { useState } from "react";
import { useOrderStore, Order, PaymentMethod } from "@/app/stores/useOrderStore";
import { Button } from "@/components/ui-elements/button";
import { Modal } from "@/components/ui-elements/modal";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);
  const completeOrder = useOrderStore((state) => state.completeOrder);
  const [isLoading, setIsLoading] = useState(false);

  if (!order) return null;

  const handleCompleteSale = async () => {
    if (!order.paymentMethod) {
      toast.warning("Please select a payment method.");
      return;
    }

    setIsLoading(true);
    try {
      await completeOrder(order.id); // pass the specific order id
      toast.success("Order completed successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to complete the order.");
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="space-y-4">
      <div className="space-y-2 text-sm">
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Table:</strong> {order.tableNumber}</p>
        <p><strong>Waiter:</strong> {order.waiterName}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Items:</h3>
        <ul className="mt-2 space-y-1">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>₦{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 font-semibold">
        Total: ₦{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
      </div>

      {order.status === "active" && (
        <div className="mt-6">
          <label className="block mb-2 font-medium">Payment Method</label>
          <select
            value={order.paymentMethod || ""}
            onChange={(e) => {
              const method = e.target.value as PaymentMethod;
              setPaymentMethod(order.id, method);
            }}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select payment method</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
      )}

      {order.status === "active" && (
        <div className="mt-6 flex justify-end gap-2">
          <Button
            onClick={handleCompleteSale}
            className={cn("bg-green-600 text-white", isLoading && "opacity-50")}
            label={isLoading ? "Completing..." : "Complete Sale"}
          />
          <Button
            onClick={onClose}
            className="bg-gray-600 text-white"
            label="Cancel"
          />
        </div>
      )}

      {order.status === "completed" && (
        <div className="mt-6 text-green-600 font-medium">
          ✅ This order is completed.
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={true} // Assumed always open for this modal type, adjust as needed
      onClose={onClose}
      title="Order Details"
      content={content}
      footer={null}
    />
  );
}
