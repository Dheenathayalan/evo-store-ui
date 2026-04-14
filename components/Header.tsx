"use client";

import Link from "next/link";
import {
  Search, ShoppingCart, User, X, ArrowRight, Menu,
} from "lucide-react";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { searchProducts } from "@/lib/api/products";

export default function Header() {
  const isLoggedIn = useAuth((s) => s.isLoggedIn)();
  const { openCart, fetchCartItems } = useCart();
  const cartItemCount = useCart((state) => state.items.reduce((total, item) => total + item.qty, 0));
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch cart items on app load
    fetchCartItems();
  }, [fetchCartItems]);

  const profileHref = mounted && isLoggedIn ? "/profile" : "/login";
  const isProductList = pathname === "/products";
  const showDropdown = searchOpen && !isProductList && query.trim().length > 0;

  /* ─── Search helpers ─── */
  const openSearch = () => { setSearchOpen(true); setQuery(""); setResults([]); };
  const closeSearch = () => { setSearchOpen(false); setQuery(""); setResults([]); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { closeSearch(); setDrawerOpen(false); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) closeSearch();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const fetchResults = async (search: string) => {
    if (!search.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res: any = await searchProducts(search.trim(), 2);
      setResults(Array.isArray(res) ? res : res?.data || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (isProductList) {
        router.push(val.trim() ? `/products?search=${encodeURIComponent(val.trim())}` : `/products`);
      } else {
        fetchResults(val);
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    closeSearch();
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 bg-black/90 backdrop-blur-md text-white border-b border-white/10"
      >
        <div
          className="h-16 px-4 sm:px-6 items-center grid"
          style={{
            gridTemplateColumns: searchOpen ? "auto 1fr auto" : "1fr auto 1fr",
            transition: "grid-template-columns 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* ── COL 1: Left ── */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="sm:hidden flex items-center justify-center hover:opacity-70 transition-opacity"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Nav links — desktop only */}
            <div className="hidden sm:flex gap-6 text-sm tracking-wide whitespace-nowrap">
              <Link href="/products" className="hover:opacity-70 transition">Shop</Link>
              <Link href="/impact" className="hover:opacity-70 transition">Impact</Link>
            </div>
          </div>

          {/* ── COL 2: Logo ↔ Search ── */}
          <div className="relative flex items-center justify-center min-w-0 h-full">
            {/* Logo */}
            <div
              className="font-semibold text-base sm:text-lg tracking-[0.2em] whitespace-nowrap"
              style={{
                opacity: searchOpen ? 0 : 1,
                transform: searchOpen ? "scale(0.92)" : "scale(1)",
                pointerEvents: searchOpen ? "none" : "auto",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
            >
              <Link href="/" className="hover:opacity-80 transition">EVO CARLTON</Link>
            </div>

            {/* Search input — absolutely positioned, never affects logo layout */}
            <div
              className="absolute inset-0 flex items-center px-2 sm:px-4"
              style={{
                opacity: searchOpen ? 1 : 0,
                pointerEvents: searchOpen ? "auto" : "none",
                transition: "opacity 0.2s ease 0.05s",
              }}
            >
              <form onSubmit={handleSubmit} className="flex w-full items-center border-b border-white/50">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleChange}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/40 py-1 px-1"
                />
              </form>
            </div>
          </div>

          {/* ── COL 3: Right icons ── */}
          <div className="flex items-center justify-end gap-3 sm:gap-5">
            {/* Search / Close */}
            <button
              onClick={searchOpen ? closeSearch : openSearch}
              aria-label={searchOpen ? "Close search" : "Search"}
              className="flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Cart */}
            <button onClick={openCart} className="relative flex items-center justify-center hover:opacity-70 transition-opacity">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* Profile — desktop only */}
            <Link
              href={profileHref}
              className="hidden sm:flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <User size={20} />
            </Link>
          </div>
        </div>

        {/* ── SEARCH DROPDOWN ── */}
        <div
          className="absolute w-full bg-white text-black shadow-xl"
          style={{
            display: "grid",
            gridTemplateRows: showDropdown ? "1fr" : "0fr",
            transition: "grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1)",
            borderBottom: showDropdown ? "1px solid #e5e7eb" : "none",
          }}
        >
          <div className="overflow-hidden min-h-0">
            <div className="p-6 sm:p-8 max-w-4xl mx-auto">
              {loading ? (
                <p className="text-sm text-gray-400 text-center tracking-wider py-4">Searching...</p>
              ) : results.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {results.map((p) => (
                      <Link
                        key={p._id || p.id}
                        href={`/products/${p.slug || p._id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-5 group hover:bg-gray-50 rounded p-3 transition -m-3"
                      >
                        <div className="w-16 h-20 bg-gray-100 shrink-0 flex items-center justify-center overflow-hidden">
                          {(p.thumbnail || p.images?.[0] || p.image) ? (
                            <img
                              src={p.thumbnail || p.images?.[0] || p.image}
                              alt={p.title || p.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          ) : (
                            <span className="text-gray-300 text-[10px]">NO IMAGE</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm tracking-wide font-medium group-hover:underline">
                            {p.title || p.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ₹ {(p.base_price || p.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="flex justify-center mt-6 pt-5 border-t border-gray-100">
                    <Link
                      href={`/products?search=${encodeURIComponent(query.trim())}`}
                      onClick={closeSearch}
                      className="flex items-center gap-2 border border-black px-8 py-3 text-sm tracking-widest hover:bg-black hover:text-white transition duration-200"
                    >
                      View More <ArrowRight size={15} />
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 text-center tracking-wider py-4">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ──────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 sm:hidden transition-opacity duration-300"
        style={{
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
        }}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 left-0 h-full w-72 max-w-[80vw] bg-black text-white z-50 sm:hidden flex flex-col"
        style={{
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 shrink-0">
          <span className="font-semibold tracking-[0.2em] text-sm">EVO CARLTON</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col px-6 pt-8 gap-1 text-sm tracking-widest uppercase">
          <Link
            href="/products"
            onClick={() => setDrawerOpen(false)}
            className="py-4 border-b border-white/10 hover:opacity-70 transition-opacity"
          >
            Shop
          </Link>
          <Link
            href="/impact"
            onClick={() => setDrawerOpen(false)}
            className="py-4 border-b border-white/10 hover:opacity-70 transition-opacity"
          >
            Impact
          </Link>
        </nav>

        {/* Profile at bottom */}
        <div className="px-6 pb-10 shrink-0">
          <Link
            href={profileHref}
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-3 py-4 border-t border-white/10 hover:opacity-70 transition-opacity"
          >
            <User size={20} />
            <span className="text-sm tracking-widest uppercase">
              {mounted && isLoggedIn ? "My Profile" : "Login"}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
