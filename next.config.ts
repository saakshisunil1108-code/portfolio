import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"]
  },
  webpack(config) {
    config.resolve.alias.canvas = false;
    return config;
  }
};

export default nextConfig;
