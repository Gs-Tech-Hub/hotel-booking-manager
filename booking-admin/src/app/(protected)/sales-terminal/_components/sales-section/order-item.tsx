import { Order } from "@/app/stores/useOrderStore";
import { formatPrice } from "@/utils/priceHandler";
import { X } from "lucide-react";

interface OrderItemProps {
  order: Order;
  onViewOrderDetails: (order: Order) => void;
  onRemoveOrder: (id: string) => void;
}

function OrderItem({ order, onViewOrderDetails, onRemoveOrder }: OrderItemProps) {
  const total = order.finalPrice ?? order.totalAmount; // Use finalPrice if it exists

  return (
    <div
      key={order.id}
      className="relative border rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition"
      onClick={() => onViewOrderDetails(order)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent click
          onRemoveOrder(order.id);
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
      >
        <X size={16} />
      </button>

      <p className="font-bold text-lg mb-1">{order.customerName}</p>
      <p className="text-sm text-gray-600 mb-1">
        Total: {formatPrice(total, "NGN")}
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
}

export default OrderItem;
