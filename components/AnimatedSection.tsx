// components/AnimatedSection.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function AnimatedSection({ section, index }: any) {
  const { scrollY } = useScroll();

  const start = index * window.innerHeight;
  const end = start + window.innerHeight;

  const opacity = useTransform(
    scrollY,
    [start, start + 300, end - 300, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollY,
    [start, end],
    [100, -100]
  );

  return (
    <motion.section
      style={{ opacity, y }}
      className="fixed top-0 left-0 w-full h-screen"
    >
      {/* Background */}
      <img
        src={section.image}
        className="absolute w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Clickable */}
      <Link href={section.link} className="absolute inset-0 z-10" />

      {/* Text */}
      <div className="absolute bottom-10 left-10 text-white z-20">
        <p className="tracking-[3px] text-sm">
          {section.title}
        </p>
      </div>
    </motion.section>
  );
}
