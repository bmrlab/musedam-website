import React, { useMemo } from 'react'
import Image from 'next/image'
import type { Category, Post } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { cva } from 'class-variance-authority'

import { LocaleLink } from '@/components/LocalLink'

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
      featured: 'space-y-[10px] p-4 md:p-[30px]',
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
      featured: 'text-[18px]/[22px] md:text-[24px]/[30px]',
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

  return (
    <LocaleLink
      href={`/blog/posts/${article.slug}`}
      className={articleVariants({ variant, className })}
    >
      {/* 图片区域 */}
      <div className={cn('relative aspect-[3/2] rounded-[20px] bg-[#F7F9FC]')}>
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
          <div className="size-full rounded-[20px] bg-[#F7F9FC]"></div>
        )}
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
    </LocaleLink>
  )
}
