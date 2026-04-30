import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com"],
  },
  async redirects() {
    return [
      {
        source: '/support',
        destination: '/contact-us',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
