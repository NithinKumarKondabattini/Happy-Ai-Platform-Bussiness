/** @type {import('next').NextConfig} */
const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

const nextConfig = {
  reactStrictMode: true,

  experimental: { workerThreads: true },

  // Avoid Windows EPERM build failures from spawning type-check/lint workers.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  async rewrites() {
    const base = backendBase.replace(/\/api\/?$/, "");
    return [{ source: "/api/:path*", destination: `${base}/api/:path*` }];
  },
};

module.exports = nextConfig;