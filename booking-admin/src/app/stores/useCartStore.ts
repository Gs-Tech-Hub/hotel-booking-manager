// stores/useCartStore.ts
import { create } from "zustand";

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  available: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cartItems.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      } else {
        return {
          cartItems: [...state.cartItems, { ...item, quantity: 1 }],
        };
      }
    }),
  clearCart: () => set({ cartItems: [] }),
}));
