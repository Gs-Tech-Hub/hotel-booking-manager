import { useOrderStore, Order } from "@/app/stores/useOrderStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSortedOrders } from "@/hooks/useSorting"; // Sorting hook
import OrderItem from "./order-item";

export default function OrdersList({
  onViewOrderDetails,
}: {
  onViewOrderDetails: (order: Order) => void;
}) {
  const orders = useOrderStore((state) => state.orders);
  const removeOrder = useOrderStore((state) => state.removeOrder);

  const [viewAll, setViewAll] = useState(false);

  // Sorting the orders using your sorting hook
  const { displayedOrders } = useSortedOrders(orders, viewAll);

  const handleRemoveOrder = useCallback((id: string) => {
    // console.log("Removing order:", id);
    removeOrder(id);
  }, [removeOrder]);

  const handleToggleView = useCallback(() => {
    setViewAll((prev) => !prev);
  }, []);

  const handleViewDetails = useCallback((order: Order) => {
    onViewOrderDetails(order);
  }, [onViewOrderDetails]);

  useEffect(() => {
    // console.log("📦 Current Orders in State:", orders);
    orders.forEach((order, index) => {
      console.log(`Order #${index + 1}:`, order);
    });
  }, [orders]);

  const shouldShowToggleButton = useMemo(() => orders.length > 5, [orders.length]);

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
                onViewOrderDetails={handleViewDetails}
                onRemoveOrder={handleRemoveOrder}
              />
            ))}
          </div>

          {shouldShowToggleButton && (
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
