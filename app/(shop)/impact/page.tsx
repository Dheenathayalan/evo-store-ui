"use client";

import { motion } from "framer-motion";
import { Leaf, Recycle, Globe, Heart } from "lucide-react";

export default function ImpactPage() {
  const commitments = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Ethical sourcing",
      description: "We prioritize materials that are sourced responsibly, ensuring quality without compromise on environment or ethics."
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Reducing waste",
      description: "Implementing efficient production techniques to minimize our carbon footprint and reduce fabric waste at every stage."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Fair conditions",
      description: "Supporting safe and fair working conditions for everyone involved in the process of bringing our designs to life."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Mindful consumption",
      description: "Encouraging a move away from 'fast fashion' towards quality pieces that are built to last and tell a story."
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center mb-32"
        >
          <h1 className="text-4xl sm:text-6xl font-light tracking-[0.4em] mb-10 uppercase">
            IMPACT
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-400 text-lg leading-relaxed tracking-wide font-light italic">
              "At EVO Carlton Trends, we believe that fashion should have a positive impact."
            </p>
          </div>
        </motion.div>

        {/* Commitment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {commitments.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="p-10 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="text-white/20 mb-8 group-hover:text-white transition-colors duration-500">
                {item.icon}
              </div>
              <h3 className="text-xl tracking-[0.1em] font-light mb-4 uppercase">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed tracking-wide font-light">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Goal Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-32 p-12 sm:p-20 text-center border-t border-b border-white/10"
        >
          <p className="text-xl sm:text-2xl font-light tracking-wide leading-relaxed max-w-3xl mx-auto">
            Our goal is to continuously evolve into a more responsible and sustainable brand 
            while delivering the quality and style our customers love.
          </p>
        </motion.div>

        {/* Footer Note */}
        <div className="mt-20 text-center">
          <p className="text-xs text-white/30 tracking-[0.5em] uppercase">
            Every purchase you make supports our journey toward a better future.
          </p>
        </div>
      </div>
    </div>
  );
}
