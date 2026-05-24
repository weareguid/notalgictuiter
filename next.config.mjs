/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['rss-parser', '@atproto/api'],
  },
};

export default nextConfig;
