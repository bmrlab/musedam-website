import React from 'react'
import { SchemaOrg } from './SchemaOrg'
import getServerSideURL from '@/utilities/getServerSideURL'

interface PageSEOProps {
    type: 'home' | 'blog' | 'feature' | 'about' | 'pricing' | 'careers' | 'privacy' | 'terms' | 'bookDemo'
    title: string
    description: string
    url: string
    image?: string
    articleData?: {
        headline: string
        datePublished: string
        dateModified?: string
        author?: string
    }
    breadcrumbs?: Array<{
        name: string
        url: string
    }>
    lng: string
}

export const PageSEO: React.FC<PageSEOProps> = ({
    type,
    title,
    description,
    url,
    image,
    articleData,
    breadcrumbs,
    lng
}) => {
    // 获取动态的 baseUrl
    const baseUrl = process.env.SITE_SERVER_URL || 'https://www.musedam.cc'
    // 如果传入的 url 是相对路径，则拼接完整的 URL
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`

    // 根据语言调整URL - 确保URL包含正确的语言前缀
    const localizedUrl = fullUrl.includes(`/${lng}`) ? fullUrl : `${fullUrl}/${lng}`
    const isZhCN = lng === 'zh-CN'
    return (
        <>
            {/* 基础组织信息 - 所有页面都需要 */}
            <SchemaOrg type="organization" data={{
                name: 'MuseDAM',
                url: baseUrl,
                logo: `${baseUrl}/assets/logo.svg`,
                description: isZhCN
                    ? 'MuseDAM 是一款智能数字资产管理软件,提供资源采集、文件整理、团队协作和 AI 生成等功能,助力企业高效管理数字资产。'
                    : 'Discover MuseDAM, the smart digital asset management software that simplifies collection, organization, and team collaboration with AI-powered features.'
            }} />

            {/* 网站信息 - 所有页面都需要 */}
            <SchemaOrg type="website" data={{
                name: 'MuseDAM',
                url: baseUrl,
                description: isZhCN
                    ? 'MuseDAM 以 AI 技术为核心，提供全面的素材管理与预览功能，搭配高效的团队协作工具，助力创意团队提升工作效率，释放创造潜能。'
                    : 'Discover MuseDAM, the smart digital asset management software that simplifies collection, organization, and team collaboration with AI-powered features.'
            }} />

            {/* 页面信息 */}
            <SchemaOrg
                type="webpage"
                data={{
                    name: title,
                    description: description,
                    url: localizedUrl
                }}
            />

            {/* 文章页面特殊处理 */}
            {type === 'blog' && articleData && (
                <SchemaOrg
                    type="article"
                    data={{
                        headline: articleData.headline,
                        description: description,
                        image: image || `${baseUrl}/assets/logo.svg`,
                        url: localizedUrl,
                        datePublished: articleData.datePublished,
                        dateModified: articleData.dateModified || articleData.datePublished,
                        author: {
                            '@type': 'Organization',
                            name: 'MuseDAM'
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'MuseDAM',
                            logo: {
                                '@type': 'ImageObject',
                                url: `${baseUrl}/assets/logo.svg`
                            }
                        },
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': localizedUrl
                        }
                    }}
                />
            )}

            {/* 面包屑导航 */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <SchemaOrg
                    type="breadcrumb"
                    data={{
                        items: breadcrumbs.map((item, index) => ({
                            name: item.name,
                            // 如果面包屑 URL 是相对路径，则拼接完整的 URL
                            url: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`
                        }))
                    }}
                />
            )}
        </>
    )
} 