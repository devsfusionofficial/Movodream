import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['sharp'],
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
  async headers() {
    // Static files under /public (logos, icons, section photos, uploaded
    // media) are served with no cache-control by default on some hosts, so a
    // stale/expired edge cache forces a full re-fetch from the origin on the
    // next visit. These paths are either build-committed assets or
    // randomUUID-named uploads (see src/lib/r2.ts), so the URL never gets
    // reused for different content — safe to cache as immutable for a year.
    return [
      // Build output (JS/CSS chunks, fonts) is fetched by Googlebot for
      // rendering and shows up in Search Console as "Crawled - currently not
      // indexed". These are not pages, so tell Google not to index them. Do NOT
      // block them in robots.txt: Google must still be able to fetch them to
      // render the site. X-Robots-Tag: noindex leaves fetching untouched.
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      // 3D model binaries (e.g. /assets/model/iphone16pro.glb) are also
      // reported as "Crawled - currently not indexed"; same treatment.
      {
        source: '/assets/model/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
