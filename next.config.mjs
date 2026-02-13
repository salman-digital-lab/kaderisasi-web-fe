/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nos.wjv-1.neo.id",
        port: "",
        pathname: "/kaderisasi-prod/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "nos.wjv-1.neo.id",
        port: "",
        pathname: "/kaderisasi-test/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
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
      "@tabler/icons-react",
    ],
  },
};

export default nextConfig;
