/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Untuk TensorFlow.js
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Optimize images jika diperlukan
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
