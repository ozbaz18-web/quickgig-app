// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // לא להריץ ESLint בזמן build ב-Vercel
  },
};

export default nextConfig;
 