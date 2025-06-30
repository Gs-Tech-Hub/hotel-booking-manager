/* eslint-disable */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui-elements/button";
import { useCartStore } from "@/app/stores/useCartStore";
import { toast } from "react-toastify";
import { Order, useOrderStore } from "@/app/stores/useOrderStore";
import { formatPrice } from "@/utils/deprecated/priceHandler";
import { useAuth } from "@/components/Auth/context/auth-context";
import { strapiService } from "@/utils/dataEndpoint";

interface StaffUser {
  id: string;
  username: string;
}

export default function CartSidebar({
  onCreateOrder,
  prefillOrder,
  onClearPrefill,
}: {
  onCreateOrder: (order: Order) => void;
  prefillOrder?: Order | null;
  onClearPrefill?: () => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [inputDiscount, setInputDiscount] = useState<string>("");
  const [tableNumber, setTableNumber] = useState("");
  const [waiterName, setWaiterName] = useState("");
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [isOrderActive, setOrderActive] = useState(true);
  const setDiscountPrice = useOrderStore((state) => state.setDiscountPrice);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const decrementItem = useCartStore((state) => state.decrementItem);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.name) {
      setWaiterName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (prefillOrder?.id) {
      // console.log("Prefill Order:", prefillOrder);

      setCustomerName(prefillOrder.customerName || "");
      setTableNumber(prefillOrder.tableNumber || "");
      setCartItems(prefillOrder.items || []);
      setOrderActive(true);
      setWaiterName(prefillOrder.waiterId || user?.name || "");
      setSelectedStaffId(prefillOrder.selectedStaffId || null);
      setInputDiscount((prefillOrder.discountPrice || 0).toString());
      setDiscountPrice(prefillOrder.selectedStaffId || '', prefillOrder.discountPrice || 0);

      toast.info("Order loaded into cart.");
    } else {
      // console.log("No prefill order provided.");
    }
  }, [prefillOrder, setCartItems, setDiscountPrice, user]);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const response = await strapiService.authEndpoints.getUsers();
        if (Array.isArray(response)) {
          setStaffList(response);
        }
      } catch (error) {
        // console.error("Failed to fetch staff list", error);
      }
    }
    fetchStaff();
  }, []);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const finalTotal = useOrderStore((state) => {
    const order = state.orders.find((order) => order.id === prefillOrder?.id);
    if (order) {
      return Math.max(order.totalAmount - (order.discountPrice || 0), 0);
    }
    return cartTotal - (parseFloat(inputDiscount) || 0); // Fallback for new orders
  });

  const handleCreateOrder = async () => {
    if (!customerName || !tableNumber || cartItems.length === 0) {
      toast.error("Please fill in all fields and add items to the cart.");
      return;
    }

    const finalOrder: Order = {
      id: prefillOrder?.id || Date.now().toString(),
      customerName,
      tableNumber,
      waiterId: waiterName,
      items: cartItems,
      status: "active",
      totalAmount: cartTotal,
      discountPrice: parseFloat(inputDiscount) || 0,
      finalPrice: finalTotal,
      selectedStaffId: selectedStaffId || '',
    };

    // console.log("Final Order to be created:", finalOrder);

    try {
      if (prefillOrder?.id) {
        // Update the existing order
        const updatedOrders = useOrderStore.getState().orders.map((order) =>
          order.id === prefillOrder.id ? { ...order, ...finalOrder } : order
        );
        useOrderStore.setState({ orders: updatedOrders });
        toast.success("Order updated successfully!");
      } else {
        // Create a new order
        onCreateOrder(finalOrder);
        toast.success("Order submitted successfully!");
      }

      // Reset all fields
      clearCart();
      setCustomerName("");
      setTableNumber("");
      setWaiterName(user?.name || "");
      setSelectedStaffId(null);
      setInputDiscount("");
      setDiscountPrice("", 0);
      setOrderActive(true);

      if (onClearPrefill) onClearPrefill();
    } catch (error) {
      // console.error("Error creating order:", error);
      toast.error(
        `Failed to process order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-md dark:bg-gray-dark">
      <h2 className="text-lg font-bold">Order Management</h2>

      <div className="mt-4 space-y-4">
        <Button
          onClick={() => {
            clearCart();
            setCustomerName("");
            setTableNumber("");
            setWaiterName(user?.name || "");
            setSelectedStaffId(null);
            setInputDiscount("");
            setDiscountPrice("", 0);
            setOrderActive(true);
            toast.info("Cart and form reset.");
            if (onClearPrefill) onClearPrefill();
          }}
          className="text-black bg-gray-200 px-4 py-2 rounded w-full"
          label="Click to Reset Cart"
          variant="dark"
        />

        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Table Number</label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="Enter table number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Cashier</label>
          <div className="w-full mt-1 px-3 py-2 border rounded bg-gray-100">
            {waiterName || "Loading..."}
          </div>
        </div>

        <div>
          <button
            onClick={() => setShowDiscountInput(!showDiscountInput)}
            className="text-blue-500 hover:underline"
          >
            Apply Staff Discount
          </button>

          {showDiscountInput && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Select Staff Member
              </label>
              <select
                value={selectedStaffId ?? ""}
                onChange={(e) => {
                  const newStaffId = e.target.value || null;
                  setSelectedStaffId(newStaffId);
                  const parsed = parseFloat(inputDiscount);
                  if (!isNaN(parsed)) {
                    const valid = Math.max(0, Math.min(parsed, cartTotal));
                    setDiscountPrice(newStaffId ?? '', valid);
                  }
                }}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">-- Select a Staff Member --</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.username}
                  </option>
                ))}
              </select>

              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Enter Discount Amount
                </label>
                <input
                  type="number"
                  min={0}
                  max={cartTotal}
                  step="0.01"
                  value={inputDiscount}
                  onChange={(e) => setInputDiscount(e.target.value)}
                  onBlur={() => {
                    const value = parseFloat(inputDiscount);
                    if (isNaN(value)) return;
                    const validDiscount = Math.max(0, Math.min(value, cartTotal));
                    setDiscountPrice(prefillOrder?.id || '', validDiscount); // Use prefillOrder ID
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded"
                  placeholder={`Enter discount (₦0 - ₦${cartTotal})`}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-md font-semibold">Cart Summary</h3>
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-500 mt-1">Cart is empty.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decrementItem(item.id)}
                      className="px-2 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                  </div>
                  <span>
                    {formatPrice(item.price * item.quantity, "NGN")}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {cartItems.length > 0 && (
            <div className="flex justify-between mt-4 font-semibold">
              <span>Total:</span>
              <span>{formatPrice(finalTotal, "NGN")}</span>
            </div>
          )}
        </div>

        {(!customerName || !tableNumber || cartItems.length === 0) && (
          <p className="text-sm text-red-500 mt-2">
            Please ensure customer name, table number, and at least one cart item are provided.
          </p>
        )}

        <Button
          onClick={handleCreateOrder}
          className="mt-4 text-white px-4 py-2 rounded w-full"
          label="Submit Order"
          variant="dark"
          disabled={
            !isOrderActive || !customerName || !tableNumber || cartItems.length === 0
          }
        />
      </div>
    </div>
  );
}