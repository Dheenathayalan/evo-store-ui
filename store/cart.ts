"use client";

import { create } from "zustand";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  color: string;
  size: string;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
}

export const useCart = create<CartState>((set) => ({
  isOpen: false,
  items: [
    {
      id: 1,
      name: "NAVARASA Cotton Tee",
      price: 800,
      qty: 1,
      image: "/images/product1.jpg",
      color: "Black",
      size: "M",
    },
  ],

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
}));
