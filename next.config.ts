import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Only the portfolio's own processed images can be optimized.
    localPatterns: [{ pathname: "/images/**", search: "" }],
    formats: ["image/avif", "image/webp"],
    // No image on the site shows wider than about 1400px; shorter srcset lists keep the HTML small.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 192, 384],
    qualities: [75],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
