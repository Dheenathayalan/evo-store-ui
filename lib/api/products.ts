import api from "./client";

export const createProduct = (payload: any) => {
  return api.post("/products", payload);
};

export const getProducts = (limit: number = 10, cursor?: string) => {
  let url = `/products?limit=${limit}`;
  if (cursor) url += `&cursor=${cursor}`;
  return api.get(url);
};

export const searchProducts = (search: string, limit: number = 10, cursor?: string) => {
  let url = `/products/search?search=${encodeURIComponent(search)}&limit=${limit}`;
  if (cursor) url += `&cursor=${cursor}`;
  return api.get(url);
};

export const getProductBySlug = (slug: string) => {
  return api.get(`/products/${slug}`);
};
