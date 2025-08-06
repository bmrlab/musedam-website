import { MetadataRoute } from 'next'
import getServerSideURL from '@/utilities/getServerSideURL'

import { languages } from './i18n/settings'

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

  return sitemap
}
