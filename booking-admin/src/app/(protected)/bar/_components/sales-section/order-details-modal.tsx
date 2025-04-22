import React, { useEffect, useState } from "react";
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
  const removeOrder = useOrderStore((state) => state.removeOrder); // Assuming this function clears order data

  const [isLoading, setIsLoading] = useState(false);

  const currentOrder = useOrderStore((state) =>
    state.orders.find((o) => o.id === order.id)
  );

  useEffect(() => {
    if (!currentOrder) {
      toast.error("Order no longer exists.");
      onClose();
    }
  }, [currentOrder, onClose]);

  const handleCompleteSale = async () => {
    if (!currentOrder?.paymentMethod) {
      toast.warning("Please select a payment method.");
      return;
    }

    setIsLoading(true);
    try {
      await completeOrder(order.id);
      toast.success("Order completed successfully!");
      onClose();
    } catch (error) {
      toast.error(`Failed to complete the order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueSales = () => {
    // Close the modal without modifying state, keeping cart intact
    onClose();
  };

  const handleCancel = () => {
    // Clear the order data and prefilled data, disabling further editing
    removeOrder(order.id); // Clears the order data from the state
    onClose();
    toast.info("Order data cleared and editing disabled.");
  };

  if (!currentOrder) return null;

  const total = currentOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Order Details"
      content={
        <div className="space-y-4">
          <div className="space-y-2 text-sm">
            <p><strong>Customer:</strong> {currentOrder.customerName}</p>
            <p><strong>Table:</strong> {currentOrder.tableNumber}</p>
            <p><strong>Waiter:</strong> {currentOrder.waiterName}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Items:</h3>
            <ul className="mt-2 space-y-1">
              {currentOrder.items.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span>{item.name} × {item.quantity}</span>
                  </div>
                  <span>₦{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 font-semibold">
            Total: ₦{total}
          </div>

          {currentOrder.status === "active" && (
            <>
              <div className="mt-6">
                <label className="block mb-2 font-medium">Payment Method</label>
                <select
                  value={currentOrder.paymentMethod || ""}
                  onChange={(e) => {
                    const method = e.target.value as PaymentMethod;
                    setPaymentMethod(order.id, method);
                    toast.success("Payment method updated.");
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

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  onClick={handleContinueSales}
                  className={cn("bg-blue-600 text-white")}
                  label="Continue Sales"
                />
                <Button
                  onClick={handleCompleteSale}
                  className={cn("bg-green-600 text-white", isLoading && "opacity-50")}
                  label={isLoading ? "Completing..." : "Complete Sale"}
                />
                <Button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white"
                  label="Cancel"
                />
              </div>
            </>
          )}

          {currentOrder.status === "completed" && (
            <div className="mt-6 text-green-600 font-medium">
              ✅ This order is completed.
            </div>
          )}
        </div>
      }
      footer={null}
    />
  );
}
