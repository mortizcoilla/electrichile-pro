import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MaterialItem } from '@/types';

interface CartItem extends MaterialItem {}

interface MaterialState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((c) => c.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((c) => c.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((c) =>
            c.id === id ? { ...c, quantity, totalPrice: quantity * c.unitPrice } : c
          ),
        })),
      clearCart: () => set({ cart: [] }),
      getTotal: () => get().cart.reduce((sum, item) => sum + item.totalPrice, 0),
      getItemCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'electrichile-cart' }
  )
);
