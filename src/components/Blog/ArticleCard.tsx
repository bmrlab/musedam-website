import React from 'react'
import type { Category, Post } from '@/payload-types'
import { cn } from '@/utilities/cn'

interface ArticleCardProps {
  article: Post
  className?: string
  variant?: 'default' | 'featured'
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, className }) => {
  // 获取文章描述
  const description =
    article.meta?.description ||
    (typeof article.content === 'object' &&
      article.content?.root?.children?.[0]?.children?.[0]?.text) ||
    'Read this article to learn more...'

  // 获取第一个分类
  const category =
    Array.isArray(article.categories) && article.categories.length > 0
      ? typeof article.categories[0] === 'object'
        ? (article.categories[0] as Category).title
        : 'Article'
      : 'Article'

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
    <a
      href={`/posts/${article.slug}`}
      className={cn(
        'group block cursor-pointer overflow-hidden rounded-[20px] bg-[#F1F5F9] transition-all duration-300 hover:-translate-y-1',
        className,
      )}
    >
      {/* 图片区域 */}
      <div className={cn('relative h-[320px]')} style={{ backgroundColor }}>
        {/* 如果有图片，显示图片，否则显示颜色背景 */}
        {article.meta?.image &&
        typeof article.meta.image === 'object' &&
        'url' in article.meta.image ? (
          <img
            src={article.meta.image.url}
            alt={article.meta.image.alt || article.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-white/10 to-black/10"></div>
        )}

        {/* 渐变覆盖层 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10"></div>

        {/* 分类标签 */}
        <div className="absolute left-4 top-4">
          <span className="inline-block rounded-full bg-black/20 px-3 py-1 !font-euclid text-xs font-medium text-white backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="space-y-[10px] p-[30px]">
        <p
          className={cn(
            'overflow-hidden text-[14px] text-[#606264] transition-colors group-hover:text-gray-700',
          )}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {article.title}
        </p>

        <p className="line-clamp-2 h-[60px] !font-euclid text-[24px]/[30px] font-medium text-black">
          {description}
        </p>
      </div>
    </a>
  )
}
