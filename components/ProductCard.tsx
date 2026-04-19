"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProductCard({ product, index }: any) {

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
