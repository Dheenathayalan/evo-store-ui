"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  products: any[];
  addProduct: (product: any) => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) => {
        set((state) => {
          // Check if product already exists to avoid duplicates
          const filtered = state.products.filter((p) => (p._id ?? p.id) !== (product._id ?? product.id));
          
          // Add to start (most recent first)
          const newProducts = [product, ...filtered];
          
          // Cap at 10 items
          return { products: newProducts.slice(0, 10) };
        });
      },
    }),
    {
      name: "evo-recently-viewed",
    }
  )
);
