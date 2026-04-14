"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, closeCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 1000 ? 0 : 100; // Free shipping over ₹1000
  const total = Math.max(0, subtotal + shipping - discountAmount);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/products');
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    setShippingErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    setBillingErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }

    // Simple discount logic - you can replace with API call
    if (discountCode.toUpperCase() === "DISCOUNT10") {
      const discount = Math.round(subtotal * 0.1); // 10% off
      setDiscountAmount(discount);
      setDiscountError("");
    } else if (discountCode.toUpperCase() === "SAVE50") {
      setDiscountAmount(50); // Fixed ₹50 off
      setDiscountError("");
    } else {
      setDiscountError("Invalid discount code");
      setDiscountAmount(0);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscountAmount(0);
    setDiscountError("");
  };

  const handlePayment = async () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    const newShippingErrors: Record<string, string> = {};
    const newBillingErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        newShippingErrors[field] = 'This field is required.';
      }
    });

    if (!billingSameAsShipping) {
      requiredFields.forEach((field) => {
        if (!billingAddress[field as keyof typeof billingAddress]) {
          newBillingErrors[field] = 'This field is required.';
        }
      });
    }

    setShippingErrors(newShippingErrors);
    setBillingErrors(newBillingErrors);

    const billing = billingSameAsShipping ? shippingAddress : billingAddress;

    if (Object.keys(newShippingErrors).length > 0 || Object.keys(newBillingErrors).length > 0) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create order on backend (you'll need to implement this API)
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuth.getState().token}`
        },
        body: JSON.stringify({
          items,
          shippingAddress,
          billingAddress: billing,
          total
        })
      });

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // You'll need to set this in env
        amount: total * 100, // Razorpay expects amount in paisa
        currency: 'INR',
        name: 'EVO Store',
        description: 'Purchase from EVO Store',
        order_id: orderData.orderId,
        handler: function (response: any) {
          // Payment successful
          alert('Payment successful! Order ID: ' + response.razorpay_order_id);
          // Clear cart and redirect
          closeCart();
          router.push('/order-success');
        },
        prefill: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#000000',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT - FORM (Scrollable) */}
          <div className="space-y-6 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingAddress.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                    required
                  />
                  {shippingErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{shippingErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingAddress.lastName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                    required
                  />
                  {shippingErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{shippingErrors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingAddress.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                    required
                  />
                  {shippingErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{shippingErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                    required
                  />
                  {shippingErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{shippingErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                    required
                  />
                  {shippingErrors.city && (
                    <p className="text-red-500 text-xs mt-1">{shippingErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                    required
                  />
                  {shippingErrors.state && (
                    <p className="text-red-500 text-xs mt-1">{shippingErrors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                    required
                  />
                  {shippingErrors.pincode && (
                    <p className="text-red-500 text-xs mt-1">{shippingErrors.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
              <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                Country/Region
                <div className="mt-2 font-medium">India</div>
              </div>

              <div className="space-y-4 mb-4 border border-gray-200 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="billingOption"
                    checked={billingSameAsShipping}
                    onChange={() => {
                      setBillingSameAsShipping(true);
                      setBillingErrors({});
                    }}
                    className="w-4 h-4"
                  />
                  <span>Same as shipping address</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="billingOption"
                    checked={!billingSameAsShipping}
                    onChange={() => {
                      setBillingSameAsShipping(false);
                      setBillingErrors({});
                    }}
                    className="w-4 h-4"
                  />
                  <span>Use a different billing address</span>
                </label>
              </div>

              {!billingSameAsShipping && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={billingAddress.firstName}
                        onChange={handleBillingInputChange}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                        required
                      />
                      {billingErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={billingAddress.lastName}
                        onChange={handleBillingInputChange}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                        required
                      />
                      {billingErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={billingAddress.email}
                        onChange={handleBillingInputChange}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                        required
                      />
                      {billingErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={billingAddress.phone}
                        onChange={handleBillingInputChange}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                        required
                      />
                      {billingErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={billingAddress.address}
                      onChange={handleBillingInputChange}
                      placeholder="Street address"
                      className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                      required
                    />
                    {billingErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{billingErrors.address}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Apartment, suite, etc. (optional)</label>
                    <input
                      type="text"
                      name="apartment"
                      value={billingAddress.apartment}
                      onChange={handleBillingInputChange}
                      placeholder="Apartment, suite, unit"
                      className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={billingAddress.city}
                        onChange={handleBillingInputChange}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                        required
                      />
                      {billingErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={billingAddress.state}
                        onChange={handleBillingInputChange}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                        required
                      />
                      {billingErrors.state && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={billingAddress.pincode}
                        onChange={handleBillingInputChange}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                        required
                      />
                      {billingErrors.pincode && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.pincode}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="razorpay"
                    name="payment"
                    checked
                    readOnly
                    className="mr-3"
                  />
                  <label htmlFor="razorpay" className="flex items-center">
                    <span className="ml-2">Pay with Razorpay</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY (Fixed) */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.sku || item.id} className="flex gap-4">
                    <img src={item.image} className="w-16 h-20 object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-sm mt-1">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-medium">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="border-t pt-4 mb-4">
                <label className="block text-sm font-medium mb-2">Discount Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code"
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Apply
                  </button>
                </div>
                {discountError && (
                  <p className="text-red-500 text-xs mt-1">{discountError}</p>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-green-600">Discount applied: {discountCode.toUpperCase()}</span>
                    <button
                      onClick={handleRemoveDiscount}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString("en-IN")}`}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({discountCode.toUpperCase()})</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {shipping > 0 && (
                  <p className="text-xs text-gray-600">
                    Add ₹{(1000 - subtotal).toLocaleString("en-IN")} more for free shipping
                  </p>
                )}

                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-black text-white py-4 mt-6 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}