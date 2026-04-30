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
  Package,
  Users,
  PlusSquare
} from "lucide-react";


import { getMyProfile } from "@/lib/api/user";

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

const adminMenuItems = [
  {
    icon: PlusSquare,
    label: "Add Product",
    sub: "Create a new product listing",
    href: "/admin/products/add",
  },
  {
    icon: Package,
    label: "Received Orders",
    sub: "Manage customer orders",
    href: "/admin/orders",
  },
  {
    icon: Users,
    label: "Active Accounts",
    sub: "View registered users",
    href: "/admin/users",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { logout, isLoggedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isLoggedIn()) {
      router.replace("/login");
      return;
    }

    if (mounted && isLoggedIn()) {
      const fetchProfile = async () => {
        try {
          const res: any = await getMyProfile();
          setProfile(res.data ?? res);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn()) return <div className="min-h-screen" />;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
    : "Member";

  const email = profile?.email || "";

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
        {isLoading ? (
          <>
            <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
            <div className="space-y-2">
              <div className="w-24 h-3 bg-white/5 animate-pulse" />
              <div className="w-48 h-6 bg-white/10 animate-pulse" />
              <div className="w-40 h-4 bg-white/5 animate-pulse" />
            </div>
          </>
        ) : (
          <>
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-xl font-semibold tracking-widest flex-shrink-0">
              {initials || <User size={28} />}
            </div>

            <div>
              <p className="text-xs tracking-[4px] text-white/50 mb-1">WELCOME BACK</p>
              <h1 className="text-2xl font-semibold tracking-wide capitalize">{displayName}</h1>
              <p className="text-sm text-white/60 mt-0.5 lowercase">{email}</p>
            </div>
          </>
        )}
      </div>

      {/* Menu */}
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-3">
        {!profile?.is_admin && menuItems.map(({ icon: Icon, label, sub, href }) => (
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

        {profile?.is_admin && (
          <div className="pt-6 space-y-3">
            <p className="text-[10px] tracking-[4px] text-gray-400 ml-1 mb-2 uppercase">Admin Management</p>
            {adminMenuItems.map(({ icon: Icon, label, sub, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="w-full bg-white flex items-center gap-4 px-5 py-4 rounded-lg hover:shadow-md transition group border-l-2 border-red-500"
              >
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition">
                  <Icon size={18} className="text-red-600 transition" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium tracking-wide">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-red-500 transition" />
              </button>
            ))}
          </div>
        )}

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
