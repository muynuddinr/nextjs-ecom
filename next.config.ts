import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'nextjs-ecom-delta.vercel.app'],
  },
};

export default nextConfig;
