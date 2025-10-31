import React from 'react'
import Head from 'next/head'
import { SchemaOrg } from './SchemaOrg'

interface BlogSEOProps {
    title: string
    description: string
    url: string
    image?: string
    lng: string
    articleData?: {
        headline: string
        datePublished: string
        dateModified?: string
        author?: string
        articleBody?: string
        keywords?: string[]
        articleSection?: string
        wordCount?: number
    }
    breadcrumbs?: Array<{
        name: string
        url: string
    }>
    // 新增的高级SEO字段
    canonicalUrl?: string
    noindex?: boolean
    nofollow?: boolean
    lastModified?: string
    readingTime?: number
    tags?: string[]
    category?: string
    socialImage?: string
    twitterCard?: 'summary' | 'summary_large_image'
}

export const BlogSEO: React.FC<BlogSEOProps> = ({
    title,
    description,
    url,
    image,
    lng,
    articleData,
    breadcrumbs,
    canonicalUrl,
    noindex = false,
    nofollow = false,
    lastModified,
    readingTime,
    tags = [],
    category,
    socialImage,
    twitterCard = 'summary_large_image'
}) => {
    const baseUrl = process.env.SITE_SERVER_URL || 'https://www.musedam.cc'
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
    const canonical = canonicalUrl || fullUrl

    // 统一社交分享图为绝对地址（优先使用文章 banner 图）
    const normalizeUrl = (u?: string) => {
        if (!u) return undefined
        return u.startsWith('http') ? u : `${baseUrl}${u.startsWith('/') ? '' : '/'}${u}`
    }
    const ogImage = (socialImage || image) ? normalizeUrl(socialImage || image)! : `${baseUrl}/assets/logo.svg`
    const isZhCN = lng === 'zh-CN'

    // 生成关键词
    const keywords = [
        ...tags,
        ...(articleData?.keywords || []),
        '数字资产管理',
        'AI技术',
        '团队协作',
        '创意工作流',
        'DAM系统'
    ].filter(Boolean).join(', ')

    return (
        <>
            <Head>
                {/* 基础SEO */}
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content='MuseDAM' />
                <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />

                {/* 语言和地区 */}
                <meta property="og:locale" content={isZhCN ? 'zh_CN' : 'en_US'} />
                <meta name="language" content={isZhCN ? 'zh-CN' : 'en-US'} />

                {/* 规范链接 */}
                <link rel="canonical" href={canonical} />

                {/* Open Graph */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:type" content={articleData ? 'article' : 'website'} />
                <meta property="og:site_name" content="MuseDAM" />
                <meta property="og:locale" content={isZhCN ? 'zh_CN' : 'en_US'} />

                {/* Twitter Card */}
                <meta name="twitter:card" content={twitterCard} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />
                <meta name="twitter:site" content="@musedam" />

                {/* 文章特定元数据 */}
                {articleData && (
                    <>
                        <meta property="article:published_time" content={articleData.datePublished} />
                        <meta property="article:modified_time" content={articleData.dateModified || articleData.datePublished} />
                        <meta property="article:author" content={articleData.author || (isZhCN ? 'MuseDAM团队' : 'MuseDAM Team')} />
                        {category && <meta property="article:section" content={category} />}
                        {tags.map((tag, index) => (
                            <meta key={index} property="article:tag" content={tag} />
                        ))}
                    </>
                )}

                {/* 结构化数据 */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': articleData ? 'BlogPosting' : 'Blog',
                            name: title,
                            description: description,
                            url: fullUrl,
                            image: ogImage,
                            author: {
                                '@type': 'Organization',
                                name: 'MuseDAM',
                                url: baseUrl
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: 'MuseDAM',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: `${baseUrl}/assets/logo.svg`
                                }
                            },
                            ...(articleData && {
                                headline: articleData.headline,
                                datePublished: articleData.datePublished,
                                dateModified: articleData.dateModified || articleData.datePublished,
                                articleBody: articleData.articleBody,
                                keywords: articleData.keywords,
                                articleSection: articleData.articleSection,
                                wordCount: articleData.wordCount,
                                inLanguage: isZhCN ? 'zh-CN' : 'en-US'
                            }),
                            ...(lastModified && { dateModified: lastModified }),
                            ...(readingTime && { timeRequired: `PT${readingTime}M` })
                        })
                    }}
                />

                {/* 预加载关键资源 */}
                <link rel="preload" href={ogImage} as="image" />
                <link rel="dns-prefetch" href="//www.google-analytics.com" />
                <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            </Head>

            {/* 面包屑导航结构化数据 */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <SchemaOrg
                    type="breadcrumb"
                    data={{
                        items: breadcrumbs.map((item, index) => ({
                            name: item.name,
                            url: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`
                        }))
                    }}
                />
            )}
        </>
    )
}
