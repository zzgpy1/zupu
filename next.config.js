/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    domains: ['localhost'],
  },
  // Cloudflare Workers 部署需要
  output: 'standalone',
};

module.exports = nextConfig;
