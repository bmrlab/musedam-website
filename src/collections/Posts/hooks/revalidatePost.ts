import { revalidatePath, revalidateTag } from 'next/cache'
import { unstable_after as after } from 'next/server'
import type { Post } from '@/payload-types'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  // 支持的语言列表
  const languages = ['zh-CN', 'en-US']

  if (doc._status === 'published') {
    after(() => {
      // 为每种语言重新验证路径
      languages.forEach((lng) => {
        const path = `/${lng}/blog/${doc.slug}`
        payload.logger.info(`Revalidating post at path: ${path}`)
        revalidatePath(path)
      })

      // 同时重新验证博客列表页
      languages.forEach((lng) => {
        const blogPath = `/${lng}/blog`
        payload.logger.info(`Revalidating blog list at path: ${blogPath}`)
        revalidatePath(blogPath)
      })
    })
  }

  // 如果文章之前已发布，现在取消发布，需要重新验证旧路径
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    after(() => {
      languages.forEach((lng) => {
        const oldPath = `/${lng}/blog/${previousDoc.slug}`
        payload.logger.info(`Revalidating old post at path: ${oldPath}`)
        revalidatePath(oldPath)
      })

      // 同时重新验证博客列表页
      languages.forEach((lng) => {
        const blogPath = `/${lng}/blog`
        revalidatePath(blogPath)
      })
    })
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/blog/${doc?.slug}`

    after(() => {
      revalidatePath(path)
      revalidateTag('posts-sitemap')
    })
  }

  return doc
}
