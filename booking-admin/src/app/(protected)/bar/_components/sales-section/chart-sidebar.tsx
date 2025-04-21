import { useState } from "react";
import { Button } from "@/components/ui-elements/button";
import { useCartStore } from "@/app/stores/useCartStore";

export default function CartSidebar({ onCreateOrder }: { onCreateOrder: (order: any) => void }) {
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [waiterName, setWaiterName] = useState("");
  const [isOrderActive, setOrderActive] = useState(false);

  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleCreateOrder = () => {
    if (!customerName || !tableNumber || !waiterName || cartItems.length === 0) {
      alert("Please fill in all fields and add items to the cart.");
      return;
    }

    const newOrder = {
      customerName,
      tableNumber,
      waiterName,
      items: cartItems,
    };

    onCreateOrder(newOrder);
    clearCart(); // ✅ Clear cart after order
    setCustomerName("");
    setTableNumber("");
    setWaiterName("");
    setOrderActive(false);

    console.log("Order created:", newOrder);
  };

  const handleNewOrder = () => {
    setOrderActive(true);
    setCustomerName("");
    setTableNumber("");
    setWaiterName("");
    console.log("New order started");
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-md dark:bg-gray-dark">
      <h2 className="text-lg font-bold">Order Management</h2>

      {!isOrderActive ? (
        <div className="mt-4">
          <p className="text-sm text-gray-500">No active order.</p>
          <Button
            onClick={handleNewOrder}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            label="Create New Order"
          />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Customer Info */}
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
            <label className="block text-sm font-medium">Waiter Name</label>
            <input
              type="text"
              value={waiterName}
              onChange={(e) => setWaiterName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded"
              placeholder="Enter waiter name"
            />
          </div>

          {/* Cart Summary */}
          <div>
            <h3 className="text-md font-semibold">Cart Summary</h3>
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 mt-1">Cart is empty.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            )}

            {cartItems.length > 0 && (
              <div className="flex justify-between mt-4 font-semibold">
                <span>Total:</span>
                <span>${cartTotal}</span>
              </div>
            )}
          </div>

          {/* Submit Order */}
          <Button
            onClick={handleCreateOrder}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
            label="Submit Order"
          />
        </div>
      )}
    </div>
  );
}
