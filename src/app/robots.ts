import { type MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/musedam-apigw/'],
    },
    sitemap: `${process.env.SITE_SERVER_URL}/sitemap.xml`,
  }
}
