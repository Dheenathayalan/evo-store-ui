"use client";

import { motion } from "framer-motion";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.3em] mb-4 text-center uppercase">
            SHIPPING POLICY
          </h1>
          <p className="text-gray-500 text-sm tracking-[0.2em] mb-16 text-center uppercase">
            Last updated: January 28, 2025
          </p>

          <div className="space-y-16 text-gray-300 leading-relaxed tracking-wide font-light">
            
            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                1. Shipping Timeframes
              </h2>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Orders are processed within 2–3 business days after confirmation</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Domestic (India) delivery: 5–10 business days</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> International delivery: 10–20 business days, depending on destination and customs clearance</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Delivery timelines are estimates and may vary due to external factors</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                2. Shipping Charges
              </h2>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Shipping charges are calculated at checkout based on delivery location</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Free shipping may be offered on orders above a specified value (as mentioned on the website)</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> For international orders, customs duties, import taxes, or additional charges (if any) must be borne by the customer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                3. Tracking & Delivery
              </h2>
              <p className="text-sm opacity-80 mb-6">Once your order is shipped, tracking details will be shared via email.</p>
              
              <div className="mb-6">
                <p className="text-sm opacity-80 mb-3">EVO Carlton Trends is not responsible for delays caused by:</p>
                <ul className="space-y-2 text-sm opacity-70 list-disc pl-6 marker:text-white/40">
                  <li>Weather conditions</li>
                  <li>Customs clearance</li>
                  <li>Courier or logistics issues</li>
                </ul>
              </div>
              
              <p className="text-sm opacity-80">
                If your order is delayed, damaged, or appears lost, please contact us at <span className="text-white">EVO Carlton Trendsstore@gmail.com</span>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                4. Shipping Partners
              </h2>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> We work with trusted third-party courier partners to ensure safe and timely delivery</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Customers are advised to check package condition at the time of delivery</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Any visible damage or tampering should be reported immediately to the delivery agent and to our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-white tracking-[0.15em] mb-8 uppercase border-b border-white/10 pb-4">
                5. Important Note
              </h2>
              <ul className="space-y-4 text-sm opacity-70 list-none border-l border-white/20 pl-4">
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> Incorrect or incomplete address details may lead to delivery delays or non-delivery</li>
                <li className="flex items-baseline gap-3"><div className="w-1 h-1 bg-white/50 shrink-0"/> EVO Carlton Trends will not be responsible for orders delayed or lost due to incorrect customer information</li>
              </ul>
            </section>

            <section className="pt-16 border-t border-white/10">
              <h2 className="text-2xl text-white tracking-[0.15em] mb-10 uppercase">6. Contact Information</h2>
              <div className="bg-white/5 p-8 rounded-xl border border-white/5 space-y-6">
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
