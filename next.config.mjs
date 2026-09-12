/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['rss-parser', '@atproto/api'],
  },
  async rewrites() {
    return [
      // radar-sonoro carga su CSS/JS/datos con URLs absolutas a GitHub Pages,
      // así que esto solo necesita servir el documento HTML en la ruta.
      {
        source: '/radarsonoro',
        destination: 'https://weareguid.github.io/radar-sonoro/',
      },
      {
        source: '/radarsonoro/:path*',
        destination: 'https://weareguid.github.io/radar-sonoro/:path*',
      },
    ];
  },
};

export default nextConfig;
