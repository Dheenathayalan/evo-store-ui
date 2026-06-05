"use client";

import { useEffect, useState } from "react";
import { adminGetAllReviews, adminUpdateReview, adminDeleteReview } from "@/lib/api/review";
import { Star, MessageSquare, Trash2, Edit2, X, Loader2 } from "lucide-react";
import { toast } from "@/store/toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchReviews = async () => {
    try {
      const res: any = await adminGetAllReviews();
      setReviews(res.data ?? res);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await adminDeleteReview(id);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    
    setIsUpdating(true);
    try {
      await adminUpdateReview(editingReview.id, {
        rating: editingReview.rating,
        comment: editingReview.comment
      });
      toast.success("Review updated successfully");
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      toast.error("Failed to update review");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6 md:p-10 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <MessageSquare size={28} className="text-red-500" />
            <h1 className="text-2xl font-semibold">Reviews Management</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Monitor, edit, and moderate customer reviews</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
            <Star size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No reviews found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-lg">{review.user_name}</p>
                      <p className="text-xs text-gray-500">{review.user_email}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-xs tracking-widest uppercase font-bold text-gray-400 mb-1">Product</p>
                    <p className="text-sm font-medium">{review.product_slug}</p>
                  </div>
                  
                  {review.comment && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic border border-gray-100">
                      "{review.comment}"
                    </div>
                  )}
                  
                  <p className="text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-wider">
                    Posted on {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  <button 
                    onClick={() => setEditingReview(review)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold tracking-tight">Edit Review</h2>
              <button 
                onClick={() => setEditingReview(null)}
                className="text-gray-400 hover:text-black transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditingReview({...editingReview, rating: star})}
                      className="p-1"
                    >
                      <Star 
                        size={24} 
                        className={star <= editingReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-2">Comment</label>
                <textarea 
                  value={editingReview.comment || ""}
                  onChange={(e) => setEditingReview({...editingReview, comment: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:bg-white transition min-h-[120px] resize-none"
                  placeholder="Review content..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="flex-1 py-3 bg-gray-100 text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
