"use client";

import { motion } from "framer-motion";
import { RefreshCcw, Package, ShieldCheck, Mail } from "lucide-react";

export default function ReturnPolicyPage() {
  const points = [
    {
      icon: <RefreshCcw className="w-5 h-5" />,
      text: "Returns are accepted within 7 days of delivery"
    },
    {
      icon: <Package className="w-5 h-5" />,
      text: "Items must be unused, unwashed, and in original packaging"
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "Refunds will be processed after a successful quality check"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.3em] mb-6 uppercase">
            RETURN POLICY
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Hassle-free returns for your peace of mind
          </p>
        </motion.div>

        <div className="space-y-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="p-10 border border-white/10 bg-white/5 space-y-8"
          >
            <p className="text-lg tracking-wide font-light text-center sm:text-left">
              We offer a hassle-free return policy to ensure you are completely satisfied with your purchase.
            </p>
            
            <div className="grid gap-6">
              {points.map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-4 border border-white/5 hover:border-white/20 transition">
                  <div className="text-white/40 shrink-0">{item.icon}</div>
                  <p className="text-sm font-light tracking-wide text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-12"
          >
            <div className="space-y-6">
              <h3 className="text-lg tracking-widest uppercase text-white/90 flex items-center gap-3">
                <Mail size={18} className="text-white/40" />
                How to Initiate
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                To initiate a return, please contact our support team with your order details and reason for return. 
                Our team will guide you through the next steps and provide the return address.
              </p>
              <a 
                href="/contact-us" 
                className="inline-block text-[10px] tracking-[0.3em] border-b border-white pb-1 hover:text-gray-400 hover:border-gray-400 transition uppercase"
              >
                Contact Support
              </a>
            </div>

            <div className="p-8 bg-white/5 border border-white/5">
              <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">Important Note</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light italic">
                Certain items may not be eligible for return due to hygiene or clearance reasons. 
                Please ensure the security tag remains intact on eligible apparel.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 text-center">
            <p className="text-[10px] text-white/20 tracking-[0.5em] uppercase">
              EVO CARLTON TRENDS • CUSTOMER CARE
            </p>
        </div>
      </div>
    </div>
  );
}
