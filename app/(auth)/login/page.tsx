"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative h-[calc(100vh-52px)] w-full bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/login-bg.jpg"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="w-[500px] max-w-[90%]">
          <div className="mb-10">
            <label className="block text-sm tracking-widest mb-2">
              Username
            </label>
            <input className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2" />
          </div>

          <div className="mb-6 relative">
            <label className="block text-sm tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2"
            />

            <Link
              href="/forgot-password"
              className="absolute right-0 top-8 text-sm text-white/70 hover:text-white"
            >
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-full tracking-widest mt-6">
            LOGIN
          </button>

          <p className="text-center mt-6 text-sm text-white/70">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline">
              Create one.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
