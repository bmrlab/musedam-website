export const getPageMetadata = ({
  title,
  description,
  url,
}: {
  title: string
  description: string
  url?: string
}) => {
  const baseUrl = 'https://www.musedam.cc'
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      type: 'website',
      description: description,
      url: url ? `${baseUrl}/${url}` : baseUrl,
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
  }
}
