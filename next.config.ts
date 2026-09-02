import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      // Production R2 custom domain (must match R2_PUBLIC_URL). next/image
      // refuses any host not listed here, so this and R2_PUBLIC_URL have to
      // be kept in step.
      {
        protocol: "https",
        hostname: "assets.movodream.com",
      },
      // r2.dev public dev URL — kept as a fallback for local/preview work.
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default nextConfig;
