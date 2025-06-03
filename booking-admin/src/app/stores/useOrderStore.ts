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
  { id: 2, documentId: "aio64xyuu59t961xxvlkasbf", type: "cash", },
  { id: 4, documentId: "vjpta5fd0ad6v0nmniezas7y", type: "card" },
  { id: 6, documentId: "zwy74xbkbih7pqf29pz0pgng", type: "bank_transfer" },
];

export interface Order {
  id: string;
  customerName: string;
  tableNumber?: string;
  waiterId: string;
  items: CartItem[];
  status: "active" | "completed";
  totalAmount: number;
  discountPrice?: number;
  finalPrice?: number;
  selectedStaffId?: string;
  paymentMethod?: PaymentMethod;
}

export type OrderStatus = "active" | "completed";

export interface updateItemQuantity {
  orderId?: string;
  itemId: number;
  quantity: number;
}

interface OrderStore {
  currentOrderId: string | null;
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
  setDiscountPrice: (orderId: string, discountPrice: number) => void;
  getOrderByCustomer: (customerName: string) => Order | undefined;
  getDiscountForStaff: (orderId: string) => number | undefined;
  getCurrentOrder: () => Order | undefined;
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

        set((state) => {
          const exists = state.orders.some((o) => o.id === order.id);
          return {
            currentOrderId: order.id,
            orders: exists ? state.orders : [...state.orders, order],
          };
        });
      },

      updateItemQuantity: (orderId, itemId, quantity) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  items: order.items.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item
                  ),
                }
              : order
          );
          return { orders: updatedOrders };
        });
      },

      addItemToOrder: (orderId, newItem) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.id !== orderId) return order;

            const existingItem = order.items.find((item) => item.id === newItem.id);
            const newItems = existingItem
              ? order.items.map((item) =>
                  item.id === newItem.id
                    ? { ...item, quantity: item.quantity + newItem.quantity }
                    : item
                )
              : [...order.items, newItem];

            return { ...order, items: newItems };
          });

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

      clearOrder: () => set({ currentOrderId: null, }),

      setOrders: (orders) => {
        if (!Array.isArray(orders)) {
          console.warn("Orders must be an array.");
          return;
        }
        set({ orders });
      },

      addOrder: (order) => {
        if (!order || !Array.isArray(order.items)) return;
        const finalPrice = Math.max(order.totalAmount - (order.discountPrice || 0), 0);
        set((state) => ({
          orders: [...state.orders, { ...order, finalPrice }],
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
            if (order.id !== orderId) return order;

            const updatedItems = order.items.map((item) =>
              item.id === updatedItem.id ? { ...item, ...updatedItem } : item
            );

            const totalAmount = updatedItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            const finalPrice = Math.max(totalAmount - (order.discountPrice || 0), 0);

            return { ...order, items: updatedItems, totalAmount, finalPrice };
          });

          return { orders: updatedOrders };
        });
      },

      setDiscountPrice: (orderId, discountPrice) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.id !== orderId) return order;
            const finalPrice = Math.max(order.totalAmount - discountPrice, 0);
            return { ...order, discountPrice, finalPrice };
          });

          return { orders: updatedOrders };
        });
      },

      getDiscountForStaff: (orderId) => {
        return get().orders.find((order) => order.id === orderId)?.discountPrice;
      },

      getOrderByCustomer: (customerName) => {
        return get().orders.find(
          (order) => order.customerName === customerName && order.status === "active"
        );
      },

      getCurrentOrder: () => {
        const state = get();
        return state.orders.find((order) => order.id === state.currentOrderId);
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
