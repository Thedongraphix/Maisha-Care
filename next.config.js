/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'i.pinimg.com', 'images.pexels.com'],
    /**remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      }
    ],
    */
  },
  // Remove rewrites as we're handling proxying in our API route
};

module.exports = nextConfig;