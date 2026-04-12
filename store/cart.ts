"use client";

import { create } from "zustand";
import { getCart } from "@/lib/api/cart";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  color: string;
  size: string;
  sku?: string;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  addItem: (item: CartItem) => void;
  setItems: (items: CartItem[]) => void;
  fetchCartItems: () => Promise<void>;
}

export const useCart = create<CartState>((set) => ({
  isOpen: false,
  items: [],
  isLoading: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  increaseQty: (id: number) =>
    set((state: any) => ({
      items: state.items.map((item: any) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    })),

  decreaseQty: (id: number) =>
    set((state: any) => ({
      items: state.items.map((item: any) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item,
      ),
    })),

  addItem: (item: CartItem) =>
    set((state: any) => {
      const existingItem = state.items.find((i: any) => i.sku === item.sku);
      if (existingItem) {
        return {
          items: state.items.map((i: any) =>
            i.sku === item.sku ? { ...i, qty: i.qty + item.qty } : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  setItems: (items: CartItem[]) => set({ items }),

  fetchCartItems: async () => {
    set({ isLoading: true });
    try {
      const response: any = await getCart();
      const cartItems = response?.items ?? response ?? [];
      set({ items: cartItems, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch cart items:", err);
      set({ isLoading: false });
    }
  },
}));
