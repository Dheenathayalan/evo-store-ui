"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            You will receive an email confirmation shortly with your order details.
          </p>

          <div className="flex gap-3 justify-center">
            <Link
              href="/products"
              className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>

            <Link
              href="/profile"
              className="border border-black text-black px-6 py-2 text-sm font-medium hover:bg-black hover:text-white transition"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}