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
  const discount: number = product.discount_percentage ?? 0;
  const finalizedPrice: number = discount > 0 ? price * (1 - discount / 100) : price;
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

          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 tracking-wider uppercase">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="flex justify-between items-center mt-3 bg-white px-4 py-3 gap-2">
          <p className="text-sm tracking-widest truncate flex-1" title={name}>{name}</p>
          <div className="flex flex-col items-end">
            {discount > 0 && (
              <span className="text-[10px] text-gray-400 line-through">
                ₹ {price.toLocaleString("en-IN")}
              </span>
            )}
            <p className="text-sm shrink-0">₹ {finalizedPrice.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
