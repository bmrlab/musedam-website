'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type GetPostsProps = {
  page: number
  category: string[]
}

export const getPosts = async ({ page, category }: GetPostsProps) => {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection: 'posts',
    depth: 1,
    limit: 9,
    page,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      ...(category.length > 0 ? { categories: { in: category } } : {}),
    },
    sort: '-publishedAt',
  })
}

export const getAllCategories = async () => {
  const payload = await getPayload({ config: configPromise })

  // 获取所有分类
  return payload.find({
    collection: 'categories',
    limit: 100,
    overrideAccess: false,
  })
}
