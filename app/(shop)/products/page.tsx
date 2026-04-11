"use client";

import { Suspense } from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getProducts, searchProducts } from "@/lib/api/products";

const LIMIT = 10;

// Inner component uses useSearchParams — must be inside <Suspense>
function ProductList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setError(null);
      setProducts([]);
      setCursor(undefined);
      setHasMore(true);

      try {
        const res: any = searchQuery.trim()
          ? await searchProducts(searchQuery.trim(), LIMIT)
          : await getProducts(LIMIT);

        const items: any[] = Array.isArray(res) ? res : (res?.data ?? []);
        setProducts(items);

        if (items.length > 0) {
          const lastItem = items[items.length - 1];
          setCursor(lastItem._id ?? lastItem.id);
        }

        if (items.length < LIMIT) {
          setHasMore(false);
        }
      } catch (err: any) {
        setError(typeof err === "string" ? err : "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [searchQuery]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursor || loading) return;

    setLoadingMore(true);
    try {
      const res: any = searchQuery.trim()
        ? await searchProducts(searchQuery.trim(), LIMIT, cursor)
        : await getProducts(LIMIT, cursor);

      const items: any[] = Array.isArray(res) ? res : (res?.data ?? []);

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id ?? p.id));
        const newItems = items.filter((p) => !existingIds.has(p._id ?? p.id));
        return [...prev, ...newItems];
      });

      if (items.length > 0) {
        const lastItem = items[items.length - 1];
        setCursor(lastItem._id ?? lastItem.id);
      }

      if (items.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Failed to load more products:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, cursor, loading, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      {/* Title */}
      <div className="px-10 pt-10 pb-6">
        <h1 className="text-gray-700 tracking-widest text-sm">
          {searchQuery
            ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"`
            : "EVO CARLTON COLLECTIONS"}
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-10 pb-10">
        {products.map((p, index) => (
          <ProductCard
            key={`${p._id ?? p.id ?? index}-${index}`}
            product={p}
            index={index}
          />
        ))}
      </div>

      {/* Status */}
      <div
        ref={observerTarget}
        className="h-20 flex justify-center items-center pb-20"
      >
        {(loading || loadingMore) && (
          <span className="text-gray-500 text-sm tracking-widest">
            Loading...
          </span>
        )}
        {error && <span className="text-red-400 text-sm">{error}</span>}
        {!loading && !error && products.length === 0 && (
          <span className="text-gray-400 text-sm tracking-widest">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "No products found."}
          </span>
        )}
        {!loading && !loadingMore && !hasMore && products.length > 0 && (
          <span className="text-gray-400 text-sm tracking-widest">
            No more products.
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-sm tracking-widest">Loading...</span>
      </div>
    }>
      <ProductList />
    </Suspense>
  );
}
