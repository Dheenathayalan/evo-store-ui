"use client";

import { useRef, useState } from "react";

const images = [
  "https://narpine.com/cdn/shop/files/NARPINE_609.png?v=1755604141&width=900",
  "https://narpine.com/cdn/shop/files/NARPINE_630.png?v=1755604141&width=900",
  "https://narpine.com/cdn/shop/files/NARPINE_604.png?v=1755604141&width=900",
];

const detailsImages = [
  "https://narpine.com/cdn/shop/files/NARPINE_609.png?v=1755604141&width=900",
  "https://narpine.com/cdn/shop/files/NARPINE_630.png?v=1755604141&width=900",
  "https://narpine.com/cdn/shop/files/NARPINE_604.png?v=1755604141&width=900",
];

export default function ProductDetails() {
  const [size, setSize] = useState("M");
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = (i: number) => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.clientWidth;
    carouselRef.current.scrollTo({
      left: i * width,
      behavior: "smooth",
    });
  };

  const scroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.clientWidth;

    carouselRef.current.scrollBy({
      left: dir === "right" ? width : -width,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* TOP SECTION */}
      <div className="grid md:grid-cols-2 gap-10 px-6 md:px-10 py-12">
        {/* LEFT - CAROUSEL */}
        <div>
          <div className="relative">
            {/* Carousel */}
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
                    className="h-[500px] object-contain transition duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Arrows */}
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
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => scrollToIndex(i)}
                className="w-16 h-16 object-cover cursor-pointer border hover:border-black"
              />
            ))}
          </div>
        </div>

        {/* RIGHT - DETAILS */}
        <div className="max-w-md">
          <h1 className="text-xl tracking-wide mb-1">Cotton Tee</h1>

          <p className="text-sm text-gray-600 mb-4">180 GSM · Black</p>

          <div className="text-sm text-gray-600 mb-4 space-y-1">
            <p>Modern Cut.</p>
            <p>Double Stitch, Reinforced Ribs.</p>
            <p>100% Organic Cotton.</p>
          </div>

          <p className="text-sm mb-4">₹800</p>

          {/* Colors */}
          <div className="flex gap-3 mb-6">
            {["#000", "#f00", "#0f0", "#00f"].map((c, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full cursor-pointer border"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Sizes */}
          <div className="flex gap-4 mb-6 text-sm">
            {["S", "M", "L", "XL"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`border px-3 py-1 ${
                  size === s ? "bg-black text-white" : "border-gray-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-4">
            <button className="flex-1 bg-black text-white py-3">
              ADD TO CART
            </button>
            <button className="flex-1 border border-black py-3">BUY</button>
          </div>

          <p className="text-xs text-gray-600 mb-6">
            In stock · Ships tomorrow · 14-day easy returns
          </p>

          <p className="text-xs text-gray-600 leading-relaxed">
            Crafted from cool cotton jersey, our tee features a relaxed fit,
            double-stitched reinforced ribs, and a solid, long-lasting
            construction.
          </p>

          <div className="mt-6 border-t pt-4 text-sm cursor-pointer">
            Details & Care +
          </div>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="border-t px-6 md:px-10 py-12">
        <h2 className="text-sm tracking-widest mb-6">THE DETAILS</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {detailsImages.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img} className="w-full h-[300px] object-cover" />

              <div className="absolute bottom-4 left-4 text-white text-xs opacity-80">
                Detail {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YOU MAY LIKE */}
      <div className="border-t px-6 md:px-10 py-12">
        <h2 className="text-sm tracking-widest mb-6">YOU MIGHT ALSO LIKE</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <img
                src="https://narpine.com/cdn/shop/files/NARPINE_028.png?v=1755783754&width=528"
                className="w-full h-[220px] object-contain bg-white"
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
