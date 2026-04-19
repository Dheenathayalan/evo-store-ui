"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

import { getLandingProducts } from "@/lib/api/products";

export default function Home() {
  const [sections, setSections] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingProducts = async () => {
      try {
        const res: any = await getLandingProducts(5);
        const products = res?.data ?? res;
        
        const mappedSections = products.map((product: any) => ({
          title: product.title,
          image: product.landing_thumbnail || product.images?.[0] || "/images/placeholder.jpg",
          link: `/products/${product.slug}`
        }));

        setSections([...mappedSections, { type: "footer" }]);
      } catch (err) {
        console.error("Failed to fetch landing products:", err);
        // Fallback or empty sections
        setSections([{ type: "footer" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingProducts();
  }, []);

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
    const isMobile = "ontouchstart" in window;

    // Wheel events only for desktop/web
    if (!isMobile) {
      window.addEventListener("wheel", handleScroll, { passive: true });
    }

    // Touch events only for mobile devices
    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart as EventListener, { passive: true });
      window.addEventListener("touchend", handleTouchEnd as EventListener, { passive: true });
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener("wheel", handleScroll);
      }
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouchStart as EventListener);
        window.removeEventListener("touchend", handleTouchEnd as EventListener);
      }
    };
  }, [current, sections]);

  useEffect(() => {
    document.body.classList.add("landing-no-scroll");

    return () => {
      document.body.classList.remove("landing-no-scroll");
    };
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-52px)] w-full flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <main className="relative h-[calc(100vh-52px)] w-full overflow-hidden">
      {/* Previous Section (stays below) */}
      {prev !== null && sections[prev] && (
        <div className="section z-10">
          <Slide section={sections[prev]} />
        </div>
      )}

      {/* Current Section (reveals on top) */}
      <div
        key={current + direction} // 🔥 ensures animation runs every time
        className={`section z-20 ${direction === "down" ? "reveal-from-bottom" : "reveal-from-top"
          }`}
      >
        {sections[current] && <Slide section={sections[current]} />}
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
    <div className="relative w-full h-full group">
      <img
        src={section.image}
        alt={section.title}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 transition-colors duration-500" />

      {/* Title - Bottom Left */}
      <div className="absolute bottom-16 left-8 sm:left-16 z-20 text-white">
        <p className="text-sm sm:text-base font-light tracking-[0.5em] uppercase">
          {section.title}
        </p>
      </div>

      {/* SHOP NOW - Center Bottom */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
        <Link
          href={section.link}
          className="border border-white/30 px-10 py-4 text-[10px] tracking-[0.4em] font-medium text-white/60 transition-all duration-300 hover:bg-white hover:text-black hover:border-white uppercase whitespace-nowrap"
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
}
