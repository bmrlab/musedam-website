import type { Metadata } from 'next/types'
import React from 'react'
import PageClient from './page.client'

// Mock 数据和组件
import {
  mockHeroArticle,
  mockTopArticles,
  mockAllArticles,
  mockCategories
} from '@/data/mockBlogData'
import { HeroSection } from '@/components/Blog/HeroSection'
import { TopArticles } from '@/components/Blog/TopArticles'
import { AllArticles } from '@/components/Blog/AllArticles'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { category } = await searchParamsPromise

  return (
    <div className="min-h-screen bg-white">
      <PageClient />

      {/* Hero Section - 特色文章 */}
      <HeroSection article={mockHeroArticle} />

      {/* Top Articles - 精选文章 */}
      <TopArticles articles={mockTopArticles} />

      {/* All Articles - 所有文章（包含分类筛选） */}
      <AllArticles
        articles={mockAllArticles}
        categories={mockCategories}
      />
    </div>
  )
}

export async function generateMetadata({ searchParams: searchParamsPromise }: Args): Promise<Metadata> {
  const { category } = await searchParamsPromise

  let title = 'MuseDAM 博客'

  if (category) {
    const selectedCategory = mockCategories.find(cat => cat.id === category)
    if (selectedCategory) {
      title = `${selectedCategory.title} | MuseDAM 博客`
    }
  }

  return {
    title,
  }
}
