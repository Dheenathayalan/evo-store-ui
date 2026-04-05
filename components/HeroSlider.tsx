// app/page.tsx

import Link from "next/link";

const sections = [
  {
    title: "PIQUÉ POLO SHIRT",
    image: "https://images.unsplash.com/photo-1520975922284-9c2f1c3e2f2c",
    link: "/products/navarasa-tee",
  },
  {
    title: "COTTON TEE",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c",
    link: "/products/cotton-tee",
  },
  {
    title: "HENLEY",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    link: "/products/henley",
  },
];

export default function Home() {
  return (
    <main className="snap-y snap-mandatory">
      {sections.map((section, i) => (
        <section key={i} className="relative h-screen snap-start">
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
            <p className="text-sm tracking-[3px]">{section.title}</p>
          </div>
        </section>
      ))}
    </main>
  );
}
