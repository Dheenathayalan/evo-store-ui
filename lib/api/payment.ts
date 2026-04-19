import api from "./client";
import { useAuth } from "@/store/auth";

export const createRazorpayOrder = (amount: number) => {
  const { token } = useAuth.getState();
  return api.post(
    "/payment/create-order",
    { amount },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};

export const verifyRazorpayPayment = (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const { token } = useAuth.getState();
  return api.post(
    "/payment/verify-payment",
    payload,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};
