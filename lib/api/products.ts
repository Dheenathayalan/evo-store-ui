import api from "./client";

export const createProduct = (payload: any) => {
  return api.post("/products", payload);
};
