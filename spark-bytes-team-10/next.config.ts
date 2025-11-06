import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*'
      }
    ];
  },
  // Add this to ensure auth callbacks work properly
  async redirects() {
    return [];
  }
};

export default nextConfig;
