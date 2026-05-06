import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product';

interface CartState {
  items: Product[];
  maxPoints: number;
  addItem: (product: Product) => { success: boolean; message?: string };
  removeItem: (productId: string) => void;
  getTotalPoints: () => number;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      maxPoints: 50,

      addItem: (product) => {
        const currentPoints = get().getTotalPoints();
        const productCost = product.capacity_cost || 0;

        if (get().items.find((item) => item.id === product.id)) {
          return { success: false, message: "Déjà dans votre dressing" };
        }

        if (currentPoints + productCost > get().maxPoints) {
          return { 
            success: false, 
            message: `Capacité de dressing insuffisante (${currentPoints + productCost}/50 pts de dressing)` 
          };
        }

        set((state) => ({ items: [...state.items, product] }));
        return { success: true };
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      getTotalPoints: () => {
        return get().items.reduce((sum, item) => sum + (item.capacity_cost || 0), 0);
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'gradora-cart' }
  )
);