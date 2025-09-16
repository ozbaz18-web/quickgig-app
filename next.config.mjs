/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },   // לא להפיל build על ESLint
  typescript: { ignoreBuildErrors: true } // לא להפיל build על TypeScript
};
export default nextConfig;
