"use client";

import { Suspense } from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getProducts, searchProducts, getUniqueFilters } from "@/lib/api/products";

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

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>(""); // price_asc, price_desc
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [availableFilters, setAvailableFilters] = useState<{ categories: string[], colors: string[] }>({ categories: [], colors: [] });

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setError(null);
      setProducts([]);
      setCursor(undefined);
      setHasMore(true);

      try {
        const colorsParam = selectedColors.join(",");
        const res: any = searchQuery.trim()
          ? await searchProducts(searchQuery.trim(), LIMIT)
          : await getProducts(LIMIT, undefined, selectedCategory, colorsParam, sortBy);

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
  }, [searchQuery, selectedCategory, selectedColors, sortBy]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res: any = await getUniqueFilters();
        setAvailableFilters(res.data ?? res);
      } catch (err) {
        console.error("Failed to fetch filters", err);
      }
    };
    fetchFilters();
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursor || loading) return;

    setLoadingMore(true);
    try {
      const colorsParam = selectedColors.join(",");
      const res: any = searchQuery.trim()
        ? await searchProducts(searchQuery.trim(), LIMIT, cursor)
        : await getProducts(LIMIT, cursor, selectedCategory, colorsParam, sortBy);

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
  }, [loadingMore, hasMore, cursor, loading, searchQuery, selectedCategory, selectedColors, sortBy]);

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
      {/* Top Header/Sort Bar */}
      <div className="px-6 md:px-10 p-5 flex items-center justify-between border-b border-[#cbcbcb] bg-white sticky top-16 z-20">
        <h1 className="text-gray-700 tracking-widest text-[10px] md:text-sm font-medium uppercase">
          {searchQuery
            ? `Search Results: ${searchQuery}`
            : selectedCategory
              ? `${selectedCategory} Collection`
              : "All Collections"}
        </h1>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold border border-black px-4 py-2 rounded-sm hover:bg-black hover:text-white transition-all"
          >
            Filters {(selectedCategory || selectedColors.length > 0) && `(${selectedColors.length + (selectedCategory ? 1 : 0)})`}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-[10px] tracking-widest uppercase outline-none cursor-pointer font-medium"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-10 py-10">
        {/* Desktop Sidebar - Sticky Filters */}
        <div className="hidden md:block md:w-48 lg:w-64 flex-shrink-0">
          <FilterContent 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            sortBy={sortBy}
            setSortBy={setSortBy}
            availableFilters={availableFilters}
          />
        </div>

        {/* Mobile Bottom Sheet */}
        <div className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${showMobileFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-8 transform transition-transform duration-500 ease-out max-h-[80vh] overflow-y-auto ${showMobileFilters ? "translate-y-0" : "translate-y-full"}`}>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" onClick={() => setShowMobileFilters(false)} />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold tracking-tight">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 font-bold">✕</button>
            </div>
            <FilterContent 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              sortBy={sortBy}
              setSortBy={setSortBy}
              availableFilters={availableFilters}
              onFilterClick={() => {}} // Could auto-close on click if preferred
            />
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-black text-white py-5 rounded-xl text-xs font-bold tracking-[0.3em] uppercase mt-12 mb-4"
            >
              Show Results
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
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
            className="h-20 flex justify-center items-center mt-20"
          >
            {(loading || loadingMore) && (
              <span className="text-gray-500 text-[10px] tracking-[0.3em] uppercase">
                Loading more...
              </span>
            )}
            {error && <span className="text-red-400 text-sm">{error}</span>}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm tracking-widest uppercase mb-4">No products found</p>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedColors([]);
                    setSortBy("");
                  }}
                  className="text-[10px] tracking-widest underline uppercase"
                >
                  Reset all filters
                </button>
              </div>
            )}
            {!loading && !loadingMore && !hasMore && products.length > 0 && (
              <span className="text-gray-400 text-[10px] tracking-[0.3em] uppercase">
                End of collection
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterContent({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedColors, 
  setSelectedColors, 
  sortBy, 
  setSortBy,
  availableFilters,
  onFilterClick
}: any) {
  return (
    <div className="sticky top-32 space-y-12">
      {/* Category Section */}
      <div>
        <h3 className="text-[10px] tracking-[0.3em] font-bold uppercase mb-6 text-gray-400">Category</h3>
        <div className="flex flex-col gap-4">
          {availableFilters.categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(selectedCategory === cat ? "" : cat);
                onFilterClick?.();
              }}
              className={`text-left text-xs tracking-widest uppercase transition-colors hover:text-black ${
                selectedCategory === cat ? "text-black font-bold" : "text-gray-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Color Section */}
      <div>
        <h3 className="text-[10px] tracking-[0.3em] font-bold uppercase mb-6 text-gray-400">Color</h3>
        <div className="flex flex-col gap-4">
          {availableFilters.colors.map((clr: string) => (
            <button
              key={clr}
              onClick={() => {
                setSelectedColors((prev: string[]) => 
                  prev.includes(clr) 
                    ? prev.filter(c => c !== clr) 
                    : [...prev, clr]
                );
                onFilterClick?.();
              }}
              className={`text-left text-xs tracking-widest uppercase transition-colors hover:text-black flex items-center justify-between ${
                selectedColors.includes(clr) ? "text-black font-bold" : "text-gray-500"
              }`}
            >
              {clr}
              {selectedColors.includes(clr) && <span className="text-[10px]">✕</span>}
            </button>
          ))}
        </div>
      </div>

      {(selectedCategory || selectedColors.length > 0 || sortBy) && (
        <button 
          onClick={() => {
            setSelectedCategory("");
            setSelectedColors([]);
            setSortBy("");
            onFilterClick?.();
          }}
          className="text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors pt-4 border-t border-[#cbcbcb] w-full text-left"
        >
          Clear Filters
        </button>
      )}
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
