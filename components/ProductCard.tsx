"use client";

import { useAuth } from "@/store/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";

export default function ProductCard({ product, index }: any) {
  const { isAdmin } = useAuth();
  const router = useRouter();

  // ── Field mapping (API shape) ──────────────────────────────────
  const name: string  = product.title  ?? product.name  ?? "";
  const price: number = product.base_price ?? product.price ?? 0;
  const image: string =
    product.thumbnail ??
    product.images?.[0] ??
    product.image ??
    "";
  // ──────────────────────────────────────────────────────────────

  return (
    <Link href={`/products/${product.slug ?? product._id ?? product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.05,
          ease: "easeOut",
        }}
        className="group cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-white">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-[320px] object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-[320px] bg-gray-100 flex items-center justify-center">
              <span className="text-gray-300 text-xs tracking-widest">NO IMAGE</span>
            </div>
          )}

          {/* Hover Overlay - Only for Admins now that Add to Cart is removed */}
          {isAdmin && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/admin/products/add?edit=${product.slug ?? product._id}`);
                }}
                className="border border-white px-4 py-2 text-white tracking-widest hover:bg-white hover:text-black transition flex items-center gap-2"
              >
                <Edit2 size={16} />
                EDIT
              </button>
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="flex justify-between items-center mt-3 bg-white px-4 py-3 gap-4">
          <p className="text-sm tracking-widest truncate flex-1" title={name}>{name}</p>
          <p className="text-sm shrink-0">₹ {price.toLocaleString("en-IN")}</p>
        </div>
      </motion.div>
    </Link>
  );
}
