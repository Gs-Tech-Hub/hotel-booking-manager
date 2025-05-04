// stores/useCartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface MenuItem {
  id: number;
  documentId: string;
  name: string;
  price: number;
  available?: number;
  quantity?: number; // Optional for initial state
  department?: string; // Optional for initial state
  productCountId?: [{id: number}];
}

export interface GameItem {
  count: number;
  amount_paid: number;
  amount_owed: number;
  game_status: string;
}

export interface CartItem extends MenuItem, GameItem {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  decrementItem: (itemId: number) => void;
  setCartItems: (items: CartItem[]) => void;  
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist((set) => ({
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
          cartItems: [...state.cartItems, { 
            ...item, 
            quantity: 1,
            count: 0,
            amount_paid: 0,
            amount_owed: 0,
            game_status: 'pending'
          }],
        };
      }
    }),

    decrementItem: (itemId: number) => set((state) => {
      const updatedCart = state.cartItems
      .map(item => item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)
      .filter(item => item.quantity > 0);
    return { cartItems: updatedCart };
    }),

    setCartItems: (items) => set(() => ({ cartItems: items })),

     clearCart: () => set({ cartItems: [] })
  }),
  {
    name: 'cart-storage',
    storage: createJSONStorage(() => localStorage), // correct storage setup

  }
));
