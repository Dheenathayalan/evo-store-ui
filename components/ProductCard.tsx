"use client";

import { useCart } from "@/store/cart";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProductCard({ product, index }: any) {
  const { openCart, addItemToCart, isAddingToCart } = useCart();

  // ── Field mapping (API shape) ──────────────────────────────────
  const name: string  = product.title  ?? product.name  ?? "";
  const price: number = product.base_price ?? product.price ?? 0;
  const image: string =
    product.thumbnail ??
    product.images?.[0] ??
    product.image ??
    "";
  // ──────────────────────────────────────────────────────────────

  const addToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      // Use first available variant or create a default SKU
      const firstVariant = product.variants?.[0];
      const sku = firstVariant?.sku || `${product._id || product.id}-default-default`;
      const quantity = 1;

      // Call cart store method (handles API call and loading state)
      await addItemToCart(sku, quantity);

      // Open cart drawer
      openCart();
    } catch (err: any) {
      alert(err?.message || "Failed to add to cart");
    }
  };

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

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
            <button
              onClick={addToCart}
              disabled={isAddingToCart}
              className="border border-white px-6 py-2 text-white tracking-widest hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAddingToCart && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isAddingToCart ? "ADDING..." : "ADD TO CART"}
            </button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="flex justify-between items-center mt-3 bg-white px-4 py-3">
          <p className="text-sm tracking-widest">{name}</p>
          <p className="text-sm">₹ {price.toLocaleString("en-IN")}</p>
        </div>
      </motion.div>
    </Link>
  );
}
