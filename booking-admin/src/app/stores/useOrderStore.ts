import { create } from "zustand";

export type PaymentMethod = "cash" | "card" | "bank_transfer" | "mobile_payment";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  available: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  waiterName: string;
  items: OrderItem[];
  status: "active" | "completed";
  paymentMethod?: PaymentMethod;
}

interface OrderStore {
  currentOrder: Order | null;
  orders: Order[];
  setOrder: (order: Order) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  addItemToOrder: (item: OrderItem) => void;
  setPaymentMethod: (orderId: string, method: PaymentMethod) => void;
  completeOrder: (orderId: string) => void;
  clearOrder: () => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  getOrderByCustomer: (customerName: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  currentOrder: null,
  orders: [],

  setOrder: (order) => {
    if (!order || !Array.isArray(order.items)) {
      console.warn("Invalid order data:", order);
      return;
    }
    set({ currentOrder: order });
  },

  updateItemQuantity: (id, quantity) => {
    const state = get();
    if (!state.currentOrder || quantity < 0) return;

    set({
      currentOrder: {
        ...state.currentOrder,
        items: state.currentOrder.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      },
    });
  },

  addItemToOrder: (newItem) => {
    const state = get();
    if (!state.currentOrder || newItem.quantity <= 0 || newItem.price < 0) {
      console.warn("Invalid item:", newItem);
      return;
    }

    const existing = state.currentOrder.items.find(i => i.id === newItem.id);
    const updatedItems = existing
      ? state.currentOrder.items.map(i =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
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
    }));
  },

  getOrderByCustomer: (customerName) => {
    return get().orders.find(
      (order) => order.customerName === customerName && order.status === "active"
    );
  },
}));
