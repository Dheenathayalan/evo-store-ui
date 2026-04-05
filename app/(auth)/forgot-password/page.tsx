"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

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
          <h1 className="text-2xl tracking-widest mb-4">Reset your password</h1>

          <p className="text-sm text-white/70 mb-10">
            We will send you an email to reset your password.
          </p>

          {/* Email */}
          <div className="mb-8 text-left">
            <label className="block text-sm tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2"
            />
          </div>

          {/* Submit */}
          <button className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-full tracking-widest">
            SUBMIT
          </button>

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
