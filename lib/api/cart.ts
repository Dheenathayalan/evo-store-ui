import api from "./client";
import { useAuth } from "@/store/auth";

export const getCart = async () => {
  const { token } = useAuth.getState();
  return api.get("/cart", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const addToCart = async (sku: string, quantity: number) => {
  const { token } = useAuth.getState();
  return api.post("/cart/add", {
    sku,
    quantity,
  }, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
