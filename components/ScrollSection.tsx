// components/ScrollSection.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function ScrollSection({ section, index }: any) {
  const { scrollYProgress } = useScroll();

  const start = index * 0.33;
  const end = start + 0.33;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.1, end - 0.1, end],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [start, end],
    [1.1, 1]
  );

  return (
    <motion.section
      style={{ opacity, scale }}
      className="fixed top-0 left-0 w-full h-screen"
    >
      {/* Image */}
      <img
        src={section.image}
        className="w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Click */}
      <Link href={section.link} className="absolute inset-0 z-10" />

      {/* Text */}
      <div className="absolute bottom-16 left-16 text-white z-20">
        <p className="tracking-[4px] text-sm">{section.title}</p>
      </div>
    </motion.section>
  );
}
