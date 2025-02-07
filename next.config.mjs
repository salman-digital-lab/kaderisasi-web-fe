/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minio.nzcodenplay.xyz',
        port: '',
        pathname: '/kaderisasi-test/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'nos.wjv-1.neo.id',
        port: '',
        pathname: '/kaderisasi-prod/**',
        search: '',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/dates",
      "@mantine/form",
      "@mantine/carousel",
      "@mantine/notifications",
    ],
  },
};

export default nextConfig;
