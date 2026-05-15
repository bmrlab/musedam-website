import { type MetadataRoute } from 'next'
import getServerSideURL from '@/utilities/getServerSideURL'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  // Note: on global deploy, /zh-*/blog paths 301 to /en-US/blog (see middleware).
  // We intentionally do NOT Disallow them — Disallow would stop crawlers from
  // fetching the URL at all, so the 301 signal that consolidates ranking onto
  // the en-US URL would never be observed.
  return {
    rules: {
      userAgent: '*',
      allow: ['/'], // 允许访问图片所在的API子路径
      disallow: [
        '/admin/',
        // '/api/',
        '/musedam-apigw/',
        '/*/pricing/dam',
        '/*/pricing/ai',
        '/quotation/',
      ],
    },
    sitemap: `${getServerSideURL()}/sitemap.xml`,
  }
}
