'use server'
'use cache'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const getStaticBlogData = async (locale?: 'zh' | 'en') => {
  const payload = await getPayload({ config: configPromise })

  const [categories, heroArticles, topArticles] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      overrideAccess: false,
      sort: 'publishedAt',
      ...(locale && { locale }),
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 2,
      overrideAccess: false,
      where: {
        _status: { equals: 'published' },
        isHeroArticle: { equals: true },
      },
      sort: '-publishedAt',
      ...(locale && { locale }),
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 100,
      overrideAccess: false,
      where: {
        _status: { equals: 'published' },
        isTopArticle: { equals: true },
      },
      sort: '-publishedAt',
      ...(locale && { locale }),
    }),
  ])

  return { categories, heroArticles, topArticles }
}

export const getBlogArticles = async (
  locale: 'zh' | 'en',
  categories: string[] = [],
  page: number = 1,
  limit: number = 9,
) => {
  const payload = await getPayload({ config: configPromise })
  const filterCategory = categories.length === 0 ? [] : categories

  const allPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    page,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      ...(filterCategory.length > 0 ? { categories: { in: filterCategory } } : {}),
    },
    sort: '-publishedAt',
    locale,
  })

  return {
    docs: allPosts.docs,
    totalDocs: allPosts.totalDocs,
    limit: allPosts.limit,
    totalPages: allPosts.totalPages,
    page: allPosts.page,
    pagingCounter: allPosts.pagingCounter,
    hasPrevPage: allPosts.hasPrevPage,
    hasNextPage: allPosts.hasNextPage,
    prevPage: allPosts.prevPage,
    nextPage: allPosts.nextPage,
  }
}
