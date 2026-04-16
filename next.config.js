/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
