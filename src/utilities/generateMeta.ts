import type { Metadata } from 'next'
import type { Page, Post } from '@/payload-types'

import getServerSideURL from './getServerSideURL'
import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: { doc: Page | Post }): Promise<Metadata> => {
  const { doc } = args || {}

  // 优先使用文档的 banner 图，并规范化为绝对地址
  const baseUrl = getServerSideURL()
  const normalizeUrl = (u?: string) => {
    if (!u) return undefined
    return u.startsWith('http') ? u : `${baseUrl}${u.startsWith('/') ? '' : '/'}${u}`
  }
  const ogImage =
    typeof doc?.meta?.image === 'object' && doc.meta.image !== null && 'url' in doc.meta.image
      ? normalizeUrl((doc.meta.image as any).url as string)
      : undefined

  const title = doc?.meta?.title ? doc?.meta?.title + ' | MuseDAM Website' : 'MuseDAM Website'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    twitter: {
      images: ogImage ? [ogImage] : undefined,
      title,
      description: doc?.meta?.description,
      card: 'summary_large_image',
    },
    title,
  }
}
