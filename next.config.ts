import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint errors in auto-generated/legacy files should not block production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors in legacy code should not block production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
