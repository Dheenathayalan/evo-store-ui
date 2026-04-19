"use client";

import { useRecentlyViewed } from "@/store/recently-viewed";
import ProductCard from "./ProductCard";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RecentlyViewed({ currentProductId }: { currentProductId?: string }) {
  const { products } = useRecentlyViewed();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter out the current product from the recently viewed list
  const displayProducts = products.filter(
    (p) => (p._id ?? p.id) !== currentProductId
  );

  if (displayProducts.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 300; // Approx card width
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="border-t px-6 md:px-10 py-12 bg-[#f5f5f5]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm tracking-[0.3em] font-light uppercase">Recently Viewed</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => scroll("left")}
            className="w-10 h-10 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-10 h-10 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory"
      >
        {displayProducts.map((product, index) => (
          <div key={product._id ?? product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
