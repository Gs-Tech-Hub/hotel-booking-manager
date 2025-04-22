import { Button } from "@/components/ui-elements/button";
import { useOrderStore, Order } from "@/app/stores/useOrderStore";
import { useCallback, useMemo, useState } from "react";

export default function OrdersList({
  onViewOrderDetails,
}: {
  onViewOrderDetails: (order: Order) => void;
}) {
  const orders = useOrderStore((state) => state.orders) || [];
  const [viewAll, setViewAll] = useState(false);
  const displayedOrders = viewAll ? orders : orders.slice(0, 5);

  const handleViewDetails = useCallback(
    (order: Order) => {
      onViewOrderDetails(order);
    },
    [onViewOrderDetails]
  );

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <h2 className="text-lg font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">No orders yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {displayedOrders.map((order) => {
              const orderItems = Array.isArray(order.items) ? order.items : [];
              const total = orderItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition"
                  onClick={() => handleViewDetails(order)}
                >
                  <p className="font-bold text-sm mb-1">{order.customerName}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    Total: ${total.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Table: {order.tableNumber}
                  </p>
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              );
            })}
          </div>

          {orders.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setViewAll((prev) => !prev)}
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
