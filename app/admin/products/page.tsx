"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProducts, deleteProduct } from "@/lib/api/products";
import { useAuth } from "@/store/auth";
import { toast } from "@/store/toast";
import { MoreVertical, Edit2, Trash2, Plus, ArrowUpDown } from "lucide-react";

export default function AdminProductsPage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isLoggedIn() || !isAdmin)) {
      router.replace("/login");
      return;
    }

    if (mounted) {
      fetchProducts();
    }
  }, [mounted, isLoggedIn, isAdmin, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res: any = await getProducts(100);
      const data = res?.data?.data ?? res?.data ?? [];
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(slug);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to delete product");
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.action-dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#f6f6f6]" />;

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    let aValue = a[key];
    let bValue = b[key];

    if (key === "stock") {
      aValue = (a.variants || []).reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
      bValue = (b.variants || []).reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
    } else if (key === "created_at") {
      aValue = new Date(a.created_at || 0).getTime();
      bValue = new Date(b.created_at || 0).getTime();
    } else if (key === "title") {
      aValue = (a.title || "").toLowerCase();
      bValue = (b.title || "").toLowerCase();
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Products</h1>
          <button
            onClick={() => router.push("/admin/products/add")}
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-black/90 transition text-sm font-medium"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="bg-white shadow-sm border rounded-lg">
          <div className="overflow-visible">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Product</th>
                  <th className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('title')}>
                      Name <ArrowUpDown size={14} className={sortConfig?.key === 'title' ? "text-black" : "text-gray-400"} />
                    </div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('base_price')}>
                      Price <ArrowUpDown size={14} className={sortConfig?.key === 'base_price' ? "text-black" : "text-gray-400"} />
                    </div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap">Offer</th>
                  <th className="px-6 py-4 whitespace-nowrap">Purchased</th>
                  <th className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('stock')}>
                      Stock <ArrowUpDown size={14} className={sortConfig?.key === 'stock' ? "text-black" : "text-gray-400"} />
                    </div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('created_at')}>
                      Date <ArrowUpDown size={14} className={sortConfig?.key === 'created_at' ? "text-black" : "text-gray-400"} />
                    </div>
                  </th>
                  <th className="px-6 py-4 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="w-12 h-12 bg-gray-200 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                      <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20" /></td>
                    </tr>
                  ))
                ) : sortedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      No products found. Add some!
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((p) => {
                    const totalStock = (p.variants || []).reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
                    const image = p.landing_thumbnail || (p.images && p.images[0]) || "";
                    const date = p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : "—";
                    const status = p.is_active ? "ACTIVE" : "INACTIVE";
                    
                    return (
                      <tr key={p._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                            {image ? (
                              <img src={image} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-gray-400">No Img</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{p.title}</td>
                        <td className="px-6 py-4">₹{p.base_price?.toLocaleString("en-IN") || 0}</td>
                        <td className="px-6 py-4">
                          {p.discount_percentage ? `${p.discount_percentage}% OFF` : "—"}
                        </td>
                        <td className="px-6 py-4">0</td>
                        <td className="px-6 py-4">{totalStock}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded tracking-wider ${
                            p.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{date}</td>
                        <td className="px-6 py-4 relative">
                          <div className="flex items-center gap-2">
                            <div className="relative action-dropdown-container">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenDropdown(openDropdown === p.slug ? null : p.slug);
                                }}
                                className="flex items-center gap-2 border border-[#cbcbcb] text-gray-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-50"
                              >
                                Info
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                              
                              {openDropdown === p.slug && (
                                <div 
                                  className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 shadow-xl rounded-lg py-1 z-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => {
                                      setOpenDropdown(null);
                                      router.push(`/admin/products/add?edit=${p.slug}`);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                                  >
                                    <Edit2 size={14} /> Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenDropdown(null);
                                      handleDelete(p.slug);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500 flex items-center gap-2"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
