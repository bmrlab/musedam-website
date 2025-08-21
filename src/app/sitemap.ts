import { MetadataRoute } from 'next'
import getServerSideURL from '@/utilities/getServerSideURL'

import { languages, enLng } from './i18n/settings'
import { getBlogArticles } from '@/data/blog'

export const dynamic = 'force-dynamic'

// Generate sitemap base URLs with language paths
const generateLangUrls = (path: string = '') => {
  return languages.map((lng) => ({
    url: `${getServerSideURL()}/${lng}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.8,
  }))
}

// Core feature pages
const featurePages = [
  // AI-powered features
  '/features/ai-search',
  '/features/ai-parsing',
  '/features/ai-content-creation',
  '/features/auto-tags',
  '/features/muse-copilot',

  // Visual workspace features
  '/features/inspiration-collection',
  '/features/smart-folders',
  '/features/file-formats',
  '/features/multiple-viewing',
  '/features/encrypted-sharing',

  // Team collaboration features
  '/features/team-management',
  '/features/permissions',
  '/features/dynamic-feedback',
  '/features/versions',
  '/features/data-statistics',
]

// Company pages
const companyPages = ['/about-us', '/careers', '/privacy', '/terms']

// Blog pages (you may want to generate these dynamically from your CMS)
const blogPages = [
  '/blog',
  // Add other blog paths as needed
]

// Pricing pages
const pricingPages = ['/pricing', '/pricing/ai']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []

  try {
    // Add home pages for each language
    sitemap.push(...generateLangUrls())

    // Add feature pages
    featurePages.forEach((path) => {
      sitemap.push(...generateLangUrls(path))
    })

    // Add company pages
    companyPages.forEach((path) => {
      sitemap.push(...generateLangUrls(path))
    })

    // Add blog pages
    blogPages.forEach((path) => {
      sitemap.push(...generateLangUrls(path))
    })

    // Add pricing pages
    pricingPages.forEach((path) => {
      sitemap.push(...generateLangUrls(path))
    })

    // 动态添加所有博客文章的 URL，添加错误处理
    for (const lng of languages) {
      try {
        // 只支持 'en' | 'zh'，做映射
        const payloadLocale = lng === enLng ? 'en' : 'zh'
        const { docs: posts, totalPages } = await getBlogArticles(payloadLocale, [], 1, 1000)
        if (Array.isArray(posts)) {
          posts.forEach((post: any) => {
            if (post.slug && post.publishedAt) {
              sitemap.push({
                url: `${getServerSideURL()}/${lng}/blog/${post.slug}`,
                lastModified: new Date(post.publishedAt),
                changeFrequency: 'weekly',
                priority: 0.7,
              })
            }
          })
        }
      } catch (error) {
        console.error(`Error fetching blog articles for language ${lng}:`, error)
        // 即使博客获取失败，也继续生成其他页面的sitemap
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // 如果出现严重错误，至少返回基本的页面结构
    if (sitemap.length === 0) {
      sitemap.push({
        url: getServerSideURL(),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      })
    }
  }

  return sitemap
}
