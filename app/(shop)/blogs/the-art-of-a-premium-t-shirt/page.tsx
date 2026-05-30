"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PremiumTShirtBlogPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-black text-white px-8 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition group mb-10"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition" />
            <span className="text-[10px] tracking-[0.3em] uppercase">Back to Blogs</span>
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.1em] mb-8 leading-tight"
          >
            The Art of a Premium T-Shirt
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-4 text-xs tracking-[0.2em] text-white/50 uppercase"
          >
            <span>EVO Carlton Trends</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>Behind The Scenes</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed"
        >
          <p className="text-xl leading-relaxed text-gray-800 mb-12">
            A t-shirt may look simple, but creating a truly premium one takes attention to every detail — from the fabric selection to the finishing process. At our brand, we focus on quality-driven craftsmanship to deliver everyday essentials that feel comfortable, look refined, and last longer. Every t-shirt we create is built using carefully selected materials and advanced fabric treatments that elevate both comfort and durability.
          </p>

          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-semibold tracking-wide text-black mb-4">Premium 200–220 GSM Combed Cotton</h2>
              <p className="mb-4">
                The foundation of our t-shirts starts with 200–220 GSM combed cotton — a heavyweight premium fabric designed for superior comfort and structure.
              </p>
              <p className="mb-4">Combed cotton is processed to remove shorter fibers and impurities, resulting in:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 marker:text-black">
                <li>A smoother texture</li>
                <li>Enhanced softness</li>
                <li>Better durability</li>
                <li>Reduced pilling</li>
              </ul>
              <p>
                The 200–220 GSM weight gives the fabric a rich, structured feel while remaining breathable enough for everyday wear.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-wide text-black mb-4">Bio Wash for Everyday Comfort</h2>
              <p className="mb-4">
                To improve softness and create a cleaner fabric surface, every t-shirt goes through a bio wash process.
              </p>
              <p className="mb-4">This treatment helps:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 marker:text-black">
                <li>Soften the fabric naturally</li>
                <li>Remove excess fibers</li>
                <li>Improve overall comfort</li>
                <li>Create a smoother finish</li>
              </ul>
              <p>
                The result is a t-shirt that feels soft from the very first wear.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-wide text-black mb-4">Enzyme Wash for a Refined Finish</h2>
              <p className="mb-4">
                Our t-shirts are further enhanced with an enzyme wash, a premium finishing process that improves the texture and feel of the fabric.
              </p>
              <p className="mb-4">Benefits of enzyme washing include:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 marker:text-black">
                <li>A cleaner surface finish</li>
                <li>Reduced fuzziness</li>
                <li>Improved fabric appearance</li>
                <li>Long-lasting softness</li>
              </ul>
              <p>
                This process gives the fabric a refined, premium-quality touch while helping it maintain its look over time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-wide text-black mb-4">Silicon Wash Before Print</h2>
              <p className="mb-4">
                Before the printing process, the fabric undergoes a silicon wash to create an ultra-smooth and luxurious hand feel.
              </p>
              <p className="mb-4">This treatment adds:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 marker:text-black">
                <li>A silky-soft texture</li>
                <li>Better fabric flow</li>
                <li>Enhanced comfort</li>
                <li>A premium finish</li>
              </ul>
              <p>
                It also helps improve the overall feel of the final garment while maintaining print quality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-wide text-black mb-4">Pre-Shrunk Fabric for Consistent Fit</h2>
              <p className="mb-4">
                A premium t-shirt should maintain its shape and fit even after repeated washes. That’s why we use pre-shrunk fabric, minimizing shrinkage and ensuring better sizing consistency over time.
              </p>
              <p className="mb-4">This means:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 marker:text-black">
                <li>Reliable fit retention</li>
                <li>Better shape stability</li>
                <li>Long-term wearability</li>
              </ul>
              <p className="italic text-black font-medium">Because comfort should stay consistent.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-wide text-black mb-4">Double Stitch Construction</h2>
              <p className="mb-4">
                Durability is built into every detail. Our t-shirts feature double-stitched seams for added strength and long-lasting performance. This construction method reinforces key areas of the garment, helping it withstand regular wear while maintaining structure and comfort.
              </p>
              <p className="font-medium text-black">Strong stitching means a t-shirt that’s made to last.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-wide text-black mb-4">Clean Minimal Branding</h2>
              <p className="mb-4">
                We believe premium style is timeless. That’s why our approach focuses on clean minimal branding — subtle, versatile designs that allow the quality of the garment to stand out naturally.
              </p>
              <p>
                Minimal aesthetics make our t-shirts easy to style, comfortable to wear, and suitable for every occasion.
              </p>
            </section>

            <section className="bg-gray-100 p-8 rounded-2xl border border-gray-200 mt-12">
              <h2 className="text-2xl font-semibold tracking-wide text-black mb-4">Built for Everyday Essentials</h2>
              <p className="mb-6">
                Every step in our process is designed with one goal in mind: creating premium everyday t-shirts that combine comfort, durability, and simplicity.
              </p>
              <ul className="space-y-3 font-medium text-black">
                <li className="flex items-center gap-3"><span className="text-green-600">✔</span> 200–220 GSM combed cotton</li>
                <li className="flex items-center gap-3"><span className="text-green-600">✔</span> Bio wash</li>
                <li className="flex items-center gap-3"><span className="text-green-600">✔</span> Enzyme wash</li>
                <li className="flex items-center gap-3"><span className="text-green-600">✔</span> Silicon wash (before print)</li>
                <li className="flex items-center gap-3"><span className="text-green-600">✔</span> Pre-shrunk fabric</li>
                <li className="flex items-center gap-3"><span className="text-green-600">✔</span> Double stitch construction</li>
                <li className="flex items-center gap-3"><span className="text-green-600">✔</span> Clean minimal branding</li>
              </ul>
              <p className="mt-8 text-xl font-bold italic tracking-wide text-black">
                Because great basics are never basic.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
