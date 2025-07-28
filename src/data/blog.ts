'use server'
'use cache'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const getStaticBlogData = async () => {
  const payload = await getPayload({ config: configPromise })

  const [categories, heroArticles, topArticles] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      overrideAccess: false,
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
    }),
  ])

  return { categories, heroArticles, topArticles }
}
