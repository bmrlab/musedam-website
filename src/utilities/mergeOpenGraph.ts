import type { Metadata } from 'next'

import getServerSideURL from './getServerSideURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'MuseDAM',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'MuseDAM',
  title: 'MuseDAM',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
