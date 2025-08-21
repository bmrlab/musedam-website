export const getPageMetadata = ({
  title,
  description,
  url,
  lng,
}: {
  title: string
  description: string
  url?: string
  lng: string
}) => {
  const baseUrl = process.env.SITE_SERVER_URL || 'https://www.musedam.cc'
  const pageUrl = url ? `${baseUrl}/${lng}/${url}` : `${baseUrl}/${lng}`
  const locale = lng === 'zh-CN' ? 'zh-CN' : lng === 'en-US' ? 'en-US' : undefined
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      type: 'website',
      locale: locale,
      description: description,
      url: pageUrl,
      images: [
        {
          url: '/assets/banner.png',
        },
      ],
    },
    twitter: {
      site: '@MuseDam_Tezign',
      title: title,
      description: description,
      images: ['/assets/banner.png'],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'zh-CN': url ? `${baseUrl}/zh-CN/${url}` : `${baseUrl}/zh-CN`,
        'en-US': url ? `${baseUrl}/en-US/${url}` : `${baseUrl}/en-US`
      }
    }
  }
}
