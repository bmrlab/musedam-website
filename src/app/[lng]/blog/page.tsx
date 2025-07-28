import React from 'react'
import type { Metadata } from 'next/types'
import type { Category, Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { AllArticles } from '@/components/Blog/all-articles'
import { HeroSection } from '@/components/Blog/HeroSection'
import { TopArticles } from '@/components/Blog/TopArticles'

import PageClient from './page.client'

// export const dynamic = 'force-static'
// export const revalidate = 600

type Args = {
  searchParams: Promise<{
    category?: string
    page?: number
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { category, page = 1 } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const filterCategory = category === '' ? [] : category?.split(',') || []

  // 获取所有分类
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    overrideAccess: false,
  })

  // hero article
  const heroArticles = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 2,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      isHeroArticle: { equals: true },
    },
    sort: '-publishedAt',
  })

  // Top Articles
  const topArticles = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      isTopArticle: { equals: true },
    },
    sort: '-publishedAt',
  })

  // 获取筛选后的文章（用于 All Articles 部分）
  const allPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 9,
    page: page,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      ...(filterCategory.length > 0 ? { categories: { in: filterCategory } } : {}),
    },
    sort: '-publishedAt',
  })

  return (
    <div className="min-h-screen w-full max-w-[1440px] bg-white">
      <PageClient />

      {/* Hero Section - 特色文章 */}
      {heroArticles.docs.length > 0 && (
        <div className="flex flex-col items-center gap-[60px] px-6 py-[60px] md:p-[80px]">
          {heroArticles.docs.map((article) => (
            <HeroSection key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Top Articles - 精选文章 */}
      {topArticles.docs.length > 0 && (
        <TopArticles
          articles={topArticles.docs as Post[]}
          className="mt-0 pb-[100px] md:mt-[60px]"
        />
      )}

      {/* All Articles - 所有文章（包含分类筛选） */}
      <AllArticles
        articles={allPosts.docs as Post[]}
        categories={categories.docs as Category[]}
        // page 类型是 string
        currentPage={parseInt(allPosts.page?.toString() ?? '1')}
        totalPages={allPosts.totalPages || 1}
        selectedCategory={filterCategory}
        className="px-6 pb-[60px] pt-0 md:p-20"
      />
    </div>
  )
}

export async function generateMetadata({
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const { category } = await searchParamsPromise

  let title = 'MuseDAM 博客'

  if (category) {
    const payload = await getPayload({ config: configPromise })
    try {
      const categoryDoc = await payload.findByID({
        collection: 'categories',
        id: category,
        overrideAccess: false,
      })
      if (categoryDoc) {
        title = `${categoryDoc.title} | MuseDAM 博客`
      }
    } catch (error) {
      // 如果分类不存在，使用默认标题
    }
  }

  return {
    title,
    description:
      'Discover insights, best practices, and industry trends in digital asset management, workflow automation, and creative operations.',
  }
}
