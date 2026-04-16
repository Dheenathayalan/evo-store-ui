"use client";

import { motion } from "framer-motion";
import { Truck, Clock, MapPin, Search } from "lucide-react";

export default function ShippingPolicyPage() {
  const shippingSteps = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Processing",
      time: "1–3 Business Days",
      description: "Once your order is placed, our team carefully prepares and packs your items for shipment."
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Delivery",
      time: "5–10 Business Days",
      description: "Regional transit times vary by location. We work with premium carriers to ensure safe delivery."
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
            SHIPPING POLICY
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Global delivery, premium care
          </p>
        </motion.div>

        <div className="space-y-24">
          {/* Main Statement */}
          <section className="text-center max-w-2xl mx-auto">
             <p className="text-lg tracking-wide font-light text-white/90 leading-relaxed italic">
               "We aim to deliver your orders quickly and safely, so you can start wearing your EVO Carlton Trends collection as soon as possible."
             </p>
          </section>

          {/* Timeline Grid */}
          <section className="grid md:grid-cols-2 gap-8">
            {shippingSteps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 border border-white/10 bg-white/5 hover:bg-white/10 transition group"
              >
                <div className="text-white/30 group-hover:text-white transition-colors duration-500 mb-8">
                  {step.icon}
                </div>
                <h3 className="text-sm tracking-[0.2em] uppercase text-white/40 mb-2">{step.title}</h3>
                <h4 className="text-xl tracking-widest mb-4 font-light">{step.time}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-light">{step.description}</p>
              </motion.div>
            ))}
          </section>

          {/* Additional Details */}
          <section className="grid md:grid-cols-2 gap-12 pt-16 border-t border-white/10">
            <div className="space-y-6">
              <h3 className="text-lg tracking-widest uppercase text-white/90 flex items-center gap-3">
                <MapPin size={18} className="text-white/40" />
                Shipping Charges
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                Shipping charges are calculated at checkout and may vary based on your location and the size of your order. 
                We offer free shipping on orders above a certain threshold (refer to the banner on our home page).
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg tracking-widest uppercase text-white/90 flex items-center gap-3">
                <Search size={18} className="text-white/40" />
                Order Tracking
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                You will receive a confirmation email with complete tracking details once your order is dispatched. 
                Keep an eye on your inbox to track your shipment's journey to your doorstep.
              </p>
            </div>
          </section>

          {/* Note Section */}
          <div className="p-8 bg-white/5 border border-white/5 text-center">
            <p className="text-xs text-white/60 leading-relaxed font-light italic max-w-xl mx-auto">
              Please note: Internal shipping delays may occur due to extreme weather, public holidays, or other external factors beyond our control. We appreciate your patience.
            </p>
          </div>
        </div>

        <div className="mt-24 text-center">
            <p className="text-[10px] text-white/20 tracking-[0.5em] uppercase">
              EVO CARLTON TRENDS • LOGISTICS
            </p>
        </div>
      </div>
    </div>
  );
}
