import { useEffect, useState } from "react";
import { Button } from "@/components/ui-elements/button";
import { useCartStore } from "@/app/stores/useCartStore";
import { toast } from "react-toastify";
import { Order, useOrderStore } from "@/app/stores/useOrderStore";



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
  const [isOrderActive, setOrderActive] = useState(false);

  const cartItems = useCartStore((state) => state.cartItems);
  const setCartItems = useCartStore((state) => state.setCartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const updateOrderItem = useOrderStore((state) => state.updateOrderItem);
 
  const newOrder: Order = {
    id: Date.now().toString(), // Generate a temporary ID
    customerName,
    tableNumber,
    waiterName,
    items: cartItems,
    status: 'active', // Set initial status
  };

  // When prefillOrder changes, populate the fields
  useEffect(() => {
    if (prefillOrder) {
      setCustomerName(prefillOrder.customerName || "");
      setTableNumber(prefillOrder.tableNumber || "");
      setWaiterName(prefillOrder.waiterName || "");
      setCartItems(prefillOrder.items || []); // ✅ Load items into cart
      setOrderActive(true);
      toast.info("Order loaded into cart.");
    }
  }, [prefillOrder, setCartItems]);

  const handleNewOrder = () => {
    setOrderActive(true);
  };

  const handleCreateOrder = () => {
    if (!customerName || !tableNumber || !waiterName || cartItems.length === 0) {
      toast.error("Please fill in all fields and add items to the cart.");
      return;
    }
    
    // Check if we are updating an existing order (using prefillOrder)
    if (prefillOrder?.id) {
      // Assuming `updateOrderItem` is imported and available from your store
      cartItems.forEach((updatedItem) => {
        updateOrderItem(prefillOrder.id, updatedItem); // Update each item in the cart
      });
      toast.success("Order updated successfully!");
    } else {
      // If no orderId, create a new order
      onCreateOrder(newOrder);
      toast.success("Order submitted successfully!");
    }
  
    // Clear the cart and reset the form
    clearCart();
    setCustomerName("");
    setTableNumber("");
    setWaiterName("");
    setOrderActive(false);
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
            className="mt-4 text-white px-4 py-2 rounded"
            label="Create New Order"
            variant="dark"
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
                  <li key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => decrementItem(item.id)}
                        className="px-2 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span>{item.name} x {item.quantity}</span>
                    </div>
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
            className="mt-4 text-white px-4 py-2 rounded w-full"
            label="Submit Order"
            variant="dark"
          />
        </div>
      )}
    </div>
  );
}
