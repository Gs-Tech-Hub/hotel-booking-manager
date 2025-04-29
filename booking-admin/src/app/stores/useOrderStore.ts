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
  waiterId: string;
  items: CartItem[];
  status: "active" | "completed";
  totalAmount: number;
  discountPrice?: number; // Discount applied to the order
  finalPrice?: number; // Final price after discount
  selectedStaffId?: string; // Staff ID associated with the discount
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
  discountPrice?: { [orderId: string]: number };
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
            if (order.id === orderId) {
              const updatedItems = order.items.map((item) =>
                item.id === updatedItem.id ? { ...item, ...updatedItem } : item
              );
              const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
              const finalPrice = Math.max(totalAmount - (order.discountPrice || 0), 0);
              return { ...order, items: updatedItems, totalAmount, finalPrice };
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

      //set discount for order
      setDiscountPrice: (orderId, discountPrice) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.id === orderId) {
              const finalPrice = Math.max(order.totalAmount - discountPrice, 0); // Ensure no negative price
              return { ...order, discountPrice, finalPrice };
            }
            return order;
          });

          return { orders: updatedOrders };
        });
      },

      getDiscountForStaff: (orderId: string) => {
        return get().discountPrice?.[orderId];
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
