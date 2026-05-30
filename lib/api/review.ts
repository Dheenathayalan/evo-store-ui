import api from "./client";

export const createReview = async (data: { product_slug: string, order_id: string, rating: number, comment: string }) => {
  return await api.post("/reviews", data);
};

export const getProductReviews = async (product_slug: string) => {
  return await api.get(`/reviews/product/${product_slug}`);
};

export const getUserReview = async (order_id: string, product_slug: string) => {
  return await api.get(`/reviews/user/${order_id}/${product_slug}`);
};

export const updateReview = async (review_id: string, data: { rating?: number, comment?: string }) => {
  return await api.put(`/reviews/${review_id}`, data);
};
