import React, { useMemo } from 'react'
import Image from 'next/image'
import type { Category, Post } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { cva } from 'class-variance-authority'

const articleVariants = cva(
  'group block cursor-pointer overflow-hidden rounded-[20px] transition-all duration-300 hover:-translate-y-1',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        featured: 'bg-[#F1F5F9]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const contentVariants = cva('', {
  variants: {
    variant: {
      default: 'space-y-2 px-[10px] pb-[20px] pt-[25px]',
      featured: 'space-y-[10px] p-[30px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const titleVariants = cva('line-clamp-2 h-[60px] !font-euclid font-medium text-black', {
  variants: {
    variant: {
      default: 'text-[18px]',
      featured: 'text-[24px]/[30px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface ArticleCardProps {
  article: Post
  className?: string
  variant?: 'default' | 'featured'
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant, className }) => {
  // 获取文章描述
  const description =
    article.meta?.description ||
    (typeof article.content === 'object' &&
      article.content?.root?.children?.[0]?.children?.[0]?.text) ||
    'Read this article to learn more...'

  // 获取第一个分类
  const category = useMemo(
    () =>
      Array.isArray(article.categories) && article.categories.length > 0
        ? typeof article.categories[0] === 'object'
          ? (article.categories[0] as Category).title
          : 'Article'
        : 'Article',
    [article.categories],
  )

  // 生成随机颜色（基于文章 ID）
  const colors = [
    '#3B82F6',
    '#A855F7',
    '#6366F1',
    '#84CC16',
    '#A16207',
    '#DC2626',
    '#059669',
    '#EA580C',
  ]
  const colorIndex = typeof article.id === 'string' ? article.id.charCodeAt(0) % colors.length : 0
  const backgroundColor = colors[colorIndex]

  return (
    <a href={`/blog/posts/${article.slug}`} className={articleVariants({ variant, className })}>
      {/* 图片区域 */}
      <div className={cn('relative aspect-[3/2] rounded-[20px]')} style={{ backgroundColor }}>
        {/* 如果有图片，显示图片，否则显示颜色背景 */}
        {article.meta?.image &&
        typeof article.meta.image === 'object' &&
        'url' in article.meta.image ? (
          <Image
            src={article.meta.image.url ?? ''}
            alt={article.meta.image.alt || article.title}
            fill
            className="size-full rounded-[20px] object-cover"
          />
        ) : (
          <div className="size-full rounded-[20px] bg-gradient-to-br from-white/10 to-black/10"></div>
        )}

        {/* 分类标签 */}
        <div className="absolute left-4 top-4">
          <span className="inline-block rounded-full bg-black/20 px-3 py-1 !font-euclid text-xs font-medium text-white backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* 内容区域 */}
      <div className={contentVariants({ variant })}>
        <p
          className={cn(
            'overflow-hidden truncate text-[14px] uppercase text-[#606264] transition-colors',
          )}
        >
          {category}
        </p>

        <p className={titleVariants({ variant })}>{article.title}</p>
      </div>
    </a>
  )
}
