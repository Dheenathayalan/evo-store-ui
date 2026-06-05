"use client";

import { useEffect, useState } from "react";
import { getAdminRedemptions, payoutRedemption, revertRedemption } from "@/lib/api/coupon";
import { toast } from "@/store/toast";
import { CreditCard, CheckCircle, Clock } from "lucide-react";

export default function RedemptionsAdminPage() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingOutId, setPayingOutId] = useState<string | null>(null);

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const fetchRedemptions = async () => {
    try {
      const res: any = await getAdminRedemptions();
      setRedemptions(res.data ?? res);
    } catch (err) {
      console.error("Failed to fetch redemptions:", err);
      toast.error("Failed to load redemptions");
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async (couponCode: string, orderId: string) => {
    try {
      setPayingOutId(orderId);
      await payoutRedemption(couponCode, orderId);
      toast.success("Payout marked successfully!");
      await fetchRedemptions();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to mark payout");
    } finally {
      setPayingOutId(null);
    }
  };

  const handleRevert = async (couponCode: string, orderId: string) => {
    try {
      setPayingOutId(orderId + "-revert");
      await revertRedemption(couponCode, orderId);
      toast.success("Payout reverted successfully!");
      await fetchRedemptions();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to revert payout");
    } finally {
      setPayingOutId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6 md:p-10 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <CreditCard size={28} className="text-black" />
            <h1 className="text-2xl font-semibold">Reward Redemptions</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Approve and process UPI payouts for referrer rewards</p>
        </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : redemptions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
          <p className="text-gray-500 mt-1">There are no redemption requests right now.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Requested By</th>
                  <th className="px-6 py-4">Referee Order</th>
                  <th className="px-6 py-4">Reward Amount</th>
                  <th className="px-6 py-4">UPI ID</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {redemptions.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{r.sender_email}</p>
                      <p className="text-[10px] text-gray-500 mt-1">Code: <span className="font-bold">{r.coupon_code}</span></p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-700">{r.order_number}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{r.referee_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded font-black tracking-wider">
                        ₹{r.reward_amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded inline-block">
                        <p className="font-bold tracking-wide">{r.upi_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.status === "Redeemed" ? (
                        <div className="flex items-center justify-end gap-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider">
                            <CheckCircle size={14} /> Paid Out
                          </span>
                          <button
                            onClick={() => handleRevert(r.coupon_code, r.order_id)}
                            disabled={payingOutId === r.order_id + "-revert"}
                            className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition disabled:opacity-50"
                          >
                            Revert
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePayout(r.coupon_code, r.order_id)}
                          disabled={payingOutId === r.order_id}
                          className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-50 inline-flex items-center gap-2"
                        >
                          {payingOutId === r.order_id ? (
                            "Processing..."
                          ) : (
                            <>
                              <CheckCircle size={14} /> Mark Paid
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
