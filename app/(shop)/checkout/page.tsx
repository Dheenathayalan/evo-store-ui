"use client";

import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, MapPin, CreditCard, ShoppingBag, ShieldCheck, Plus, Home, Briefcase, Loader2 } from "lucide-react";
import Script from "next/script";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/api/payment";
import { getMyProfile, addAddress } from "@/lib/api/user";
import { createOrder } from "@/lib/api/order";
import { clearCartApi } from "@/lib/api/cart";

// Helper to load Razorpay script on demand
const loadRazorpay = () => {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.id = "razorpay-sdk";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address_line: "",
    landmark: "",
    city: "",
    state: "",
    pin_code: "",
    type: "Home",
    is_default: true
  });

  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isLoggedIn()) {
      router.replace("/login?redirect=/checkout");
    }
    if (mounted && items.length === 0) {
      router.replace("/products");
    }
  }, [mounted, isLoggedIn, items.length, router]);

  useEffect(() => {
    if (mounted && isLoggedIn()) {
      fetchProfile();
    }
  }, [mounted, isLoggedIn]);

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const res: any = await getMyProfile();
      const profile = res.data ?? res;
      setAddresses(profile.addresses || []);
      
      // Auto-select default or first address
      if (profile.addresses?.length > 0) {
        const def = profile.addresses.find((a: any) => a.is_default) || profile.addresses[0];
        setSelectedAddress(def);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSaveAddr = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const res: any = await addAddress(formData);
      const newAddr = res.data ?? res;
      await fetchProfile();
      setSelectedAddress(newAddr);
      setShowAddForm(false);
    } catch (err) {
      alert("Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#f5f5f5]" />;
  }

  if (!isLoggedIn() || items.length === 0) {
    return <div className="min-h-screen bg-[#f5f5f5]" />;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 0. Load Razorpay script only when user clicks Pay
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // 1. Create order on backend
      const res: any = await createRazorpayOrder(total);
      const order = res.data ?? res;

      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      console.log("RAZORPAY KEY:", rzpKey); // Debugging

      if (!rzpKey) {
        alert("CRITICAL: Razorpay Key is missing. Please restart your dev server (npm run dev).");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: rzpKey,
        amount: order.amount,
        currency: order.currency,
        name: "EVO Carlton Trends",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response: any) {
          // 2. Verify payment on backend
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 3. Create order record in DB
            await createOrder({
              items: items.map(item => ({
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.qty,
                size: item.size,
                color: item.color,
                sku: item.sku
              })),
              total_amount: total,
              shipping_address: {
                name: selectedAddress.name,
                phone: selectedAddress.phone,
                address_line: selectedAddress.address_line,
                landmark: selectedAddress.landmark,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pin_code: selectedAddress.pin_code,
                type: selectedAddress.type
              },
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id
            });

            // 4. Success!
            await clearCartApi();
            clearCart();
            alert("Payment Successful! Order Placed.");
            router.push("/orders");
          } catch (err: any) {
            alert("Payment Verification Failed: " + err.message);
          }
        },
        prefill: {
          name: `${user?.first_name} ${user?.last_name}`,
          email: user?.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      alert("Order Creation Failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">

      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400 hover:text-black">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Checkout</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8 grid lg:grid-cols-3 gap-8">

        {/* LEFT - FORM */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-gray-400" size={20} />
              <h2 className="font-bold uppercase text-xs tracking-widest">Contact Information</h2>
            </div>
            <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </section>

          {/* Shipping Address */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-400" size={20} />
                <h2 className="font-bold uppercase text-xs tracking-widest">Shipping Address</h2>
              </div>
              <button 
                onClick={() => setShowAddressSelector(true)}
                className="text-[10px] font-bold text-red-600 tracking-widest uppercase hover:underline"
              >
                Change
              </button>
            </div>
            
            {isLoadingProfile ? (
              <div className="h-20 animate-pulse bg-gray-50 rounded-lg" />
            ) : selectedAddress ? (
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded uppercase">{selectedAddress.type}</span>
                  <p className="font-semibold">{selectedAddress.name}</p>
                </div>
                <p className="text-gray-500">{selectedAddress.address_line}, {selectedAddress.landmark}</p>
                <p className="text-gray-500">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pin_code}</p>
                <p className="text-xs text-gray-400 font-medium pt-1">Phone: {selectedAddress.phone}</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400 italic mb-3">No addresses found</p>
                <button 
                  onClick={() => {
                    setShowAddForm(true);
                    setShowAddressSelector(true);
                  }}
                  className="text-xs font-bold text-black border-b border-black uppercase tracking-tighter hover:text-red-600 hover:border-red-600 transition-colors"
                >
                  Add Shipping Address
                </button>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-gray-400" size={20} />
              <h2 className="font-bold uppercase text-xs tracking-widest">Payment Method</h2>
            </div>
            <div className="border border-black p-4 rounded-lg flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <input type="radio" checked readOnly className="accent-black" />
                <p className="text-sm font-medium">Razorpay (Cards, UPI, NetBanking)</p>
              </div>
              <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-4" />
            </div>
          </section>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="text-gray-400" size={20} />
              <h2 className="font-bold uppercase text-xs tracking-widest">Order Summary</h2>
            </div>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-12 h-16 bg-gray-50 rounded flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-bold truncate">{item.name}</p>
                    <p className="text-gray-400">{item.color} / {item.size}</p>
                    <p className="mt-1 font-semibold">{item.qty} × ₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-500">Subtotal</p>
                <p>₹{total.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Shipping</p>
                <p className="text-green-600 font-medium tracking-tight">FREE</p>
              </div>
              <div className="flex justify-between pt-4 font-bold text-lg border-t mt-4">
                <p>Total</p>
                <p>₹{total.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing || !selectedAddress}
              className="w-full bg-black text-white py-4 mt-8 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isProcessing && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isProcessing ? "Processing..." : "PAY & PLACE ORDER"}
            </button>
            {!selectedAddress && !isLoadingProfile && (
              <p className="text-[10px] text-red-500 text-center mt-3 font-medium">Please add a shipping address to proceed</p>
            )}
          </section>
        </div>

      </div>

      {/* Address Selector Drawer */}
      {showAddressSelector && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">
                {showAddForm ? "Add New Address" : "Select Address"}
              </h2>
              <button 
                onClick={() => {
                   if (showAddForm) setShowAddForm(false);
                   else setShowAddressSelector(false);
                }} 
                className="text-gray-400 hover:text-black"
              >
                {showAddForm ? "BACK" : "✕"}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {showAddForm ? (
                <form onSubmit={handleSaveAddr} className="space-y-6">
                   <div className="space-y-4">
                    <p className="text-[10px] tracking-widest font-bold text-gray-400 uppercase">Contact Details</p>
                    <input 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Full Name *" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black outline-none transition-all text-sm" required 
                    />
                    <input 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="Mobile Number *" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black outline-none transition-all text-sm" required 
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] tracking-widest font-bold text-gray-400 uppercase">Address Info</p>
                    <input 
                      value={formData.pin_code}
                      onChange={e => setFormData({...formData, pin_code: e.target.value})}
                      placeholder="Pin Code *" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black outline-none transition-all text-sm" required 
                    />
                    <input 
                      value={formData.address_line}
                      onChange={e => setFormData({...formData, address_line: e.target.value})}
                      placeholder="Address (House No, Building, Street) *" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black outline-none transition-all text-sm" required 
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        placeholder="City *" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black outline-none transition-all text-sm" required 
                      />
                      <input 
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value})}
                        placeholder="State *" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black outline-none transition-all text-sm" required 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] tracking-widest font-bold text-gray-400 uppercase">Save As</p>
                    <div className="flex gap-4">
                      <button 
                         type="button" 
                         onClick={() => setFormData({...formData, type: "Home"})}
                         className={`flex-1 py-3 border rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 ${formData.type === 'Home' ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-500'}`}
                      >
                        <Home size={14} /> Home
                      </button>
                      <button 
                         type="button" 
                         onClick={() => setFormData({...formData, type: "Work"})}
                         className={`flex-1 py-3 border rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 ${formData.type === 'Work' ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-500'}`}
                      >
                        <Briefcase size={14} /> Work
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSavingAddress}
                    className="w-full py-4 bg-red-600 text-white rounded-xl font-bold tracking-widest uppercase hover:bg-red-700 transition flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSavingAddress && <Loader2 className="animate-spin" size={18} />}
                    {isSavingAddress ? "SAVING..." : "SAVE & SELECT"}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-400 italic text-sm mb-4">No saved addresses</p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          setShowAddressSelector(false);
                        }}
                        className={`w-full text-left p-5 border-2 rounded-xl transition-all ${
                          selectedAddress?.id === addr.id 
                          ? "border-black bg-gray-50" 
                          : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{addr.type}</span>
                          {selectedAddress?.id === addr.id && <ShieldCheck size={16} className="text-black" />}
                        </div>
                        <p className="font-bold text-sm mb-1">{addr.name}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {addr.address_line}, {addr.landmark}<br />
                          {addr.city}, {addr.state} - {addr.pin_code}
                        </p>
                      </button>
                    ))
                  )}
                  
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold tracking-widest text-red-600 hover:border-red-200 hover:bg-red-50 transition-all uppercase flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                </div>
              )}
            </div>

            {!showAddForm && (
              <div className="p-6 border-t bg-gray-50">
                <button 
                  onClick={() => setShowAddressSelector(false)}
                  className="w-full py-4 bg-black text-white rounded-xl font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
