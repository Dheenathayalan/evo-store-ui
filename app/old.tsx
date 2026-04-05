"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const sections = [
  { title: "URBAN STYLE", image: "/images/slide1.jpg", link: "/products/1" },
  { title: "MINIMAL WEAR", image: "/images/slide2.jpg", link: "/products/2" },
  { title: "PREMIUM LOOK", image: "/images/slide3.jpg", link: "/products/3" },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down">("down");

  const isAnimating = useRef(false);
  const delta = useRef(0);

  const THRESHOLD = 100;
  const DURATION = 800;

  const handleScroll = (e: WheelEvent) => {
    if (isAnimating.current) return;

    delta.current += e.deltaY;

    if (Math.abs(delta.current) < THRESHOLD) return;

    let newIndex = current;

    if (delta.current > 0 && current < sections.length - 1) {
      newIndex = current + 1;
      setDirection("down");
    } else if (delta.current < 0 && current > 0) {
      newIndex = current - 1;
      setDirection("up");
    }

    if (newIndex !== current) {
      isAnimating.current = true;
      setPrev(current);
      setCurrent(newIndex);

      setTimeout(() => {
        setPrev(null);
        isAnimating.current = false;
      }, DURATION);
    }

    delta.current = 0;
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: true });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [current]);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      {/* Previous */}
      {prev !== null && (
        <div className="section z-10">
          <Slide section={sections[prev]} />
        </div>
      )}

      {/* Current */}
      <div
        key={current}
        className={`section z-20 ${
          direction === "down" ? "slide-up" : "slide-down"
        }`}
      >
        <Slide section={sections[current]} />
      </div>
    </main>
  );
}

function Slide({ section }: any) {
  return (
    <div className="relative w-full h-full">
      <img src={section.image} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30" />
      <Link href={section.link} className="absolute inset-0 z-10" />
      <div className="absolute bottom-16 left-16 text-white z-20">
        <p className="tracking-[4px] text-sm">{section.title}</p>
      </div>
    </div>
  );
}
