import api from "./client";
import { useAuth } from "@/store/auth";

export const createProduct = (payload: any) => {
  return api.post("/products", payload);
};

export const getProducts = (limit: number = 10, cursor?: string, category?: string, color?: string, sort?: string) => {
  let url = `/products?limit=${limit}`;
  if (cursor) url += `&cursor=${cursor}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (color) url += `&color=${encodeURIComponent(color)}`;
  if (sort) url += `&sort=${sort}`;
  return api.get(url);
};

export const getLandingProducts = (limit: number = 10) => {
  return api.get(`/products/landing?limit=${limit}`);
};

export const searchProducts = (search: string, limit: number = 10, cursor?: string) => {
  let url = `/products/search?search=${encodeURIComponent(search)}&limit=${limit}`;
  if (cursor) url += `&cursor=${cursor}`;
  return api.get(url);
};

export const getProductBySlug = (slug: string) => {
  return api.get(`/products/${slug}`);
};

export const updateProduct = (slug: string, payload: any) => {
  const { token } = useAuth.getState();
  return api.put(`/products/${slug}`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const getUniqueFilters = () => {
  return api.get("/products/filters/unique");
};
