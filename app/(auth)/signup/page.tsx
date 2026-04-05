"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    updates: false,
    agree: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
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

      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="w-[520px] max-w-[90%]">
          {/* First + Last Name */}
          <div className="flex gap-6 mb-8">
            <div className="w-1/2">
              <label className="block text-sm tracking-widest mb-2">
                First Name
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm tracking-widest mb-2">
                Last Name
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-8">
            <label className="block text-sm tracking-widest mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2"
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block text-sm tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2"
            />
          </div>

          {/* DOB */}
          <div className="mb-8">
            <label className="block text-sm tracking-widest mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-2 text-white"
            />
          </div>

          {/* Checkboxes */}
          <div className="mb-6 space-y-3 text-sm text-white/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="updates"
                checked={form.updates}
                onChange={handleChange}
                className="accent-red-600"
              />
              Send me Evo Carlton updates by email
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="accent-red-600"
              />
              I agree to the{" "}
              <Link href="/privacy" className="underline">
                privacy policy
              </Link>
            </label>
          </div>

          {/* Submit */}
          <button
            disabled={!form.agree}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 transition py-3 rounded-full tracking-widest mt-4"
          >
            CREATE ACCOUNT
          </button>

          {/* Login link */}
          <p className="text-center mt-6 text-sm text-white/70">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
