"use client";

import { create } from "zustand";
import { getCart, removeFromCart, addToCart } from "@/lib/api/cart";

interface CartItem {
  id: string; // Will use SKU as ID for consistency
  name: string;
  price: number;
  qty: number;
  image: string;
  color: string;
  size: string;
  sku: string;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  isLoading: boolean;
  isAddingToCart: boolean;
  isRemovingFromCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeItem: (id: string) => Promise<void>;
  addItemToCart: (sku: string, quantity: number) => Promise<void>;
  addItem: (item: CartItem) => void;
  setItems: (items: CartItem[]) => void;
  fetchCartItems: () => Promise<void>;
}

export const useCart = create<CartState>((set) => ({
  isOpen: false,
  items: [],
  isLoading: false,
  isAddingToCart: false,
  isRemovingFromCart: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  increaseQty: (id: string) =>
    set((state: any) => ({
      items: state.items.map((item: any) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    })),

  decreaseQty: async (id: string) => {
    const state = useCart.getState();
    const item = state.items.find((item: any) => item.id === id);
    
    if (item && item.qty === 1) {
      // If quantity is 1, remove the item instead
      await state.removeItem(id);
    } else {
      // Otherwise, decrease quantity
      set((state: any) => ({
        items: state.items.map((item: any) =>
          item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item,
        ),
      }));
    }
  },

  removeItem: async (id: string) => {
    set({ isRemovingFromCart: true });
    try {
      await removeFromCart(id);
      set((state: any) => ({
        items: state.items.filter((item: any) => item.id !== id),
        isRemovingFromCart: false,
      }));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      set({ isRemovingFromCart: false });
    }
  },

  addItemToCart: async (sku: string, quantity: number) => {
    set({ isAddingToCart: true });
    try {
      await addToCart(sku, quantity);
      // Refresh cart items after adding
      const state = useCart.getState();
      await state.fetchCartItems();
      set({ isAddingToCart: false });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      set({ isAddingToCart: false });
    }
  },

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
      const apiItems = response?.items ?? [];

      // Map API response to cart item structure
      const cartItems: CartItem[] = apiItems.map((item: any) => ({
        id: item.sku, // Use SKU as the unique identifier
        name: item.title,
        price: item.price_snapshot,
        qty: item.quantity,
        image: "/images/placeholder.jpg", // Default placeholder image
        color: item.color || "Default", // Use color from API
        size: item.size || "Default", // Use size from API
        sku: item.sku,
      }));

      set({ items: cartItems, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch cart items:", err);
      set({ isLoading: false });
    }
  },
}));
