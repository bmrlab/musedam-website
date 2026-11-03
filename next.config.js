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
  poweredByHeader: false,
  async headers() {
    const pageHeaders = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      {
        key: 'Content-Security-Policy',
        // Keep Next.js scripts and third-party integrations working during the initial rollout.
        // Same-origin framing preserves Payload's live preview.
        value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'",
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ]

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      { source: '/', headers: pageHeaders },
      // Scope embedding and device restrictions to website pages, leaving API and demo proxies alone.
      { source: '/:lng(en-US|zh-CN|zh-TW)/:path*', headers: pageHeaders },
    ]
  },
  // "Part terminated early due to unexpected end of multipart data"
  experimental: {
    proxyClientMaxBodySize: '64mb',
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Should not use this in production
  ...(process.env.NODE_ENV === 'production'
    ? {}
    : {
        images: {
          remotePatterns: [
            ...['http://localhost:3000', 'https://www.musedam.cc'].map((item) => {
              const url = new URL(item)
              return {
                hostname: url.hostname,
                protocol: url.protocol.replace(':', ''),
              }
            }),
          ],
        },
      }),
  // assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
  reactStrictMode: true,
  redirects,
}

export default withPayload(withMDX(nextConfig))
