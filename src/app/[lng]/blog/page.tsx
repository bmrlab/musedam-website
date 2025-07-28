import React from 'react'
import type { Metadata } from 'next/types'
import { getStaticBlogData } from '@/data/blog'
import type { Category, Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'
import type { PropsWithLng } from '@/types/page'

import { AllArticles } from '@/components/Blog/all-articles'
import { HeroSection } from '@/components/Blog/HeroSection'
import { TopArticles } from '@/components/Blog/TopArticles'

import PageClient from './page.client'

// export const dynamic = 'force-static'
// export const revalidate = 600

type Args = {
  params: Promise<{ lng: string }>
  searchParams: Promise<{
    category?: string
    page?: number
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { lng } = await paramsPromise
  const { category, page = 1 } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  // 将 Next.js 语言代码转换为 Payload locale 格式
  const payloadLocale = convertLngToPayloadLocale(lng)

  const filterCategory = category === '' ? [] : category?.split(',') || []

  const { categories, heroArticles, topArticles } = await getStaticBlogData(payloadLocale)

  const allPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 9,
    page,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      ...(filterCategory.length > 0 ? { categories: { in: filterCategory } } : {}),
    },
    sort: '-publishedAt',
    locale: payloadLocale,
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
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const { lng } = await paramsPromise
  const { category } = await searchParamsPromise

  // 将 Next.js 语言代码转换为 Payload locale 格式
  const payloadLocale = convertLngToPayloadLocale(lng)

  let title = 'MuseDAM 博客'

  if (category) {
    const payload = await getPayload({ config: configPromise })
    try {
      const categoryDoc = await payload.findByID({
        collection: 'categories',
        id: category,
        overrideAccess: false,
        locale: payloadLocale,
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
