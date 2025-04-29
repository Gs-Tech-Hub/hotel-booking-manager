
// Order Item 
import { useState, useEffect, useCallback } from "react";
import { useOrderStore, Order } from "@/app/stores/useOrderStore";
import OrderItem from "./OrderItem"; // Order item component
import { useSortedOrders } from "./useSortedOrders"; // Sorting hook

export default function OrdersList({
  onViewOrderDetails,
}: {
  onViewOrderDetails: (order: Order) => void;
}) {
  const { orders, removeOrder } = useOrderStore((state) => ({
    orders: state.orders,
    removeOrder: state.removeOrder,
  }));

  const [viewAll, setViewAll] = useState(false);

  // Memoized sorting logic for the orders list
  const { displayedOrders } = useSortedOrders(orders, viewAll);

  // Debug: Check when orders change
  useEffect(() => {
    console.log("Orders have changed:", orders);
  }, [orders]);

  // Handle remove order
  const handleRemoveOrder = useCallback((id: string) => {
    console.log("Removing order:", id);
    removeOrder(id);
  }, [removeOrder]);

  // Handle toggle view (show more/less orders)
  const handleToggleView = useCallback(() => {
    setViewAll((prev) => !prev);
    console.log("Toggle view:", !viewAll);
  }, [viewAll]);

  // Debug: Check when the component re-renders
  useEffect(() => {
    console.log("OrdersList component re-rendered");
  });

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <h2 className="text-lg font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">No orders yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {displayedOrders.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                onViewOrderDetails={onViewOrderDetails}
                onRemoveOrder={handleRemoveOrder}
              />
            ))}
          </div>

          {orders.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleToggleView}
                className="text-blue-600 hover:underline text-sm"
              >
                {viewAll ? "View Less" : "View More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


// sorting 

import { useMemo } from "react";
import { Order } from "@/app/stores/useOrderStore";

export function useSortedOrders(orders: Order[], viewAll: boolean) {
  const sortedOrders = useMemo(() => {
    console.log("Sorting orders...");
    return [...orders].sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      return 0;
    });
  }, [orders]);

  const displayedOrders = useMemo(() => {
    console.log("Displaying orders...", viewAll);
    return viewAll ? sortedOrders : sortedOrders.slice(0, 5);
  }, [sortedOrders, viewAll]);

  return { displayedOrders };
}


//order list component

import { useState, useEffect, useCallback } from "react";
import { useOrderStore, Order } from "@/app/stores/useOrderStore";
import OrderItem from "./order-item"; // Order item component
import { useSortedOrders } from "@/hooks/useSorting"; // Sorting hook

export default function OrdersList({
  onViewOrderDetails,
}: {
  onViewOrderDetails: (order: Order) => void;
}) {
  const { orders, removeOrder } = useOrderStore((state) => ({
    orders: state.orders,
    removeOrder: state.removeOrder,
  }));

  const [viewAll, setViewAll] = useState(false);

  // Memoized sorting logic for the orders list
  const { displayedOrders } = useSortedOrders(orders, viewAll);

  // Debug: Check when orders change
  useEffect(() => {
    console.log("Orders have changed:", orders);
  }, [orders]);

  // Handle remove order
  const handleRemoveOrder = useCallback((id: string) => {
    console.log("Removing order:", id);
    removeOrder(id);
  }, [removeOrder]);

  // Handle toggle view (show more/less orders)
  const handleToggleView = useCallback(() => {
    setViewAll((prev) => !prev);
    console.log("Toggle view:", !viewAll);
  }, [viewAll]);

  // Debug: Check when the component re-renders
  useEffect(() => {
    console.log("OrdersList component re-rendered");
  });

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <h2 className="text-lg font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">No orders yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {displayedOrders.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                onViewOrderDetails={onViewOrderDetails}
                onRemoveOrder={handleRemoveOrder}
              />
            ))}
          </div>

          {orders.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleToggleView}
                className="text-blue-600 hover:underline text-sm"
              >
                {viewAll ? "View Less" : "View More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
