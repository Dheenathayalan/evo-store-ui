import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md text-white">
      <div className="relative flex items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex gap-6 text-sm tracking-wide">
          <Link href="/products" className="hover:opacity-70 transition">
            Shop
          </Link>
          <Link href="/impact" className="hover:opacity-70 transition">
            Impact
          </Link>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-lg tracking-[0.2em]">
          <Link href="/" className="hover:opacity-80 transition">
            EVO CARLTON
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          <button className="hover:scale-110 transition">
            <Search size={20} />
          </button>

          <button className="hover:scale-110 transition">
            <ShoppingCart size={20} />
          </button>

          <Link href="/login" className="hover:scale-110 transition">
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
