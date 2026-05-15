import type { Metadata } from 'next'
import type { Page, Post } from '@/payload-types'

import getServerSideURL from './getServerSideURL'
import { mergeOpenGraph } from './mergeOpenGraph'

type GenerateMetaArgs = {
  doc: Page | Post | null
  /**
   * URL prefix between `/{lng}` and `/{slug}`. Use `'blog'` for posts,
   * `''` for top-level pages.
   */
  pathPrefix?: string
  /** Next.js locale segment, e.g. `'en-US'`, `'zh-CN'`. */
  lng?: string
  /** Set to `true` for blog posts so OG/Twitter are emitted as `article`. */
  isArticle?: boolean
}

const ogLocaleFor = (lng?: string): string | undefined => {
  if (!lng) return undefined
  if (lng === 'zh-CN' || lng === 'zh') return 'zh_CN'
  if (lng === 'zh-TW') return 'zh_TW'
  if (lng === 'en-US' || lng === 'en') return 'en_US'
  return undefined
}

export const generateMeta = async (args: GenerateMetaArgs): Promise<Metadata> => {
  const { doc, pathPrefix = '', lng, isArticle = false } = args || {}

  const baseUrl = getServerSideURL()
  const normalizeUrl = (u?: string) => {
    if (!u) return undefined
    return u.startsWith('http') ? u : `${baseUrl}${u.startsWith('/') ? '' : '/'}${u}`
  }
  const ogImage =
    typeof doc?.meta?.image === 'object' && doc.meta.image !== null && 'url' in doc.meta.image
      ? normalizeUrl((doc.meta.image as any).url as string)
      : undefined

  // CMS already appends ' | MuseDAM Website' via the SEO plugin's generateTitle.
  const title = doc?.meta?.title || 'MuseDAM Website'
  const description = doc?.meta?.description || ''

  // Build the canonical URL pointing at this specific document.
  // Falls back to baseUrl when slug/lng is missing.
  const slugSegment = Array.isArray(doc?.slug) ? doc?.slug.join('/') : (doc?.slug || '')
  const prefixSegment = pathPrefix ? `/${pathPrefix}` : ''
  const langSegment = lng ? `/${lng}` : ''
  const pagePath = slugSegment ? `${langSegment}${prefixSegment}/${slugSegment}` : langSegment
  const canonicalUrl = pagePath ? `${baseUrl}${pagePath}` : baseUrl

  // Article-specific OpenGraph fields (only meaningful for posts).
  const post = isArticle ? (doc as Post | null) : null
  const articleOg = post
    ? {
        type: 'article' as const,
        publishedTime: post.publishedAt || undefined,
        modifiedTime: post.updatedAt || post.publishedAt || undefined,
      }
    : {}

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: mergeOpenGraph({
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: canonicalUrl,
      locale: ogLocaleFor(lng),
      siteName: 'MuseDAM',
      ...articleOg,
    }),
    twitter: {
      images: ogImage ? [ogImage] : undefined,
      title,
      description,
      card: 'summary_large_image',
    },
  }
}
