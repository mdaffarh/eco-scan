/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Untuk TensorFlow.js
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
        pathname: "/uploads/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },

  // Enable compression
  compress: true,

  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["recharts", "lucide-react"],
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.{jpg,jpeg,png,gif,svg,ico,webp,avif}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
