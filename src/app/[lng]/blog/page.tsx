import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { CategoryFilter } from '@/components/CategoryFilter'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import type { Category } from '@/payload-types'

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

  // 构建查询条件
  const whereCondition: any = {}
  if (category) {
    whereCondition.categories = {
      in: [category]
    }
  }

  // 获取文章数据
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    ...(Object.keys(whereCondition).length > 0 ? { where: whereCondition } : {})
  })

  // 获取所有分类
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    overrideAccess: false,
  })

  return (
    <div className="py-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose max-w-none dark:prose-invert">
          <h1>博客</h1>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="container mb-8">
        <CategoryFilter
          categories={categories.docs as Category[]}
          basePath="/blog"
        />
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination
            page={posts.page}
            totalPages={posts.totalPages}
            basePath="/blog/page"
          />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ searchParams: searchParamsPromise }: Args): Promise<Metadata> {
  const { category } = await searchParamsPromise

  let title = 'MuseDAM 博客'

  if (category) {
    const payload = await getPayload({ config: configPromise })
    const categoryDoc = await payload.findByID({
      collection: 'categories',
      id: category,
      overrideAccess: false,
    }).catch(() => null)

    if (categoryDoc) {
      title = `${categoryDoc.title} | MuseDAM 博客`
    }
  }

  return {
    title,
  }
}
