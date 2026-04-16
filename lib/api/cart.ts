import api from "./client";
import { useAuth } from "@/store/auth";

// Generate or retrieve a persistent UUID for guest users
const getGuestUserId = (): string => {
  const key = "evo_guest_user_id";
  let userId = localStorage.getItem(key);
  
  if (!userId) {
    // Generate a simple UUID-like string
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
  const { token } = useAuth.getState();
  const userId = token ? undefined : getGuestUserId(); // Only pass user_id if no token
  
  const params: any = {};
  if (userId) {
    params.user_id = userId;
  }
  
  return api.get("/cart/", {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const addToCart = async (sku: string, quantity: number) => {
  const { token } = useAuth.getState();
  const userId = token ? undefined : getGuestUserId(); // Only pass user_id if no token
  
  const body: any = {
    sku,
    quantity,
  };
  
  if (userId) {
    body.user_id = userId;
  }
  
  return api.post("/cart/add", body, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const removeFromCart = async (sku: string) => {
  const { token } = useAuth.getState();
  const userId = token ? undefined : getGuestUserId(); // Only pass user_id if no token
  
  const params: any = {};
  if (userId) {
    params.user_id = userId;
  }
  
  return api.delete(`/cart/${sku}`, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
