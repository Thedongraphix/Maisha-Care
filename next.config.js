/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'i.pinimg.com', 'images.pexels.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      }
    ],
  },
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error', 'warn'] } 
      : false,
  },
  // Caching settings
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  // Configure production builds
  productionBrowserSourceMaps: false,
  // Disable x-powered-by header
  poweredByHeader: false,
  experimental: {
    // Enable server-side rendering (SSR) caching
    serverComponentsExternalPackages: [],
    // Disable optimizeCss to avoid critters issues
    optimizeCss: false,
  },
  // For production builds, ignore TypeScript errors
  typescript: {
    // !! WARN !!
    // Ignoring TypeScript errors for production build
    // This should only be enabled for deployment, not during development
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  // For production builds, ignore ESLint warnings
  eslint: {
    // !! WARN !!
    // Ignoring ESLint errors for production build
    // This should only be enabled for deployment, not during development
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;