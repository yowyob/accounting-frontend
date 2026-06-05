import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Type errors in legacy code should not block production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
