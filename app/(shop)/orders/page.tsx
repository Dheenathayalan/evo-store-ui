"use client";

import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { getMyOrders } from "@/lib/api/order";
import { toast } from "@/store/toast";
import { createReview, getUserReview, updateReview } from "@/lib/api/review";
import { Star } from "lucide-react";

interface OrderItem {
  id: string;
  product_slug?: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size: string;
  color: string;
}

interface Order {
  _id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  // Review State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<{product_slug: string, order_id: string, name: string} | null>(null);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isLoggedIn()) {
        router.replace("/login");
    } else if (mounted) {
        fetchOrders();
    }
  }, [mounted, isLoggedIn]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res: any = await getMyOrders();
      setOrders(res.data || res || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = async (product_slug: string, order_id: string, name: string) => {
    setReviewingItem({ product_slug, order_id, name });
    setReviewModalOpen(true);
    setIsLoadingReview(true);
    setExistingReviewId(null);
    setRating(5);
    setComment("");
    
    try {
      const res: any = await getUserReview(order_id, product_slug);
      const reviewData = res.data ?? res;
      if (reviewData) {
        setExistingReviewId(reviewData.id);
        setRating(reviewData.rating);
        setComment(reviewData.comment || "");
      }
    } catch (err: any) {
      // 404 means no review exists, which is fine
    } finally {
      setIsLoadingReview(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingItem) return;
    setIsSubmittingReview(true);
    try {
      if (existingReviewId) {
        await updateReview(existingReviewId, { rating, comment });
        toast.success("Review updated successfully!");
      } else {
        await createReview({
          product_slug: reviewingItem.product_slug,
          order_id: reviewingItem.order_id,
          rating,
          comment
        });
        toast.success("Review submitted successfully!");
      }
      setReviewModalOpen(false);
      setReviewingItem(null);
      setExistingReviewId(null);
      setComment("");
      setRating(5);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!mounted || !isLoggedIn()) return <div className="min-h-screen bg-[#f5f5f5]" />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "text-amber-600 bg-amber-50 border-amber-100";
      case "Shipped": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Delivered": return "text-green-600 bg-green-50 border-green-100";
      case "Cancelled": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing": return <Clock size={12} />;
      case "Shipped": return <Package size={12} />;
      case "Delivered": return <CheckCircle2 size={12} />;
      case "Cancelled": return <AlertCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6 md:p-10 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Order History</h1>
          <p className="text-gray-500 text-sm mt-1">Track, return, or buy again</p>
        </div>
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-gray-300" size={32} />
                <p className="text-xs text-gray-400 font-medium italic">Retrieving your orders...</p>
           </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here.</p>
            <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-gray-200 transition-all">
                {/* Order Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Order {order.order_number}</p>
                    <p className="text-sm font-medium text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-widest uppercase ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-6 flex gap-6">
                      <Link 
                        href={item.product_slug ? `/products/${item.product_slug}` : "#"}
                        className="w-20 h-24 bg-[#f8f8f8] rounded-lg overflow-hidden flex-shrink-0 block"
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain hover:scale-105 transition-transform" />
                      </Link>
                      <div className="flex-1 space-y-1">
                        <Link href={item.product_slug ? `/products/${item.product_slug}` : "#"}>
                          <h3 className="text-sm font-bold tracking-wide text-gray-900 hover:underline decoration-gray-300 underline-offset-4 transition-all">{item.name}</h3>
                        </Link>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{item.size} • {item.color}</p>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-sm font-semibold">₹{item.price.toLocaleString("en-IN")}</p>
                          <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                        </div>
                        {order.status === "Delivered" && item.product_slug && (
                          <div className="pt-3 border-t mt-3 flex justify-end">
                            <button
                              onClick={() => handleOpenReviewModal(item.product_slug as string, order._id, item.name)}
                              className="text-[10px] uppercase tracking-widest font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1 transition-colors"
                            >
                              <Star size={12} className="fill-yellow-600" />
                              Rate & Review
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white flex items-center justify-between border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">₹{order.total_amount.toLocaleString("en-IN")}</p>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-red-600 hover:text-red-700 uppercase transition-all">
                    Track Order <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && reviewingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {isLoadingReview ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-gray-400 mb-4" />
                <p className="text-sm font-bold tracking-widest uppercase text-gray-500">Loading...</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">
                  {existingReviewId ? "Edit Your Review" : "Write a Review"}
                </h3>
                <p className="text-gray-500 text-sm mb-6">Rate your experience with <span className="font-semibold text-gray-900">{reviewingItem.name}</span></p>
                
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="text-[10px] tracking-widest font-bold text-gray-400 uppercase block mb-3">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star 
                            size={28} 
                            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] tracking-widest font-bold text-gray-400 uppercase block mb-3">Comment (Optional)</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like about this product?"
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setReviewModalOpen(false)}
                      disabled={isSubmittingReview}
                      className="flex-1 py-3 text-sm font-bold tracking-widest text-gray-500 hover:text-black uppercase transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmittingReview && <Loader2 size={16} className="animate-spin" />}
                      {isSubmittingReview ? "Saving..." : "Save Review"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
