/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['kuromoji', 'better-sqlite3'],
  },
};

export default nextConfig;
