import React from 'react'
import { SchemaOrg } from './SchemaOrg'

// Head-level SEO tags (title, meta description, canonical, og:*, twitter:*, robots,
// article:* timestamps) are emitted by `generateMetadata` via Next.js's metadata API.
// This component only renders body-level structured data (JSON-LD), which is the one
// SEO concern the metadata API cannot express.

interface BlogSEOProps {
    /** Absolute or root-relative URL of the article. */
    url: string
    /** Article title without the site suffix. */
    title: string
    /** Locale tag, e.g. `'en-US'`, `'zh-CN'`. */
    lng: string
    /** Banner image used by both OG and JSON-LD. Absolute or root-relative. */
    image?: string
    /** Optional override for the social-share image (falls back to `image`). */
    socialImage?: string
    /** Article-specific data; omit on non-article pages. */
    articleData?: {
        headline: string
        datePublished: string
        dateModified?: string
        articleBody?: string
        keywords?: string[]
        articleSection?: string
        wordCount?: number
    }
    /** Breadcrumb trail; omit to skip BreadcrumbList schema. */
    breadcrumbs?: Array<{ name: string; url: string }>
    /** Override for `dateModified` when newer than `articleData.dateModified`. */
    lastModified?: string
}

export const BlogSEO: React.FC<BlogSEOProps> = ({
    url,
    title,
    lng,
    image,
    socialImage,
    articleData,
    breadcrumbs,
    lastModified,
}) => {
    const baseUrl = process.env.SITE_SERVER_URL || 'https://www.musedam.cc'
    const normalizeUrl = (u?: string) => {
        if (!u) return undefined
        return u.startsWith('http') ? u : `${baseUrl}${u.startsWith('/') ? '' : '/'}${u}`
    }
    const fullUrl = normalizeUrl(url) || baseUrl
    const ogImage =
        socialImage || image
            ? normalizeUrl(socialImage || image)!
            : `${baseUrl}/assets/logo.svg`
    const inLanguage = lng === 'zh-CN' || lng === 'zh' ? 'zh-CN' : 'en-US'

    return (
        <>
            {articleData && (
                <SchemaOrg
                    type="blogPosting"
                    data={{
                        title,
                        description: '',
                        url: fullUrl,
                        image: ogImage,
                        headline: articleData.headline,
                        datePublished: articleData.datePublished,
                        dateModified:
                            articleData.dateModified ||
                            lastModified ||
                            articleData.datePublished,
                        articleBody: articleData.articleBody,
                        keywords: articleData.keywords,
                        articleSection: articleData.articleSection,
                        wordCount: articleData.wordCount,
                        inLanguage,
                    }}
                />
            )}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <SchemaOrg
                    type="breadcrumb"
                    data={{
                        items: breadcrumbs.map((item) => ({
                            name: item.name,
                            url: normalizeUrl(item.url) || item.url,
                        })),
                    }}
                />
            )}
        </>
    )
}
