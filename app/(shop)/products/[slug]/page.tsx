"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductBySlug } from "@/lib/api/products";
import { addToCart } from "@/lib/api/cart";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { Edit2, Ruler, X } from "lucide-react";
import { useRecentlyViewed } from "@/store/recently-viewed";
import RecentlyViewed from "@/components/RecentlyViewed";
import { toast } from "@/store/toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { openCart, addItemToCart, isAddingToCart } = useCart();
  const { isAdmin } = useAuth();
  const { addProduct } = useRecentlyViewed();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>(""); // product_color name, matches variant.product_color
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurementUnit, setMeasurementUnit] = useState<"in" | "cm">("in");
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

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product, addProduct]);

  const scrollToIndex = (i: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: i * carouselRef.current.clientWidth,
      behavior: "smooth",
    });
    setActiveIndex(i);
  };

  const scroll = (dir: "left" | "right", currentImages: string[]) => {
    if (!carouselRef.current) return;
    const next = dir === "right"
      ? Math.min(activeIndex + 1, currentImages.length - 1)
      : Math.max(activeIndex - 1, 0);
    scrollToIndex(next);
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-sm tracking-widest">Loading...</span>
      </div>
    );
  }

  /* ─── Error ─── */
  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <span className="text-red-400 text-sm">{error}</span>
      </div>
    );
  }

  /* ─── Not found ─── */
  if (!product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-sm tracking-widest">Product not found.</span>
      </div>
    );
  }

  const images: string[] = product.images ?? (product.image ? [product.image] : []);
  const detailImages: string[] = product.detailImages ?? images;

  const detailAssets = [
    { type: 'video', src: '/product/the-black-t-shirt-on-a-wooden-hanger-rotating-smoo.mp4', label: 'PREMIUM CONSTRUCTION', description: 'Expertly crafted for durability and style.' },
    { type: 'image', src: '/product/The-Classic-Crew-With-A-Modern-Cut-02.jpg', label: 'MODERN CUT', description: 'A tailored silhouette that flatters every frame.' },
    { type: 'video', src: '/product/the-black-100-organic-cotton-fabric-with-the-spira.mp4', label: 'ORGANIC COTTON', description: 'GOTS certified 100% organic cotton fabric.' },
    { type: 'image', src: '/product/The-Classic-Crew-With-A-Modern-Cut.jpg', label: 'CLASSIC DESIGN', description: 'Timeless aesthetic with a contemporary touch.' },
    { type: 'image', src: '/product/The-Classic-Crew-With-A-Modern-Cut-03.jpg', label: 'SIGNATURE FIT', description: 'Perfected over months for the ultimate comfort.' }
  ];
  // API shape: attributes.colors = [{ name: string, value: string }]
  const colors: { name: string; value: string; design_color?: string }[] = product.attributes?.colors ?? [];
  // API shape: attributes.sizes = string[]
  const sizes: string[] = product.attributes?.sizes ?? [];
  // Stock: sum of all variant stocks
  const totalStock: number = (product.variants ?? []).reduce(
    (sum: number, v: any) => sum + (v.stock ?? 0),
    0
  );

  const defaultMeasurements = {
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    chest: [16.5, 18, 20, 22, 24, 26, 28, 30, 32],
    body: [27, 28, 29, 30, 31, 32, 33, 34, 35],
  };

  const measurements = product.measurements ?? defaultMeasurements;
  const convertMeasurement = (value: number) =>
    measurementUnit === "cm" ? +(value * 2.54).toFixed(1) : value;

  // Active variant: matches both selected color (by name) and size
  const activeVariant: any =
    (product.variants ?? []).find(
      (v: any) => (v.product_color === color || v.color === color) && v.size === size
    ) ?? null;

  // Price to display: variant price > base_price
  const displayPrice: number = activeVariant?.price ?? product.base_price;

  // Stock for the selected variant (fall back to total)
  const variantStock: number = activeVariant?.stock ?? totalStock;

  const discountPercentage = product.discount_percentage || 0;
  const finalizedPrice = discountPercentage > 0
    ? displayPrice * (1 - discountPercentage / 100)
    : displayPrice;

  return (
    <div className="bg-white min-h-screen">
      {/* TOP SECTION */}
      <div className="grid md:grid-cols-2 gap-10 px-6 md:px-10 py-12">
        {/* LEFT - CAROUSEL */}
        <div>
          <div className="relative">
            {images.length === 0 ? (
              <div className="w-full h-[500px] bg-gray-50 flex items-center justify-center border border-[#cbcbcb]">
                <span className="text-gray-300 text-[10px] tracking-[0.3em] font-bold uppercase">No Image Available</span>
              </div>
            ) : (
              <div
                ref={carouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar bg-white"
              >
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="min-w-full snap-center flex justify-center items-center overflow-hidden cursor-zoom-in"
                    onMouseMove={(e) => {
                      const target = e.currentTarget;
                      const { left, top, width, height } = target.getBoundingClientRect();
                      const x = ((e.pageX - left) / width) * 100;
                      const y = ((e.pageY - top) / height) * 100;
                      const imgElement = target.querySelector("img");
                      if (imgElement) {
                        imgElement.style.transformOrigin = `${x}% ${y}%`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      const imgElement = e.currentTarget.querySelector("img");
                      if (imgElement) imgElement.style.transformOrigin = "center center";
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} – image ${i + 1}`}
                      className="h-[500px] w-full object-contain transition duration-200 hover:scale-[2.5]"
                    />
                  </div>
                ))}
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => scroll("left", images)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2"
                >
                  ‹
                </button>
                <button
                  onClick={() => scroll("right", images)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 0 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`w-16 h-16 flex-shrink-0 overflow-hidden border-2 transition-all duration-200 ${i === activeIndex
                    ? "border-black scale-105"
                    : "border-transparent hover:border-gray-400"
                    }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
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

          <div className="mb-4">
            {discountPercentage > 0 ? (
              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold">
                  {product.currency ?? "₹"}{finalizedPrice.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-500 line-through">
                  {product.currency ?? "₹"}{displayPrice.toLocaleString("en-IN")}
                </p>
                <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                  {discountPercentage}% OFF
                </div>
              </div>
            ) : (
              <p className="text-sm mb-0 font-medium">
                {product.currency ?? "₹"}{displayPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* Multi-buy Offer */}
          {product.multi_buy_threshold > 0 && product.multi_buy_discount_amount > 0 && (
            <div className="mb-6 p-4 border border-[#cbcbcb] bg-white rounded-sm flex items-center gap-4">
              <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold">
                %
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase">Limited Offer</p>
                <p className="text-sm text-gray-600">
                  Save ₹{product.multi_buy_discount_amount.toLocaleString("en-IN")} when you buy any {product.multi_buy_threshold} items.
                </p>
              </div>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 tracking-widest uppercase mb-2">Product Color</p>
              <div className="flex gap-3">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className="relative cursor-pointer"
                    onMouseEnter={() => setHoveredColor(c.name)}
                    onMouseLeave={() => setHoveredColor(null)}
                    onClick={() => setColor(color === c.name ? "" : c.name)}
                  >
                    <div
                      className={`w-5 h-5 rounded-full cursor-pointer border-2 transition hover:scale-110 ${color === c.name ? "border-black scale-110" : "border-gray-300"
                        }`}
                      style={{ backgroundColor: c.value }}
                    />
                    {/* Tooltip */}
                    {hoveredColor === c.name && (
                      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                        {c.name}{c.design_color ? ` / ${c.design_color}` : ""}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {color && (() => {
                const selectedColor = colors.find((c) => c.name === color);
                return selectedColor?.design_color ? (
                  <p className="text-xs text-gray-400 mt-2">Design: {selectedColor.design_color}</p>
                ) : null;
              })()}
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="flex items-start justify-between gap-4 mb-6 text-sm">
              <div className="flex flex-wrap gap-2">
                {sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`border border-[#cbcbcb] px-3 py-1 ${size === s ? "bg-black text-white" : "border-[#cbcbcb]"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowMeasurements(true)}
                className="inline-flex items-center justify-center rounded-full border border-[#cbcbcb] p-2 text-gray-700 transition hover:border-black hover:text-black"
                aria-label="Open garment measurements"
              >
                <Ruler size={18} />
              </button>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6 text-sm">
            <span className="text-gray-600">Quantity:</span>
            <div className="flex items-center gap-3 border border-[#cbcbcb] w-fit px-2 py-1">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="cursor-pointer"
              >−</button>
              <span className="w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(q + 1, variantStock || 1))}
                disabled={!activeVariant || quantity >= variantStock}
                className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >+</button>
            </div>
            {activeVariant && variantStock > 0 && (
              <span className="text-xs text-gray-400">{variantStock} in stock</span>
            )}
            {activeVariant && variantStock === 0 && (
              <span className="text-xs text-red-500 font-medium">Out of stock</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-4 flex-col sm:flex-row">
            <button
              onClick={async () => {
                if (!size || !color) {
                  toast.error("Please select size and color");
                  return;
                }

                try {
                  // Use the selected variant's SKU
                  const sku = activeVariant?.sku;
                  if (!sku) {
                    toast.error("This variant is currently unavailable.");
                    return;
                  }
                  await addItemToCart(sku, quantity);
                  toast.success("Added to cart!");

                  // Open cart drawer
                  openCart();
                } catch (err: any) {
                  toast.error(err?.message || "Failed to add to cart");
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
            {isAdmin && (
              <button
                onClick={() => router.push(`/admin/products/add?edit=${slug}`)}
                className="flex-1 border border-black py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition"
              >
                <Edit2 size={16} />
                EDIT
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={async () => {
                  if (!size || !color) {
                    toast.error("Please select size and color");
                    return;
                  }

                  try {
                    // Use the selected variant's SKU
                    const sku = activeVariant?.sku;
                    if (!sku) {
                      toast.error("This variant is currently unavailable.");
                      return;
                    }
                    await addItemToCart(sku, quantity);

                    // Redirect to checkout
                    router.push("/checkout");
                  } catch (err: any) {
                    toast.error(err?.message || "Failed to add to cart");
                  }
                }}
                disabled={variantStock === 0}
                className="flex-1 border border-black py-3 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BUY
              </button>
            )}
          </div>

          <p className="text-xs text-gray-600 mb-6">
            {variantStock > 0 ? `In stock (${variantStock})` : "Out of stock"} · Ships tomorrow · 7-day easy returns
          </p>

          <div className="mt-6 border-t border-[#cbcbcb] pt-4 text-sm cursor-pointer">
            Details & Care +
          </div>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="border-t border-[#cbcbcb] px-6 md:px-10 py-20 bg-white">
        <h2 className="text-sm tracking-widest mb-6">THE DETAILS</h2>
        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x">
          {detailAssets.map((asset, i) => (
            <div key={i} className="flex flex-col min-w-[300px] md:min-w-[380px] snap-start">
              <div className="relative overflow-hidden aspect-[4/5] bg-[#f9f9f9]">
                {asset.type === 'video' ? (
                  <video
                    src={asset.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={asset.src} alt={asset.label} className="w-full h-full object-cover transition duration-700 hover:scale-105" />
                )}
                {/* OVERLAY TEXT */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <p className="text-[10px] tracking-[0.2em] text-white/70 mb-2 font-bold uppercase">{asset.label}</p>
                  <p className="text-sm text-white leading-relaxed font-light">{asset.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="border-t px-6 md:px-10 py-12">
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
      </div> */}

      {/* RECENTLY VIEWED */}
      <RecentlyViewed currentProductId={product?._id ?? product?.id} />

      {/* Measurement panel overlay */}
      <AnimatePresence>
        {showMeasurements && (
          <div className="fixed inset-0 z-50 flex overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowMeasurements(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative ml-auto h-full w-full max-w-[420px] bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#cbcbcb] px-6 py-5">
                <div>
                  <p className="text-[10px] tracking-[0.3em] font-bold uppercase text-gray-400">Garment Measurements</p>
                  <h2 className="text-xl font-bold mt-2">FIT GUIDE</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMeasurements(false)}
                  className="p-2 text-gray-500 hover:text-black transition-colors"
                  aria-label="Close measurements"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 py-8">
                <div className="flex gap-2 mb-8">
                  {[
                    { key: "in", label: "INCHES" },
                    { key: "cm", label: "CM" },
                  ].map((unit) => (
                    <button
                      key={unit.key}
                      type="button"
                      onClick={() => setMeasurementUnit(unit.key as "in" | "cm")}
                      className={`px-4 py-2 text-[10px] tracking-widest font-bold uppercase transition-all duration-300 border ${measurementUnit === unit.key ? "bg-black text-white border-black" : "bg-transparent text-gray-400 border-[#cbcbcb] hover:border-black"}`}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead className="border-b border-[#cbcbcb] text-gray-400">
                      <tr>
                        <th className="px-4 py-3 uppercase tracking-widest font-bold">Size</th>
                        <th className="px-4 py-3 uppercase tracking-widest font-bold">Chest</th>
                        <th className="px-4 py-3 uppercase tracking-widest font-bold">Body length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.sizes.map((sizeLabel: string, index: number) => (
                        <tr key={sizeLabel} className="border-b border-[#cbcbcb] hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 font-bold text-gray-900">{sizeLabel}</td>
                          <td className="px-4 py-4 text-gray-600">{convertMeasurement(measurements.chest[index])}</td>
                          <td className="px-4 py-4 text-gray-600">{convertMeasurement(measurements.body[index])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                  Measurements are garment dimensions taken flat. Use them to compare with a similar item in your wardrobe.
                </p>
                <div className="mt-12 space-y-8">
                  <div>
                    <img src="/images/Measure.jpg" alt="How to measure" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 rounded-sm border border-[#cbcbcb]" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest font-bold uppercase mb-2">Chest</p>
                    <p className="text-xs text-gray-600 leading-relaxed">Lay flat and measure across chest from armpit to armpit.</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest font-bold uppercase mb-2">Body length</p>
                    <p className="text-xs text-gray-600 leading-relaxed">Lay flat and measure from the centre of the neck to the hem.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
