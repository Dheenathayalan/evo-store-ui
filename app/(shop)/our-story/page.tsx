"use client";

import { motion } from "framer-motion";

export default function OurStoryPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl sm:text-6xl font-light tracking-[0.4em] mb-4 uppercase">
            OUR STORY
          </h1>
          <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase">
            EST. 2024
          </p>
        </motion.div>

        {/* Story Sections */}
        <div className="space-y-32">
          {/* Section 1 */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div className="relative aspect-[4/5] bg-white/5 border border-white/10 overflow-hidden">
               {/* Image Placeholder */}
               <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[8px] tracking-[1em] rotate-90 uppercase whitespace-nowrap">
                 VISION • EVOLUTION • STYLE
               </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-2xl font-light tracking-widest text-white/90">THE GENESIS</h2>
              <p className="text-gray-400 leading-loose tracking-wide font-light italic text-lg">
                "EVO Carlton Trends was born from a simple idea — to create a brand that blends modern evolution with timeless style."
              </p>
              <p className="text-gray-500 leading-relaxed font-light">
                We believe fashion is not just about clothing; it's about identity, confidence, and self-expression. 
                At EVO Carlton Trends, we focus on delivering high-quality, trend-forward designs that reflect both innovation and elegance.
              </p>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 md:order-1 space-y-8">
              <h2 className="text-2xl font-light tracking-widest text-white/90 uppercase">Our Journey</h2>
              <p className="text-gray-500 leading-relaxed font-light">
                Our journey started with a vision to bring premium styles at accessible prices. 
                Every product we offer is carefully curated to ensure it meets our standards of 
                comfort, durability, and style.
              </p>
              <p className="text-gray-500 leading-relaxed font-light">
                As we grow, we remain committed to evolving with our customers — because true 
                style never stands still. We don't just follow trends; we define them for the modern individual.
              </p>
            </div>
            <div className="order-1 md:order-2 relative aspect-[4/5] bg-white/5 border border-white/10 overflow-hidden">
               {/* Image Placeholder */}
               <div className="absolute inset-0 flex items-center justify-center text-white/5 text-[8px] tracking-[1em] -rotate-90 uppercase whitespace-nowrap">
                 CRAFTSMANSHIP • EXCELLENCE
               </div>
            </div>
          </motion.section>

          {/* Conclusion */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center pt-20"
          >
            <div className="h-[1px] w-20 bg-white/20 mx-auto mb-16" />
            <h3 className="text-2xl sm:text-4xl font-light tracking-[0.2em] mb-10 leading-snug">
              EVO Carlton Trends is more than a brand.<br/>
              <span className="text-white/40 italic">It's a lifestyle.</span>
            </h3>
            <div className="h-[1px] w-20 bg-white/20 mx-auto mt-16" />
          </motion.section>
        </div>
      </div>
    </div>
  );
}
