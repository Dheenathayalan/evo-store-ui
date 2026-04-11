"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, X } from "lucide-react";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const isLoggedIn = useAuth((s) => s.isLoggedIn)();
  const { openCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const profileHref = mounted && isLoggedIn ? "/profile" : "/login";

  const openSearch = () => setSearchOpen(true);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    closeSearch();
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md text-white">
      {/* Main bar */}
      <div className="relative flex items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex gap-6 text-sm tracking-wide">
          <Link href="/products" className="hover:opacity-70 transition">Shop</Link>
          <Link href="/impact" className="hover:opacity-70 transition">Impact</Link>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-lg tracking-[0.2em]">
          <Link href="/" className="hover:opacity-80 transition">EVO CARLTON</Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          <button onClick={openSearch} className="hover:scale-110 transition" aria-label="Search">
            <Search size={20} />
          </button>

          <button onClick={openCart} className="hover:scale-110 transition">
            <ShoppingCart size={20} />
          </button>

          <Link href={profileHref} className="hover:scale-110 transition">
            <User size={20} />
          </Link>
        </div>
      </div>

      {/* Search overlay — slides down */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          searchOpen ? "max-h-16 border-t border-white/10" : "max-h-0"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex items-center px-6 py-3 gap-3">
          <Search size={16} className="text-white/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-white/50 hover:text-white transition"
              aria-label="Clear"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="text-xs tracking-widest text-white/60 hover:text-white transition uppercase"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
