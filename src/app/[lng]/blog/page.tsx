import React, { Suspense } from 'react'
import type { Metadata } from 'next/types'
import { getStaticBlogData, getBlogArticles } from '@/data/blog'
import type { Category, Post } from '@/payload-types'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { AllArticles } from '@/components/Blog/all-articles'
import { HeroSection } from '@/components/Blog/HeroSection'
import { BlogPageSkeleton } from '@/components/Blog/skeleton/BlogPageSkeleton'
import { TopArticles } from '@/components/Blog/TopArticles'
import { PageSEO } from '@/components/SEO/PageSEO'
import { seoTranslation } from '@/app/i18n'
import { getPageMetadata } from '@/utilities/getMetadata'

import PageClient from './page.client'
import { Information } from '@/components/Pricing/Enterprise/information'


// 禁用缓存，确保内容实时性
export const dynamic = 'force-dynamic'

// 添加ISR策略：预生成热门分类页面
// export async function generateStaticParams() {
//   try {
//     const payload = await getPayload({ config: configPromise })

//     // 获取所有分类，为每个分类预生成页面
//     const categories = await payload.find({
//       collection: 'categories',
//       limit: 50,
//       overrideAccess: false,
//     })

//     const params = categories.docs
//       .filter((category) => category.title)
//       .map((category) => ({
//         category: category.title,
//         lng: 'zh-CN'
//       }))

//     console.log(`预生成 ${params.length} 个分类页面`)
//     return params
//   } catch (error) {
//     console.error('预生成分类页面失败:', error)
//     return []
//   }
// }

type Args = {
  params: Promise<{ lng: string; category?: string }>
  searchParams: Promise<{ page?: string; category?: string }>
}

export default async function BlogPage({ params, searchParams }: Args) {
  const { lng } = await params
  const { category, page = 1 } = await searchParams
  const { t } = await seoTranslation(params)

  return (
    <>
      <PageSEO
        type="blog"
        title={t('blog.title')}
        description={t('blog.description')}
        url="/blog"
        image="/assets/logo.svg"
        lng={lng}
        breadcrumbs={[
          { name: t('home.shortTitle'), url: '/' },
          { name: t('blog.shortTitle'), url: '/blog' }
        ]}

      />



      <PageClient />
      <Suspense
        fallback={
          <BlogPageSkeleton
            showHero={true}
            showTopArticles={true}
            showAllArticles={true}
          />
        }
      >
        <BlogPageContent lng={lng} category={category} page={Number(page)} />
      </Suspense>
    </>
  )
}

// 异步数据获取组件
async function BlogPageContent({
  lng,
  category,
  page,
}: {
  lng: string
  category?: string
  page: number
}) {
  const payload = await getPayload({ config: configPromise })

  // 将 Next.js 语言代码转换为 Payload locale 格式
  const payloadLocale = convertLngToPayloadLocale(lng)

  const filterCategory = category === '' ? [] : category?.split(',') || []

  // 并行获取所有数据以优化性能
  const [{ categories, heroArticles, topArticles }, allPosts] = await Promise.all([
    getStaticBlogData(payloadLocale),
    payload.find({
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
    }),
  ])

  return (
    <div className="flex min-h-screen w-full flex-col items-center ">
      <div className='w-full max-w-[1440px] bg-white'>
        {/* Hero Section - 特色文章 */}
        {heroArticles.docs.length > 0 && (
          <div className="flex flex-col items-center gap-20 px-6 py-[60px] md:p-[80px] [&>section:nth-child(even)]:md:flex-row-reverse">
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
      </div>
      <Information dark={true} from='blog' />
      {/* All Articles - 所有文章（包含分类筛选） */}

      <div className='w-full max-w-[1440px] bg-white'>
        <AllArticles
          articles={allPosts.docs as Post[]}
          categories={categories.docs as Category[]}
          // page 类型是 string
          currentPage={parseInt(allPosts.page?.toString() ?? '1')}
          totalPages={allPosts.totalPages || 1}
          selectedCategory={filterCategory}
          className="px-6 py-[60px] md:p-20"
        />
      </div>
    </div>
  )
}


export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params

  return getPageMetadata({
    title: t('blog.title'),
    description: t('blog.description'),
    url: 'blog',
    lng,
  })
}
