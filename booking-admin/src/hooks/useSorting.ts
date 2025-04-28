import { useMemo } from "react";
import { Order } from "@/app/stores/useOrderStore";

export function useSortedOrders(orders: Order[], viewAll: boolean) {
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      return 0;
    });
  }, [orders]); // ✅ depends on orders

  const displayedOrders = useMemo(() => {
    return viewAll ? sortedOrders : sortedOrders.slice(0, 5);
  }, [sortedOrders, viewAll]); // ✅ depends on sortedOrders and viewAll

  return { displayedOrders };
}
