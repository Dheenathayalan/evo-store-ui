import client from "./client";

export const getEligibleUsersAdmin = async () => {
  return await client.get("/coupons/eligible-users");
};

export const createCouponAdmin = async (data: { code: string; sender_email: string; count?: number; expiry_date: string; discount_percentage?: number }) => {
  return await client.post("/coupons/admin", data);
};

export const getAllCouponsAdmin = async () => {
  return await client.get("/coupons/admin");
};

export const getMyCoupons = async () => {
  return await client.get("/coupons/my");
};

export const validateCouponCode = async (code: string) => {
  return await client.post("/coupons/validate", { code });
};

export const redeemReward = async (code: string, orderId: string, upiId: string) => {
  return await client.post("/coupons/redeem", { code, order_id: orderId, upi_id: upiId });
};

export const getAdminRedemptions = async () => {
  return await client.get("/coupons/admin/redemptions");
};

export const payoutRedemption = async (couponCode: string, orderId: string) => {
  return await client.post("/coupons/admin/redemptions/payout", { coupon_code: couponCode, order_id: orderId });
};

export const revertRedemption = async (couponCode: string, orderId: string) => {
  return await client.post("/coupons/admin/redemptions/revert", { coupon_code: couponCode, order_id: orderId });
};
