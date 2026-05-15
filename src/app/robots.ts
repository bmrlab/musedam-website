import { type MetadataRoute } from 'next'
import getServerSideURL from '@/utilities/getServerSideURL'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'

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
        // Global deploy is English-only — block crawlers from indexing zh paths.
        ...(isGlobal ? ['/zh-CN/', '/zh-TW/'] : []),
      ],
    },
    sitemap: `${getServerSideURL()}/sitemap.xml`,
  }
}
