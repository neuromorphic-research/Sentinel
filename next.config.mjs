/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Type safety is enforced by `tsc --noEmit`; don't let lint style rules block
  // production builds.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
