/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ❌ Don't run ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
      // You can add other trusted domains here as well
      // For example, if you use images from unsplash:
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
    ],
  },
};

module.exports = nextConfig;
