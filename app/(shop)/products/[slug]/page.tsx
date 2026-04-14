"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getProductBySlug } from "@/lib/api/products";
import { addToCart } from "@/lib/api/cart";
import { useCart } from "@/store/cart";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { openCart, addItemToCart, isAddingToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>(""); // color name, matches variant.color
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res: any = await getProductBySlug(slug);
        // Support both { data: {...} } and plain object shapes
        const data = res?.data ?? res;
        setProduct(data);
        // No default selection — user picks size & color
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const scrollToIndex = (i: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: i * carouselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: dir === "right" ? carouselRef.current.clientWidth : -carouselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-sm tracking-widest">Loading...</span>
      </div>
    );
  }

  /* ─── Error ─── */
  if (error) {
    return (
      <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center">
        <span className="text-red-400 text-sm">{error}</span>
      </div>
    );
  }

  /* ─── Not found ─── */
  if (!product) {
    return (
      <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-sm tracking-widest">Product not found.</span>
      </div>
    );
  }

  const images: string[] = product.images ?? (product.image ? [product.image] : []);
  const detailImages: string[] = product.detailImages ?? images;
  // API shape: attributes.colors = [{ name: string, value: string }]
  const colors: { name: string; value: string }[] = product.attributes?.colors ?? [];
  // API shape: attributes.sizes = string[]
  const sizes: string[] = product.attributes?.sizes ?? [];
  // Stock: sum of all variant stocks
  const totalStock: number = (product.variants ?? []).reduce(
    (sum: number, v: any) => sum + (v.stock ?? 0),
    0
  );

  // Active variant: matches both selected color (by name) and size
  const activeVariant: any =
    (product.variants ?? []).find(
      (v: any) => v.color === color && v.size === size
    ) ?? null;

  // Price to display: variant price > base_price
  const displayPrice: number = activeVariant?.price ?? product.base_price;

  // Stock for the selected variant (fall back to total)
  const variantStock: number = activeVariant?.stock ?? totalStock;

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* TOP SECTION */}
      <div className="grid md:grid-cols-2 gap-10 px-6 md:px-10 py-12">
        {/* LEFT - CAROUSEL */}
        <div>
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar bg-white"
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  className="min-w-full snap-center flex justify-center items-center"
                >
                  <img
                    src={img}
                    alt={`${product.name} – image ${i + 1}`}
                    className="h-[500px] object-contain transition duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2"
                >
                  ‹
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  onClick={() => scrollToIndex(i)}
                  className="w-16 h-16 object-cover cursor-pointer border hover:border-black"
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT - DETAILS */}
        <div className="max-w-md">
          <h1 className="text-xl tracking-wide mb-1">{product.title}</h1>

          {product.brand && (
            <p className="text-sm text-gray-500 mb-1 uppercase tracking-widest text-xs">{product.brand}</p>
          )}

          {product.description && (
            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <p>{product.description}</p>
            </div>
          )}

          <p className="text-sm mb-4 font-medium">
            {product.currency ?? "₹"}{displayPrice.toLocaleString("en-IN")}
          </p>

          {/* Colors */}
          {colors.length > 0 && (
            <div className="flex gap-3 mb-6">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="relative"
                  onMouseEnter={() => setHoveredColor(c.name)}
                  onMouseLeave={() => setHoveredColor(null)}
                  onClick={() => setColor(color === c.name ? "" : c.name)}
                >
                  <div
                    className={`w-5 h-5 rounded-full cursor-pointer border-2 transition hover:scale-110 ${
                      color === c.name ? "border-black scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                  {/* Tooltip */}
                  {hoveredColor === c.name && (
                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                      {c.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="flex gap-4 mb-6 text-sm">
              {sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`border px-3 py-1 ${size === s ? "bg-black text-white" : "border-gray-400"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6 text-sm">
            <span className="text-gray-600">Quantity:</span>
            <div className="flex items-center gap-3 border w-fit px-2 py-1">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="cursor-pointer"
              >−</button>
              <span className="w-6 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="cursor-pointer"
              >+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-4 flex-col sm:flex-row">
            <button 
              onClick={async () => {
                if (!size || !color) {
                  alert("Please select size and color");
                  return;
                }
                
                try {
                  // Use the selected variant's SKU
                  const sku = activeVariant?.sku || `${product._id || product.id}-${color}-${size}`;
                  await addItemToCart(sku, quantity);
                  
                  // Open cart drawer
                  openCart();
                } catch (err: any) {
                  alert(err?.message || "Failed to add to cart");
                }
              }}
              disabled={isAddingToCart || variantStock === 0}
              className="flex-1 bg-black text-white py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAddingToCart && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isAddingToCart ? "ADDING..." : "ADD TO CART"}
            </button>
            <button className="flex-1 border border-black py-3 text-sm font-medium">BUY</button>
          </div>

          <p className="text-xs text-gray-600 mb-6">
            {variantStock > 0 ? `In stock (${variantStock})` : "Out of stock"} · Ships tomorrow · 14-day easy returns
          </p>

          <div className="mt-6 border-t pt-4 text-sm cursor-pointer">
            Details & Care +
          </div>
        </div>
      </div>

      {/* DETAILS SECTION */}
      {detailImages.length > 0 && (
        <div className="border-t px-6 md:px-10 py-12">
          <h2 className="text-sm tracking-widest mb-6">THE DETAILS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {detailImages.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt={`Detail ${i + 1}`} className="w-full h-[300px] object-cover" />
                <div className="absolute bottom-4 left-4 text-white text-xs opacity-80">
                  Detail {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* YOU MIGHT ALSO LIKE */}
      <div className="border-t px-6 md:px-10 py-12">
        <h2 className="text-sm tracking-widest mb-6">YOU MIGHT ALSO LIKE</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <img
                src="https://narpine.com/cdn/shop/files/NARPINE_028.png?v=1755783754&width=528"
                className="w-full h-[220px] object-contain bg-white"
                alt="Related product"
              />
              <p className="text-sm mt-2">NAVARASA</p>
            </div>
          ))}
        </div>
      </div>

      {/* MADE RIGHT */}
      <div className="border-t grid md:grid-cols-2">
        <div className="p-10">
          <h3 className="text-sm tracking-widest mb-2">MADE RIGHT</h3>
          <p className="text-sm text-gray-600">
            For those who know the difference between made and well made.
          </p>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1520975922284-9c2f1c3e2f2c"
            className="w-full h-full object-cover"
            alt="Made right"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center">
              ▶
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
