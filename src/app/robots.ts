import { type MetadataRoute } from 'next'
import getServerSideURL from '@/utilities/getServerSideURL'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
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
