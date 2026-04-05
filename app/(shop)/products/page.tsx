"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";

const LIMIT = 6;

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // fake API
  const fetchProducts = async (pageNumber: number) => {
    setLoading(true);

    await new Promise((res) => setTimeout(res, 800)); // simulate API

    const newProducts = Array.from({ length: LIMIT }).map((_, i) => ({
      id: `${pageNumber}-${i}`,
      name: ["NAVARASA", "KARMA", "CHATHURVARGA", "LEO", "SPECTRE"][i % 5],
      price: 800,
      image:
        "https://narpine.com/cdn/shop/files/NARPINE_028.png?v=1755783754&width=528",
      //   image: "/images/tshirt.png",
    }));

    setProducts((prev) => [...prev, ...newProducts]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Title */}
      <div className="px-10 pt-10 pb-6">
        <h1 className="text-gray-700 tracking-widest text-sm">
          EVO CARLTON COLLECTIONS
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-10 pb-20">
        {products.map((p, index) => (
          <ProductCard key={p.id} product={p} index={index} />
        ))}
      </div>

      {/* Loader */}
      <div ref={loaderRef} className="h-20 flex justify-center items-center">
        {loading && <span className="text-gray-500">Loading...</span>}
      </div>
    </div>
  );
}
