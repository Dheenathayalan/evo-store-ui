"use client";

import { create } from "zustand";

export const useCart = create((set) => ({
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
