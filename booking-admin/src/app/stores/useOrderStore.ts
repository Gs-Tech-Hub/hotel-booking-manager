import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "./useCartStore";

export type PaymentMethodType = "cash" | "card" | "bank_transfer";

export interface PaymentMethod {
  id: number;
  documentId: string;
  type: PaymentMethodType;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 2,
    documentId: "jepc2g6nnux51f8sdjcfddrp",
    type: "bank_transfer",
  },
  {
    id: 4,
    documentId: "nk5minqfer8qd5sujdo2xuvu",
    type: "cash",
  },
  {
    id: 6,
    documentId: "ccde1iw9163wra5r7l3tolqe",
    type: "card",
  },
];



export interface Order {
  id: string;
  customerName: string;
  tableNumber?: string;
  orderTime?: string;
  orderDate?: string;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  customerId?: string;
  waiterId: string;
  items: CartItem[];
  status: "active" | "completed";
}

export type OrderStatus = "active" | "completed";

export interface updateItemQuantity {
  orderId?: string;
  itemId: number;
  quantity: number;
}

interface OrderStore {
  currentOrder: Order | null;
  orders: Order[];
  setOrder: (order: Order) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  addItemToOrder: (item: CartItem) => void;
  removeItemFromOrder: (orderId: string, itemId: number) => void;
  setPaymentMethod: (orderId: string, method: PaymentMethod) => void;
  completeOrder: (orderId: string) => void;
  clearOrder: () => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  updateOrderItem: (orderId: string, updatedItem: CartItem) => void;
  // refreshOrders: () => Promise<void>;
  getOrderByCustomer: (customerName: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      orders: [],

      setOrder: (order) => {
        if (!order || !Array.isArray(order.items)) {
          console.warn("Invalid order data:", order);
          return;
        }
        set({ currentOrder: order });
      },

      updateItemQuantity: (itemId, newQty) => {
        set((state) => {
          const order = state.orders.find((o) =>
            o.items.some((item) => item.id === itemId)
          );
          if (!order) return state;

          const updatedItems = order.items.map((item) =>
            item.id === itemId ? { ...item, quantity: newQty } : item
          );

          return {
            orders: state.orders.map((o) =>
              o.id === order.id ? { ...order, items: updatedItems } : o
            ),
          };
        });
      },

      removeItemFromOrder(orderId, itemId) {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return;

        const updatedItems = order.items.filter((item) => item.id !== itemId);
        const updatedOrders = state.orders.map((o) =>
          o.id === orderId ? { ...o, items: updatedItems } : o
        );

        set({
          orders: updatedOrders,
          currentOrder:
            state.currentOrder?.id === orderId
              ? { ...state.currentOrder, items: updatedItems }
              : state.currentOrder,
        });
      },

      addItemToOrder: (newItem) => {
        const state = get();
        if (!state.currentOrder || newItem.quantity <= 0 || newItem.price < 0) {
          console.warn("Invalid item:", newItem);
          return;
        }

        const existing = state.currentOrder.items.find((i) => i.id === newItem.id);
        const updatedItems = existing
          ? state.currentOrder.items.map((i) =>
              i.id === newItem.id
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            )
          : [...state.currentOrder.items, newItem];

        set({
          currentOrder: {
            ...state.currentOrder,
            items: updatedItems,
          },
        });
      },

      setPaymentMethod: (orderId, method) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId ? { ...order, paymentMethod: method } : order
          );

          const updatedCurrentOrder =
            state.currentOrder?.id === orderId
              ? { ...state.currentOrder, paymentMethod: method }
              : state.currentOrder;

          return {
            orders: updatedOrders,
            currentOrder: updatedCurrentOrder,
          };
        });
      },

      completeOrder: (orderId) => {
        const state = get();
        const updatedOrders = state.orders.map((order) =>
          order.id === orderId ? { ...order, status: "completed" as const } : order
        );

        const updatedCurrentOrder =
          state.currentOrder?.id === orderId
            ? { ...state.currentOrder, status: "completed" as const }
            : state.currentOrder;

        set({
          orders: updatedOrders,
          currentOrder: updatedCurrentOrder?.id === orderId ? null : updatedCurrentOrder,
        });
      },

      clearOrder: () => set({ currentOrder: null }),

      setOrders: (orders) => {
        if (!Array.isArray(orders)) {
          console.warn("Orders must be an array.");
          return;
        }
        set({ orders });
      },

      addOrder: (order) => {
        if (!order || !Array.isArray(order.items)) return;
        set((state) => ({
          orders: [...state.orders, order],
        }));
      },

      removeOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== orderId),
          currentOrder:
            state.currentOrder?.id === orderId ? null : state.currentOrder,
        }));
      },

      updateOrderItem: (orderId, updatedItem) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.id === orderId) {
              const updatedItems = order.items.map((item) =>
                item.id === updatedItem.id ? { ...item, ...updatedItem } : item
              );
              return { ...order, items: updatedItems };
            }
            return order;
          });
          return { orders: updatedOrders };
        });
      },

      // refreshOrders: async () => {
      //   const fetched: Order[] = await strapiService.getOrders()(
      //     (res) => res.json());
      //   set({ orders: fetched });
      // },

      getOrderByCustomer: (customerName) => {
        return get().orders.find(
          (order) => order.customerName === customerName && order.status === "active"
        );
      },
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        currentOrder: state.currentOrder,
      }),
    }
  )
);