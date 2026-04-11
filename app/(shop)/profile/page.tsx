"use client";

import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LogOut,
  MapPin,
  HeadphonesIcon,
  ShoppingBag,
  ChevronRight,
  User,
} from "lucide-react";


const menuItems = [
  {
    icon: ShoppingBag,
    label: "My Orders",
    sub: "Track, return, or buy again",
    href: "/orders",
  },
  {
    icon: MapPin,
    label: "Addresses",
    sub: "Saved addresses for delivery",
    href: "/addresses",
  },
  {
    icon: HeadphonesIcon,
    label: "Support",
    sub: "Help center & contact us",
    href: "/support",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoggedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isLoggedIn()) router.replace("/login");
  }, [mounted]);

  if (!mounted || !isLoggedIn()) return <div className="min-h-screen" />;


  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const displayName =
    user?.first_name
      ? `${user.first_name} ${user.last_name ?? ""}`.trim()
      : user?.email ?? "Member";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Hero banner */}
      <div className="bg-black text-white px-8 py-12 flex items-center gap-6">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-xl font-semibold tracking-widest flex-shrink-0">
          {initials || <User size={28} />}
        </div>

        <div>
          <p className="text-xs tracking-[4px] text-white/50 mb-1">WELCOME BACK</p>
          <h1 className="text-2xl font-semibold tracking-wide">{displayName}</h1>
          <p className="text-sm text-white/60 mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-3">
        {menuItems.map(({ icon: Icon, label, sub, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="w-full bg-white flex items-center gap-4 px-5 py-4 rounded-lg hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center group-hover:bg-red-50 transition">
              <Icon size={18} className="text-gray-600 group-hover:text-red-600 transition" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium tracking-wide">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-red-500 transition" />
          </button>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white flex items-center gap-4 px-5 py-4 rounded-lg hover:shadow-md transition group mt-6"
        >
          <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center group-hover:bg-red-50 transition">
            <LogOut size={18} className="text-gray-600 group-hover:text-red-600 transition" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium tracking-wide text-red-500">Logout</p>
            <p className="text-xs text-gray-400 mt-0.5">Sign out of your account</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-red-500 transition" />
        </button>
      </div>
    </div>
  );
}
