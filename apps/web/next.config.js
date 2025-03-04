/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@myira/portfolio-service'],
  swcMinify: true,
};

module.exports = nextConfig; 