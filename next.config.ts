
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/trip_ready",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
