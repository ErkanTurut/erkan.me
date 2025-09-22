import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
