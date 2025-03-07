import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'nextjs-ecom-delta.vercel.app', 'res.cloudinary.com'],
  },
};

export default nextConfig;
