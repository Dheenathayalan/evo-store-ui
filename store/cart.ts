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
  designColor?: string;
  productId?: string;
  product_slug?: string;
  multi_buy_threshold?: number;
  multi_buy_discount_amount?: number;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
  isLoading: boolean;
  isAddingToCart: boolean;
  isRemovingFromCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  increaseQty: (id: string) => Promise<void>;
  decreaseQty: (id: string) => void;
  removeItem: (id: string, designColor?: string) => Promise<void>;
  addItemToCart: (sku: string, quantity: number, designColor?: string) => Promise<void>;
  addItem: (item: CartItem) => void;
  setItems: (items: CartItem[]) => void;
  fetchCartItems: () => Promise<void>;
  clearCart: () => void;
}

export const useCart = create<CartState>((set) => ({
  isOpen: false,
  items: [],
  isLoading: false,
  isAddingToCart: false,
  isRemovingFromCart: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  increaseQty: async (id: string) => {
    const state = useCart.getState();
    const item = state.items.find((i: any) => i.id === id);
    if (!item) return;
    try {
      await addToCart(item.sku, 1, item.designColor);
      await state.fetchCartItems();
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Cannot add more — stock limit reached";
      alert(msg);
    }
  },

  decreaseQty: async (id: string) => {
    const state = useCart.getState();
    const item = state.items.find((item: any) => item.id === id);
    
    if (item && item.qty === 1) {
      // If quantity is 1, remove the item instead
      await state.removeItem(item.sku, item.designColor);
    } else {
      // Otherwise, decrease quantity
      set((state: any) => ({
        items: state.items.map((item: any) =>
          item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item,
        ),
      }));
    }
  },

  removeItem: async (sku: string, designColor?: string) => {
    set({ isRemovingFromCart: true });
    try {
      await removeFromCart(sku, designColor);
      const targetId = designColor ? `${sku}|${designColor}` : sku;
      set((state: any) => ({
        items: state.items.filter((item: any) => item.id !== targetId),
        isRemovingFromCart: false,
      }));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      set({ isRemovingFromCart: false });
    }
  },

  addItemToCart: async (sku: string, quantity: number, designColor?: string) => {
    set({ isAddingToCart: true });
    try {
      await addToCart(sku, quantity, designColor);
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
      const targetId = item.designColor ? `${item.sku}|${item.designColor}` : item.sku;
      const existingItem = state.items.find((i: any) => i.id === targetId);
      if (existingItem) {
        return {
          items: state.items.map((i: any) =>
            i.id === targetId ? { ...i, qty: i.qty + item.qty } : i,
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
        id: item.design_color ? `${item.sku}|${item.design_color}` : item.sku,
        name: item.title,
        price: item.price_snapshot,
        qty: item.quantity,
        image: item.image || "/images/placeholder.jpg",
        color: item.color || "Default",
        size: item.size || "Default",
        designColor: item.design_color,
        sku: item.sku,
        productId: item.productId,
        product_slug: item.product_slug,
        multi_buy_threshold: item.multi_buy_threshold || 0,
        multi_buy_discount_amount: item.multi_buy_discount_amount || 0,
      }));

      set({ items: cartItems, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch cart items:", err);
      set({ isLoading: false });
    }
  },
  clearCart: () => set({ items: [] }),
}));
