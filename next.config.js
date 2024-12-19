import withMDXRaw from '@next/mdx'
import { withPayload } from '@payloadcms/next/withPayload'
import remarkGfm from 'remark-gfm'

import redirects from './redirects.js'

const withMDX = withMDXRaw({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Should not use this in production
  // images: {
  //   remotePatterns: [
  //     ...['http://localhost:3000', 'https://www.musedam.cc'].map((item) => {
  //       const url = new URL(item)
  //       return {
  //         hostname: url.hostname,
  //         protocol: url.protocol.replace(':', ''),
  //       }
  //     }),
  //   ],
  // },
  // assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
  reactStrictMode: true,
  redirects,
}

export default withPayload(withMDX(nextConfig))
