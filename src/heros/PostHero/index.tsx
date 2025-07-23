import React, { useMemo } from 'react'
import Image from 'next/image'
import type { Media, Post } from '@/payload-types'
import { formatDateTime } from 'src/utilities/formatDateTime'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title, meta } = post

  const metaImage = useMemo(() => {
    if (!meta?.image) return undefined
    if (typeof meta?.image === 'object') {
      const image = meta.image as Media
      return {
        src: image.url,
        alt: image.alt,
        width: image.width,
        height: image.height,
      }
    }
  }, [meta?.image])

  // 计算阅读时间（简单估算：每分钟200字）
  const getReadingTime = (content: any): string => {
    if (!content || typeof content !== 'object') return '5 min read'

    // 简单的字数统计逻辑
    const textContent = JSON.stringify(content).replace(/[^\w\s]/gi, '')
    const wordCount = textContent.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)
    return `${readingTime} min read`
  }

  return (
    <div className="bg-white pb-[60px] pt-20">
      <div className="px-20">
        <div className="mx-auto max-w-[1000px]">
          <div className="flex flex-col">
            {/* 阅读时间和发布信息 */}
            <div className="flex items-center gap-3">
              <span className="!font-euclid text-[14px] font-normal leading-[1.268] text-[rgba(36,36,36,0.7)]">
                {getReadingTime(post.content)}
              </span>
              <span className="!font-euclid text-[14px] font-normal leading-[1.268] text-[rgba(36,36,36,0.7)] opacity-60">
                ·
              </span>
              {publishedAt && (
                <time
                  dateTime={publishedAt}
                  className="!font-euclid text-[14px] font-normal leading-[1.268] text-[rgba(36,36,36,0.7)]"
                >
                  {formatDateTime(publishedAt)}
                </time>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {/* 标题 */}
              <h1 className="!font-euclid text-[54px] font-semibold leading-[1.15] text-[#242424]">
                {title}
              </h1>

              {/* 描述 */}
              {meta?.description && (
                <p className="!font-euclid text-[22px] font-normal leading-[1.45] text-[rgba(36,36,36,0.7)]">
                  {meta.description}
                </p>
              )}
            </div>

            {/* 分类标签 */}
            {categories && categories.length > 0 && (
              <div className="mt-3">
                {categories.map((category, index) => {
                  if (typeof category === 'object' && category !== null) {
                    const { title: categoryTitle } = category
                    return (
                      <span
                        key={index}
                        className="inline-flex h-8 items-center justify-center rounded-full bg-[#F2F2F2] px-[10px] font-euclid text-[15px] font-normal uppercase leading-[1.067] text-[rgba(36,36,36,0.8)]"
                      >
                        {categoryTitle || 'Digital Transformation'}
                      </span>
                    )
                  }
                  return null
                })}
              </div>
            )}

            {metaImage && (
              <div className="relative mt-[60px] aspect-[2/1] w-full rounded-[16px]">
                <Image
                  src={metaImage.src ?? ''}
                  fill
                  alt={metaImage.alt ?? ''}
                  className="rounded-[16px] object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
