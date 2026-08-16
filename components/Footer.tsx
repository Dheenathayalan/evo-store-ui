// components/Footer.tsx
import Link from "next/link";

export default function Footer(props: any) {
  const { showLogoName = false } = props;

  return (
    <footer className="h-full bg-black text-white px-6 md:px-12 py-16">
      {/* TOP SECTION */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT SIDE */}
        <div className="flex flex-col">
          {/* Logo */}
          <div className="text-red-600 text-3xl font-bold mb-4">
            <img
              src={"/icons/logo_icon.svg"}
              alt="EVO Carlton Trends"
              className="!w-[60px]"
            />
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 mt-0 text-xl">
            <span className="cursor-pointer">◎</span>
            <span className="cursor-pointer">f</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="grid grid-cols-2 gap-10 text-sm">
          <div className="space-y-3 text-gray-300">
            <p>
              <Link href="/our-story" className="hover:text-white transition-colors">OUR STORY</Link>
            </p>
            <p>
              <Link href="/impact" className="hover:text-white transition-colors">IMPACT</Link>
            </p>
            <p>
              <Link href="/blogs" className="hover:text-white transition-colors">BLOGS</Link>
            </p>
            <p>
              <Link href="/faqs" className="hover:text-white transition-colors">FAQS</Link>
            </p>
            <p>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            </p>
          </div>

          <div className="space-y-3 text-gray-300">
            <p>
              <Link href="/replacement-policy" className="hover:text-white transition-colors">REPLACEMENT</Link>
            </p>
            <p>
              <Link href="/terms" className="hover:text-white transition-colors">TERMS</Link>
            </p>
            <p>
              <Link href="/shipping-policy" className="hover:text-white transition-colors">SHIPPING</Link>
            </p>
            <p>
              <Link href="/contact-us" className="hover:text-white transition-colors">CONTACT US</Link>
            </p>
          </div>
        </div>
      </div>
      {showLogoName && (
        <img
          src={"/icons/logo.svg"}
          alt="EVO Carlton Trends"
          className="mx-auto mt-10 !object-contain"
        />
      )}
    </footer>
  );
}
