"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEligibleUsersAdmin, createCouponAdmin, getAllCouponsAdmin } from "@/lib/api/coupon";
import { toast } from "@/store/toast";
import { Tag, Users, Calendar, CheckCircle, AlertCircle, ChevronLeft, Plus, Gift, Copy, Loader2, Sparkles } from "lucide-react";

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [eligibleUsers, setEligibleUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    sender_email: "",
    count: "",
    expiry_date: "",
    discount_percentage: 10
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [couponsRes, usersRes] = await Promise.all([
        getAllCouponsAdmin(),
        getEligibleUsersAdmin()
      ]);
      setCoupons((couponsRes as any).data ?? couponsRes);
      setEligibleUsers((usersRes as any).data ?? usersRes);
    } catch (err) {
      console.error("Failed to fetch coupons data:", err);
      toast.error("Failed to load coupon data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDiscountChange = (newDiscount: number) => {
    let updatedCode = formData.code;
    if (updatedCode && /^REF\d+-/.test(updatedCode)) {
      updatedCode = updatedCode.replace(/^REF\d+-/, `REF${newDiscount}-`);
    } else if (!updatedCode && formData.sender_email) {
      const namePart = formData.sender_email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      updatedCode = `REF${newDiscount}-${namePart}-${randomSuffix}`;
    }
    setFormData({
      ...formData,
      discount_percentage: newDiscount,
      code: updatedCode
    });
  };

  const handleSelectUser = (email: string, orderNo: string) => {
    const prefix = `REF${formData.discount_percentage}-` + email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const thirtyDaysFromNow = new Date(); thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    setFormData({
      ...formData,
      sender_email: email,
      code: `${prefix}-${randomSuffix}`,
      expiry_date: thirtyDaysFromNow.toISOString().split("T")[0]
    });
    toast.success(`Selected customer from order ${orderNo}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.sender_email || !formData.expiry_date) {
      toast.error("Please fill all required fields");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        code: formData.code,
        sender_email: formData.sender_email,
        count: formData.count ? Number(formData.count) : undefined,
        expiry_date: new Date(formData.expiry_date).toISOString(),
        discount_percentage: formData.discount_percentage
      };

      await createCouponAdmin(payload);
      toast.success("Coupon created & assigned successfully!");
      setFormData({ code: "", sender_email: "", count: "", expiry_date: "", discount_percentage: 10 });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || "Failed to create coupon");
    } finally {
      setCreating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied coupon ${code}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6 md:p-10 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Gift size={28} className="text-red-500" />
            <h1 className="text-2xl font-semibold">Referral Coupons Management</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Issue 10% referral discount codes to customers past their 7-day exchange period</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: FORM & ELIGIBLE USERS */}
        <div className="space-y-8 lg:col-span-1">
          {/* Create Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Plus size={20} className="text-red-600" />
              <h2 className="font-bold uppercase tracking-widest text-xs">Issue New Coupon</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Recipient Email *</label>
                <input 
                  type="email"
                  value={formData.sender_email}
                  onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                  placeholder="customer@example.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1">The verified customer who ordered</p>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Coupon Code *</label>
                <input 
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. REF10-VIP"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold tracking-wider outline-none focus:border-black focus:bg-white transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Usage Limit</label>
                  <input 
                    type="number"
                    min="1"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                    placeholder="Infinite"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Leave blank for unlimited</p>
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Offer (%)</label>
                  <input 
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => handleDiscountChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-1.5">Expiry Date *</label>
                <input 
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-black focus:bg-white transition"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={creating}
                className="w-full py-3.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {creating ? "Issuing..." : "Send Referral Coupon"}
              </button>
            </form>
          </div>

          {/* Eligible Customers list */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-h-[380px] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-400" />
                <h2 className="font-bold uppercase tracking-widest text-xs">Eligible Buyers</h2>
              </div>
              <span className="text-[10px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full">
                {eligibleUsers.length} Found
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mb-4">Orders Delivered &gt; 7 days ago (Exchange period finished)</p>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : eligibleUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-gray-400 italic">No eligible customers found</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {eligibleUsers.map((user, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectUser(user.email, user.order_number)}
                    className="w-full text-left p-3.5 bg-gray-50/70 hover:bg-red-50/50 border border-transparent hover:border-red-200 rounded-xl transition group flex items-center justify-between"
                  >
                    <div className="truncate pr-3">
                      <p className="font-semibold text-xs tracking-tight text-gray-900 truncate">{user.email}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{user.order_number} • ₹{user.amount?.toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 opacity-0 group-hover:opacity-100 transition tracking-wider uppercase shrink-0">
                      Select ↗
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ISSUED COUPONS TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-black" />
                <h2 className="font-bold uppercase tracking-widest text-xs">Issued Coupons Overview</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">{coupons.length} total coupons</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
                <Tag size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-500">No referral coupons issued yet</p>
                <p className="text-xs text-gray-400 mt-1">Select an eligible buyer on the left to send your first coupon</p>
              </div>
            ) : (
              <div className="space-y-4">
                {coupons.map((c) => {
                  const isExpired = new Date(c.expiry_date) < new Date();
                  return (
                    <div key={c._id} className="p-5 bg-gray-50/80 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => copyCode(c.code)}
                            className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider hover:bg-neutral-800 transition shadow-sm"
                          >
                            <span>{c.code}</span>
                            <Copy size={12} className="text-gray-400" />
                          </button>
                          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">
                            {c.discount_percentage}% OFF
                          </span>
                          {isExpired && (
                            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase">
                              Expired
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span>Expires: {new Date(c.expiry_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-gray-200/60 text-xs">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Assigned Referrer</p>
                          <p className="font-semibold text-gray-800 truncate mt-0.5">{c.sender_email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Usage Count</p>
                          <p className="font-semibold text-gray-800 mt-0.5">
                            {c.used_count} / {c.count !== null && c.count !== undefined ? c.count : "∞"} applied
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Referees</p>
                          <p className="font-semibold text-gray-800 mt-0.5">
                            {c.usages?.length || 0} checkout usages
                          </p>
                        </div>
                      </div>

                      {/* Usages preview */}
                      {c.usages && c.usages.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200/60 space-y-2">
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Referee Order Details</p>
                          <div className="space-y-1.5">
                            {c.usages.map((u: any, idx: number) => (
                              <div key={idx} className="bg-white px-3 py-2 rounded border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold truncate max-w-[180px]">{u.user_email}</span>
                                  <span className="text-gray-400 text-[10px]">({u.order_number})</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-bold text-gray-700">₹{u.order_total?.toLocaleString()}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    u.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {u.order_status}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    u.reward_status === 'Active' ? 'bg-purple-100 text-purple-700 font-extrabold' :
                                    u.reward_status === 'Used' ? 'bg-gray-100 text-gray-600 line-through' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    Reward: {u.reward_status} {u.reward_amount ? `(₹${u.reward_amount})` : ''}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
