import type { Metadata } from 'next/types'
import React from 'react'
import PageClient from './page.client'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Category, Post } from '@/payload-types'

// 真实数据组件
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
  const payload = await getPayload({ config: configPromise })

  // 获取所有分类
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    overrideAccess: false,
  })

  // 构建查询条件
  const whereCondition: any = {}
  if (category) {
    whereCondition.categories = {
      in: [category]
    }
  }

  // 获取所有文章（用于 Hero 和 Top Articles）
  const allPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 50, // 获取足够的文章用于筛选
    overrideAccess: false,
    where: {
      _status: { equals: 'published' }
    },
    sort: '-publishedAt'
  })

  // 获取筛选后的文章（用于 All Articles 部分）
  const filteredPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      ...(Object.keys(whereCondition).length > 0 ? whereCondition : {})
    },
    sort: '-publishedAt'
  })

  // 选择 Hero 文章（最新的文章）
  const heroArticle = allPosts.docs[0] || null

  // 选择 Top Articles（接下来的 3 篇文章）
  const topArticles = allPosts.docs.slice(1, 4)

  return (
    <div className="min-h-screen w-full max-w-[1440px] bg-white">
      <PageClient />

      {/* Hero Section - 特色文章 */}
      {heroArticle && (
        <HeroSection article={heroArticle as Post} className="p-[80px]" />
      )}

      {/* Top Articles - 精选文章 */}
      {topArticles.length > 0 && (
        <TopArticles articles={topArticles as Post[]} />
      )}

      {/* All Articles - 所有文章（包含分类筛选） */}
      <AllArticles
        articles={filteredPosts.docs as Post[]}
        categories={categories.docs as Category[]}
        currentPage={filteredPosts.page || 1}
        totalPages={filteredPosts.totalPages || 1}
        selectedCategory={category}
      />
    </div>
  )
}

export async function generateMetadata({ searchParams: searchParamsPromise }: Args): Promise<Metadata> {
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
    description: 'Discover insights, best practices, and industry trends in digital asset management, workflow automation, and creative operations.',
  }
}
