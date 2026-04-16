"use client";

import Link from "next/link";
import { useState } from "react";
import { resetPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await resetPassword({
        email: email.trim(),
        link: `${window.location.origin}/reset-password`
      });
      setSuccess(true);
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-52px)] w-full bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/login-bg.jpg"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="w-[500px] max-w-[90%] text-center">
          {/* Heading */}
          <h1 className="text-2xl tracking-widest mb-4">
            {success ? "Check your email" : "Reset your password"}
          </h1>

          <p className="text-sm text-white/70 mb-10">
            {success 
              ? "We've sent you an email with instructions to reset your password."
              : "We will send you an email to reset your password."
            }
          </p>

          {!success && (
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-8 text-left">
                <label className="block text-sm tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}

              {/* Submit */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition py-3 rounded-full tracking-widest flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? "SENDING..." : "SUBMIT"}
              </button>
            </form>
          )}

          {/* Back to login */}
          <p className="mt-6 text-sm text-white/70">
            Remember your password?{" "}
            <Link href="/login" className="text-white hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
