"use client";

import { motion } from "framer-motion";

export default function ReplacementPolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.3em] mb-4 text-center uppercase">
            REPLACEMENT POLICY
          </h1>
          <p className="text-gray-500 text-sm tracking-[0.2em] mb-16 text-center uppercase">
            No Refund Policy – Replacement Only
          </p>

          <div className="space-y-16 text-gray-300 leading-relaxed tracking-wide font-light">
            <section className="text-center md:text-left">
              <p className="mb-6 text-lg text-white/90">
                Evo Carlton does not offer refunds. We only provide replacements under the conditions mentioned below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                1. Eligibility for Replacement
              </h2>
              <div className="space-y-8">
                <div>
                  <p className="text-sm opacity-80 mb-4">Replacement is applicable only in the following cases:</p>
                  <ul className="space-y-3 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li>Defective or damaged product received</li>
                    <li>Wrong product delivered</li>
                    <li>Size-related issues</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm opacity-80 mb-4 uppercase tracking-[0.2em]">Conditions:</p>
                  <ul className="space-y-3 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                    <li>Requests must be made within 7 days of receiving the product</li>
                    <li>Product must be unused, unwashed, and in original condition with tags intact</li>
                    <li>Digital products and gift cards (if any) are not eligible for replacement</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                2. Replacement Process
              </h2>
              <p className="text-sm opacity-80 mb-4">Contact us at <span className="text-white">customercare@evocarltontrends.com</span> with:</p>
              <ul className="space-y-3 text-sm opacity-70 list-none border-l border-white/20 pl-4 mb-6">
                <li>Order ID</li>
                <li>Clear images or videos showing the issue</li>
              </ul>
              <p className="text-sm opacity-80 mb-2">We will review your request and provide further instructions.</p>
              <p className="text-sm opacity-80">Once approved, the replacement will be processed within 7–10 business days, subject to stock availability.</p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                3. Important Notes
              </h2>
              <ul className="space-y-4 text-sm opacity-70 pl-0">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white shrink-0"/> No refunds, no cash returns, no store credits</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white shrink-0"/> Only one replacement per order is allowed</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white shrink-0"/> Minor color differences and measurement variations (1–2 cm) are not considered defects</li>
              </ul>
            </section>

            <section className="pt-16 border-t border-white/10">
              <h2 className="text-2xl text-white tracking-[0.15em] mb-10 uppercase">4. Contact Information</h2>
              <div className="bg-white/5 p-8 rounded-xl border border-white/5 space-y-6">
                <p className="opacity-80">For any replacement related queries, feel free to contact us:</p>
                <div>
                  <p className="text-xs text-white/40 tracking-widest uppercase mb-1">Email</p>
                  <p className="text-sm">customercare@evocarltontrends.com</p>
                </div>
              </div>
            </section>

            <div className="pt-20 text-center">
              <p className="text-[10px] text-white/20 tracking-[0.5em] uppercase">
                © 2026 EVO CARLTON TRENDS. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
