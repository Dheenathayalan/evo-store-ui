"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyCoupons, redeemReward } from "@/lib/api/coupon";
import { toast } from "@/store/toast";
import { Tag, Calendar, Copy, ChevronLeft, Sparkles, Gift, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function MyCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [showUpiModal, setShowUpiModal] = useState<{code: string, orderId: string, amount: number} | null>(null);
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res: any = await getMyCoupons();
      setCoupons(res.data ?? res);
    } catch (err) {
      console.error("Failed to fetch my coupons:", err);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied coupon code ${code}! Share with friends.`);
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showUpiModal || !upiId.trim()) return;

    try {
      setRedeemingId(showUpiModal.orderId);
      const res: any = await redeemReward(showUpiModal.code, showUpiModal.orderId, upiId.trim());
      const data = res.data ?? res;
      toast.success(`Redemption requested! ₹${data.amount} will be sent to ${upiId.trim()}`);
      await fetchCoupons();
      setShowUpiModal(null);
      setUpiId("");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to submit redemption");
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6 md:p-10 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Gift size={28} className="text-red-500" />
            <h1 className="text-2xl font-semibold">My Referral Coupons</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Share your custom code to give friends a discount. When their order is Delivered, you earn a matching cash reward directly to your bank account!
          </p>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <Gift size={56} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-lg font-bold text-gray-800 mb-1">No Referral Coupons Yet</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Referral coupons are automatically issued to verified buyers 7 days after their order is delivered. Complete a purchase to unlock your custom referral rewards!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {coupons.map((coupon) => {
              const isExpired = new Date(coupon.expiry_date) < new Date();
              
              // Sum active rewards available for this coupon
              const activeRewards = coupon.usages?.filter((u: any) => u.reward_status === 'Active') || [];
              const activeRewardCount = activeRewards.length;
              const activeRewardAmount = activeRewards.reduce((sum: number, u: any) => sum + (u.reward_amount || 0), 0);

              return (
                <div key={coupon._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Coupon Card Top Banner */}
                  <div className="bg-gradient-to-r from-neutral-900 to-black p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                          {coupon.discount_percentage}% OFF
                        </span>
                        <h2 className="text-2xl font-black tracking-wider text-white">{coupon.code}</h2>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-medium transition"
                        >
                          <Copy size={14} /> Copy Code
                        </button>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Give {coupon.discount_percentage}% off. Earn {coupon.discount_percentage}% of their order amount when Delivered.
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-neutral-300 border-t md:border-t-0 md:border-l border-neutral-800 pt-3 md:pt-0 md:pl-6">
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Expires</p>
                        <p className="font-semibold mt-0.5 text-white">
                          {new Date(coupon.expiry_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Applications</p>
                        <p className="font-semibold mt-0.5 text-white">
                          {coupon.used_count} / {coupon.count ?? "Unlimited"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rewards Banner if active rewards exist */}
                  {activeRewardCount > 0 && (
                    <div className="bg-purple-50 border-b border-purple-100 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-700 text-xs font-bold tracking-wide">
                        <Sparkles size={16} className="text-purple-600 animate-pulse" />
                        <span>You have ₹{activeRewardAmount.toLocaleString("en-IN")} available across {activeRewardCount} reward(s) ready to redeem to your account!</span>
                      </div>
                    </div>
                  )}

                  {/* Usages / Order Tracking Section */}
                  <div className="p-6 bg-white">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4 flex items-center gap-2">
                      <Tag size={14} /> Referee Order History & Rewards Status
                    </h3>

                    {!coupon.usages || coupon.usages.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                        <p className="text-xs text-gray-500 font-medium">No one has applied your referral code yet</p>
                        <p className="text-[10px] text-gray-400 mt-1">Copy your code above and share it with friends to start earning rewards</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {coupon.usages.map((u: any, idx: number) => {
                          const rewardActive = u.reward_status === 'Active';
                          const rewardUsed = u.reward_status === 'Used' || u.reward_status === 'Redeemed';
                          const rewardExpired = u.reward_status === 'Expired';
                          
                          let expiryText = "";
                          if (rewardActive && u.reward_expiry) {
                            expiryText = `Expires ${new Date(u.reward_expiry).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`;
                          }

                          return (
                            <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                                  u.order_status === 'Delivered' ? 'bg-green-600' : 'bg-blue-500'
                                }`}>
                                  {idx + 1}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">{u.user_email}</span>
                                    <span className="text-[10px] text-gray-400 font-normal">({u.order_number})</span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-0.5">
                                    Applied on {new Date(u.used_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} • ₹{u.order_total?.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                                <div>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Order Status</p>
                                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                                    u.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {u.order_status}
                                  </span>
                                </div>

                                <div className="text-right sm:border-l pl-4 border-gray-200">
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Your Reward</p>
                                  <div className="mt-1 flex justify-end items-center gap-2">
                                    {rewardActive ? (
                                      <button
                                        onClick={() => setShowUpiModal({code: coupon.code, orderId: u.order_id, amount: u.reward_amount || 0})}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition flex items-center gap-1 shadow-sm"
                                      >
                                        Redeem ₹{u.reward_amount || 0}
                                      </button>
                                    ) : (
                                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                                        rewardUsed ? 'bg-gray-200 text-gray-500 line-through font-normal' :
                                        rewardExpired ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                                      }`}>
                                        {u.reward_status + (u.reward_amount ? ` (₹${u.reward_amount})` : "")}
                                      </span>
                                    )}
                                  </div>
                                  {expiryText && (
                                    <p className="text-[10px] text-purple-600 font-bold mt-1">{expiryText}</p>
                                  )}
                                  {u.reward_status === 'Pending' && (
                                    <p className="text-[9px] text-gray-400 italic mt-1">
                                      {u.order_status === 'Delivered' 
                                        ? "Unlocks after 7-day exchange window" 
                                        : "Unlocks after delivery & 7-day exchange"}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* UPI Redemption Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-black tracking-wide mb-2">Redeem to Bank Account</h3>
            <p className="text-xs text-gray-500 mb-6">Enter your UPI ID to receive your ₹{showUpiModal.amount} reward. It will be credited once approved by our team.</p>
            
            <form onSubmit={handleRedeem}>
              <div className="mb-6">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">UPI ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210@ybl"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-purple-500 transition"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowUpiModal(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!upiId.trim() || redeemingId === showUpiModal.orderId}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {redeemingId === showUpiModal.orderId ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
