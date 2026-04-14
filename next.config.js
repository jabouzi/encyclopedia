/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nozbe/watermelondb'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // WatermelonDB is client-only
      config.externals = [...(config.externals || []), '@nozbe/watermelondb']
    }
    return config
  },
}

module.exports = nextConfig
