import { useEffect, useState } from "react";
import { Button } from "@/components/ui-elements/button";
import { useCartStore } from "@/app/stores/useCartStore";
import { toast } from "react-toastify";
import { Order, useOrderStore } from "@/app/stores/useOrderStore";
import { formatPrice } from "@/utils/priceHandler";
import { useAuth } from "@/components/Auth/context/auth-context";

export default function CartSidebar({
  onCreateOrder,
  prefillOrder,
}: {
  onCreateOrder: (order: Order) => void;
  prefillOrder?: Order | null;
}) {
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [waiterName, setWaiterName] = useState("");
  const [isOrderActive, setOrderActive] = useState(true);

  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const updateOrderItem = useOrderStore((state) => state.updateOrderItem);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.name) {
      setWaiterName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (prefillOrder) {
      setCustomerName(prefillOrder.customerName || "");
      setTableNumber(prefillOrder.tableNumber || "");
      setWaiterName(prefillOrder.waiterId || user?.name || "");
      setCartItems(prefillOrder.items || []);
      setOrderActive(true);
      toast.info("Order loaded into cart.");
    }
  }, [prefillOrder, setCartItems, user]);

  const handleNewOrder = () => {
    setOrderActive(true);
  };

  const handleCreateOrder = async () => {
    if (!customerName || !tableNumber || cartItems.length === 0) {
      toast.error("Please fill in all fields and add items to the cart.");
      return;
    }

    const finalOrder: Order = {
      id: Date.now().toString(),
      customerName,
      tableNumber,
      waiterId: user?.name || "",
      items: cartItems,
      status: "active",
      totalAmount: cartTotal,
    };

    try {
      if (prefillOrder?.id) {
        cartItems.forEach((updatedItem) => {
          updateOrderItem(prefillOrder.id, updatedItem);
        });
        toast.success("Order updated successfully!");
      } else {
        onCreateOrder(finalOrder);
        toast.success("Order submitted successfully!");
      }

      clearCart();
      setCustomerName("");
      setTableNumber("");
      setWaiterName(user?.name || "");
      setOrderActive(false);
    } catch (error) {
      toast.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-md dark:bg-gray-dark">
      <h2 className="text-lg font-bold">Order Management</h2>

      {!isOrderActive ? (
        <div className="mt-4">
          <p className="text-sm text-gray-500">No active order.</p>
          <Button
            onClick={handleNewOrder}
            className="mt-4 text-white px-4 py-2 rounded"
            label="Create New Order"
            variant="dark"
          />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
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
            <h3 className="text-md font-semibold">Cart Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 mt-1">Cart is empty.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
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
                <span>{formatPrice(cartTotal, "NGN")}</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleCreateOrder}
            className="mt-4 text-white px-4 py-2 rounded w-full"
            label="Submit Order"
            variant="dark"
          />
        </div>
      )}
    </div>
  );
}
