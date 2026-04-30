import client from "./client";

export const createOrder = async (orderData: any) => {
  return await client.post("/orders", orderData);
};

export const getMyOrders = async () => {
  return await client.get("/orders");
};

export const getOrderDetails = async (id: string) => {
  return await client.get(`/orders/${id}`);
};

export const getAllOrdersAdmin = async () => {
    return await client.get("/orders/admin/received");
};

export const updateOrderStatus = async (id: string, status: string) => {
    return await client.patch(`/orders/${id}/status`, { status });
};
