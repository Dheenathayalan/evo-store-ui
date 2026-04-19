"use client";

import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isOpen, closeCart, items, increaseQty, decreaseQty, removeItem, isLoading, isRemovingFromCart } = useCart();
  const router = useRouter();

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
                {item.image && !item.image.includes("placeholder") ? (
                  <img src={item.image} className="w-20 h-24 object-cover flex-shrink-0 bg-gray-50" />
                ) : (
                  <div className="w-20 h-24 flex-shrink-0 bg-gray-100 flex flex-col items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[9px] text-gray-300 uppercase tracking-wider">No Image</span>
                  </div>
                )}

                <div className="flex-1 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-snug">{item.name}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isRemovingFromCart}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5 disabled:opacity-40"
                      title="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {item.color} / {item.size}
                  </p>

                  {/* QTY */}
                  <div className="flex items-center gap-3 mt-3 border w-fit px-2 py-1">
                    <button 
                      onClick={() => decreaseQty(item.id)} 
                      disabled={isRemovingFromCart}
                      className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRemovingFromCart ? (
                        <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "−"
                      )}
                    </button>

                    <span>{item.qty}</span>

                    <button 
                      onClick={() => increaseQty(item.id)}
                      className="cursor-pointer"
                    >+</button>
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

            <button 
              onClick={() => {
                closeCart();
                router.push('/checkout');
              }}
              className="w-full bg-black text-white py-3 text-sm font-medium"
            >
              CHECKOUT
            </button>

            <p className="text-xs text-gray-400 mt-2 text-center">
              Shipping charges will be displayed in checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
