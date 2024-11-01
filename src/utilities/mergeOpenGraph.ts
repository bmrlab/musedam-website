import type { Metadata } from 'next'

// TODO: Update the defaultOpenGraph object with your own values
const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Creative Asset Cloud · Team Collaboration · AIGC',
  images: [
    {
      url: process.env.NEXT_PUBLIC_SERVER_URL
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/website-template-OG.webp`
        : '/website-template-OG.webp',
    },
  ],
  siteName: 'MuseDAM Website',
  title: 'MuseDAM Website',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
