import api from "./client";
import { useAuth } from "@/store/auth";

// Generate or retrieve a persistent UUID for guest users
const getGuestUserId = (): string => {
  const key = "evo_guest_user_id";
  if (typeof window === "undefined") return "server";
  let userId = localStorage.getItem(key);
  
  if (!userId) {
    userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem(key, userId);
  }
  
  return userId;
};

export const getCart = async () => {
  const { isLoggedIn } = useAuth.getState();
  const userId = !isLoggedIn() ? getGuestUserId() : undefined;
  
  return api.get("/cart/", {
    params: userId ? { user_id: userId } : {},
  });
};

export const addToCart = async (sku: string, quantity: number) => {
  const { isLoggedIn } = useAuth.getState();
  const body: any = { sku, quantity };
  if (!isLoggedIn()) body.user_id = getGuestUserId();
  
  return api.post("/cart/add", body);
};

export const removeFromCart = async (sku: string) => {
  const { isLoggedIn } = useAuth.getState();
  const params = !isLoggedIn() ? { user_id: getGuestUserId() } : {};
  
  return api.delete(`/cart/${sku}`, { params });
};

export const clearCartApi = async () => {
  const { isLoggedIn } = useAuth.getState();
  const params = !isLoggedIn() ? { user_id: getGuestUserId() } : {};
  
  return api.delete("/cart/clear", { params });
};
