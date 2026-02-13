/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Images configuration - using remotePatterns (domains is deprecated)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Empty turbopack config to silence warnings
  turbopack: {},
  
  // Optional: Add experimental features if needed
  experimental: {
    // turbo: {}, // Alternative way to configure turbopack
  },
}

module.exports = nextConfig
