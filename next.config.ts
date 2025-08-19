import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // If you later use next/image with remote URLs, add allowed patterns here.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.notion.so",
        pathname: "/image/attachment",
      },
    ],
  },
};

export default nextConfig;
