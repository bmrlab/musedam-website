import { type MetadataRoute } from 'next'
import getServerSideURL from '@/utilities/getServerSideURL'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/musedam-apigw/', '/*/pricing/dam', '/*/pricing/ai'],
    },
    sitemap: `${getServerSideURL()}/sitemap.xml`,
  }
}
