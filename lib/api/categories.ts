import api from "./client";
import { useAuth } from "@/store/auth";

export const getCategories = () => {
  return api.get("/categories");
};

export const createCategory = (payload: any) => {
  const { token } = useAuth.getState();
  return api.post("/categories", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const updateCategory = (id: string, payload: any) => {
  const { token } = useAuth.getState();
  return api.put(`/categories/${id}`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const deleteCategory = (id: string) => {
  const { token } = useAuth.getState();
  return api.delete(`/categories/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
