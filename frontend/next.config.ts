import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "metaspark-backend.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "https://metaspark-backend.onrender.com/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
