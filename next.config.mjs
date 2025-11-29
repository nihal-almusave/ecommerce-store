/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mongodb.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig

