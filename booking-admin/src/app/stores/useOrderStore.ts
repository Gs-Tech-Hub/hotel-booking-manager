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
  discount: number;
}

export type OrderStatus = "active" | "completed";

export interface updateItemQuantity {
  orderId?: string;
  itemId: number;
  quantity: number;
}

interface OrderStore {
  currentOrderId: string | null; // Store only the ID
  orders: Order[];
  setOrder: (order: Order) => void;
  updateItemQuantity: (orderId: string, itemId: number, quantity: number) => void;
  addItemToOrder: (orderId: string, newItem: CartItem) => void;
  removeItemFromOrder: (orderId: string, itemId: number) => void;
  setPaymentMethod: (orderId: string, method: PaymentMethod) => void;
  completeOrder: (orderId: string) => void;
  clearOrder: () => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  updateOrderItem: (orderId: string, updatedItem: CartItem) => void;
  getOrderByCustomer: (customerName: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      currentOrderId: null,
      orders: [],

      setOrder: (order) => {
        if (!order || !Array.isArray(order.items)) {
          console.warn("Invalid order data:", order);
          return;
        }
        set({ currentOrderId: order.id });
      },

      updateItemQuantity: (orderId, itemId, newQty) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  items: order.items.map((item) =>
                    item.id === itemId ? { ...item, quantity: newQty } : item
                  ),
                }
              : order
          );
          return { orders: updatedOrders };
        });
      },

      addItemToOrder: (orderId, newItem) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  items: order.items.some((item) => item.id === newItem.id)
                    ? order.items.map((item) =>
                        item.id === newItem.id
                          ? { ...item, quantity: item.quantity + newItem.quantity }
                          : item
                      )
                    : [...order.items, newItem],
                }
              : order
          );

          // Update currentOrder based on orderId
          if (state.currentOrderId === orderId) {
            return {
              orders: updatedOrders,
              currentOrderId: orderId,
            };
          }

          return { orders: updatedOrders };
        });
      },

      removeItemFromOrder: (orderId, itemId) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? { ...order, items: order.items.filter((item) => item.id !== itemId) }
              : order
          );

          // Update currentOrder based on orderId
          if (state.currentOrderId === orderId) {
            return {
              orders: updatedOrders,
              currentOrderId: orderId,
            };
          }

          return { orders: updatedOrders };
        });
      },

      setPaymentMethod: (orderId, method) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId ? { ...order, paymentMethod: method } : order
          );
          return { orders: updatedOrders };
        });
      },

      completeOrder: (orderId) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId ? { ...order, status: "completed" as const } : order
          );
          return { orders: updatedOrders };
        });
      },

      clearOrder: () => set({ currentOrderId: null }),

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
          currentOrderId: state.currentOrderId === orderId ? null : state.currentOrderId,
        }));
      },

      updateOrderItem: (orderId, updatedItem) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.id === orderId) {
              const existingItem = order.items.find((item) => item.id === updatedItem.id);
              const updatedItems = existingItem
                ? order.items.map((item) =>
                    item.id === updatedItem.id ? { ...item, ...updatedItem } : item
                  )
                : [...order.items, updatedItem];
              return { ...order, items: updatedItems };
            }
            return order;
          });

          const updatedCurrentOrder =
            state.currentOrderId === orderId
              ? updatedOrders.find((order) => order.id === orderId) || null
              : state.currentOrderId;

          return { orders: updatedOrders, currentOrder: updatedCurrentOrder };
        });
      },
      
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
        currentOrderId: state.currentOrderId,
      }),
    }
  )
);
