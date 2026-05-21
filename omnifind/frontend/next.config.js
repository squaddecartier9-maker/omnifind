/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['localhost','storage.googleapis.com'] },
  experimental: { serverComponentsExternalPackages: ['meilisearch'] },
}
module.exports = nextConfig
