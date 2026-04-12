"use client";

import { useCart } from "@/store/cart";

export default function CartDrawer() {
  const { isOpen, closeCart, items, increaseQty, decreaseQty, isLoading } = useCart();

  const total = items.reduce(
    (acc: number, item: any) => acc + item.price * item.qty,
    0,
  );

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* DRAWER - Responsive width */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 transform transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h2 className="text-sm tracking-wide">CART ({items.length})</h2>

          <button onClick={closeCart} className="text-2xl leading-none">✕</button>
        </div>

        {/* FREE SHIPPING BAR */}
        {items.length > 0 && (
          <div className="px-4 sm:px-6 py-3 border-b text-xs">
            <p className="mb-2">
              Congratulations! Your order qualifies for free shipping
            </p>
            <div className="h-[3px] bg-gray-200">
              <div className="h-full w-full bg-red-500" />
            </div>
          </div>
        )}

        {/* ITEMS */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto h-[calc(100%-220px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Your cart is empty</p>
          ) : (
            items.map((item: any) => (
              <div key={item.sku || item.id} className="flex gap-4">
                <img src={item.image} className="w-20 h-24 object-cover flex-shrink-0" />

                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 text-xs">
                    {item.color} / {item.size}
                  </p>

                  {/* QTY */}
                  <div className="flex items-center gap-3 mt-3 border w-fit px-2 py-1">
                    <button onClick={() => decreaseQty(item.id)} className="cursor-pointer">−</button>

                    <span>{item.qty}</span>

                    <button onClick={() => increaseQty(item.id)} className="cursor-pointer">+</button>
                  </div>

                  <p className="mt-2">₹ {(item.price * item.qty).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full border-t p-4 sm:p-6 bg-white">
            <div className="flex justify-between mb-4 text-sm">
              <span>ORDER TOTAL</span>
              <span>₹ {total.toLocaleString("en-IN")}</span>
            </div>

            <button className="w-full bg-black text-white py-3 text-sm font-medium">CHECKOUT</button>

            <p className="text-xs text-gray-400 mt-2 text-center">
              Shipping charges will be displayed in checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
