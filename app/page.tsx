"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "URBAN STYLE",
    image: "/images/slide1.jpg",
    link: "/products/1",
  },
  {
    title: "MINIMAL WEAR",
    image: "/images/slide2.jpg",
    link: "/products/2",
  },
  {
    title: "PREMIUM LOOK",
    image: "/images/slide3.jpg",
    link: "/products/3",
  },
  {
    type: "footer", // 👈 special type
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down">("up");

  const isAnimating = useRef(false);
  const delta = useRef(0);
  const touchStartY = useRef(0);

  const THRESHOLD = 100;
  const DURATION = 1400;

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

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (isAnimating.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) < THRESHOLD) return;

    let newIndex = current;

    if (diff > 0 && current < sections.length - 1) {
      // Swiped up → scroll down
      newIndex = current + 1;
      setDirection("down");
    } else if (diff < 0 && current > 0) {
      // Swiped down → scroll up
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
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: true });
    
    // Enable touch events only on mobile devices
    if ("ontouchstart" in window) {
      window.addEventListener("touchstart", handleTouchStart as EventListener, { passive: true });
      window.addEventListener("touchend", handleTouchEnd as EventListener, { passive: true });
    }
    
    return () => {
      window.removeEventListener("wheel", handleScroll);
      if ("ontouchstart" in window) {
        window.removeEventListener("touchstart", handleTouchStart as EventListener);
        window.removeEventListener("touchend", handleTouchEnd as EventListener);
      }
    };
  }, [current]);

  useEffect(() => {
    document.body.classList.add("landing-no-scroll");

    return () => {
      document.body.classList.remove("landing-no-scroll");
    };
  }, []);

  return (
    <main className="relative h-[calc(100vh-52px)] w-full overflow-hidden">
      {/* Previous Section (stays below) */}
      {prev !== null && (
        <div className="section z-10">
          <Slide section={sections[prev]} />
        </div>
      )}

      {/* Current Section (reveals on top) */}
      <div
        key={current + direction} // 🔥 ensures animation runs every time
        className={`section z-20 ${
          direction === "down" ? "reveal-from-bottom" : "reveal-from-top"
        }`}
      >
        <Slide section={sections[current]} />
      </div>
    </main>
  );
}

function Slide({ section }: any) {
  // 👇 FOOTER SLIDE
  if (section.type === "footer") {
    return (
      <div className="w-full h-full bg-black flex flex-col justify-end">
        {/* <div className="w-full"> */}
        <Footer showLogoName={true} />
        {/* </div> */}
      </div>
    );
  }

  // 👇 NORMAL SLIDE
  return (
    <div className="relative w-full h-full">
      <img
        src={section.image}
        alt={section.title}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Clickable */}
      <Link href={section.link} className="absolute inset-0 z-10" />

      {/* Text */}
      <div className="absolute bottom-16 left-16 text-white z-20">
        <p style={{ letterSpacing: "4px" }}>{section.title}</p>
      </div>
    </div>
  );
}
