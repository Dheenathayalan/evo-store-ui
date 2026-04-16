"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const blogCategories = [
  {
    title: "Latest fashion trends",
    description: "Explore the cutting-edge styles taking over the streets and runways this season.",
    image: "/images/blog-trends.jpg", // Placeholder logic
  },
  {
    title: "Styling guides",
    description: "Learn how to pair our urban collection with your existing wardrobe for maximum impact.",
    image: "/images/blog-style.jpg",
  },
  {
    title: "Seasonal collections",
    description: "A deep dive into the inspiration and craftsmanship behind our latest drops.",
    image: "/images/blog-collection.jpg",
  },
  {
    title: "Behind-the-scenes stories",
    description: "Meet the designers and see the process that brings EVO Carlton Trends to life.",
    image: "/images/blog-bts.jpg",
  }
];

export default function BlogsPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl sm:text-6xl font-light tracking-[0.3em] mb-8 uppercase">
            THE BLOG
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed tracking-wide font-light">
              Welcome to the EVO Carlton Trends Blog — your destination for style inspiration, 
              fashion insights, and lifestyle tips. Stay updated and inspired as we explore 
              the evolving world of fashion together.
            </p>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          {blogCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-white/5 mb-6 border border-white/10">
                {/* Image Placeholder with Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                  <span className="text-white/10 tracking-[0.5em] text-xs uppercase">Category Image</span>
                </div>
                
                {/* Top Right Label */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="text-[10px] tracking-[0.2em] uppercase border border-white/20 px-3 py-1 bg-black/40 backdrop-blur-sm">
                    {index === 0 ? "New" : "Explore"}
                  </span>
                </div>
              </div>

              <h3 className="text-xl tracking-[0.1em] font-light mb-3 group-hover:text-white transition-colors duration-300">
                {category.title.toUpperCase()}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed tracking-wide font-light mb-6">
                {category.description}
              </p>
              
              <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/40 group-hover:text-white transition-all duration-300">
                DISCOVER MORE <div className="h-[1px] w-8 bg-current transition-all duration-300 group-hover:w-12"/>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter / CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-32 p-12 sm:p-20 border border-white/10 bg-white/5 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-light tracking-[0.2em] mb-6 uppercase">
            Never Miss An Update
          </h2>
          <p className="text-gray-500 text-sm tracking-widest mb-10 uppercase">
            Subscribe to receive our latest stories directly in your inbox.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="bg-transparent border border-white/20 px-6 py-4 text-xs tracking-widest flex-1 outline-none focus:border-white transition"
            />
            <button className="bg-white text-black px-10 py-4 text-xs tracking-[0.2em] font-medium hover:bg-gray-200 transition duration-300">
              SUBSCRIBE
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
