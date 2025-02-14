import { type MetadataRoute } from 'next'
import getServerSideURL from '@/utilities/getServerSideURL'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/musedam-apigw/'],
    },
    sitemap: `${getServerSideURL()}/sitemap.xml`,
  }
}
