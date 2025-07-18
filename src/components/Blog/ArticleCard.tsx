import React from 'react'
import { cn } from '@/utilities/cn'
import type { Post, Category } from '@/payload-types'

interface ArticleCardProps {
  article: Post
  className?: string
  variant?: 'default' | 'featured'
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  className,
  variant = 'default'
}) => {
  const isFeatured = variant === 'featured'

  // 获取文章描述
  const description = article.meta?.description ||
    (typeof article.content === 'object' && article.content?.root?.children?.[0]?.children?.[0]?.text) ||
    'Read this article to learn more...'

  // 获取第一个分类
  const category = Array.isArray(article.categories) && article.categories.length > 0
    ? (typeof article.categories[0] === 'object' ? (article.categories[0] as Category).title : 'Article')
    : 'Article'

  // 生成随机颜色（基于文章 ID）
  const colors = ['#3B82F6', '#A855F7', '#6366F1', '#84CC16', '#A16207', '#DC2626', '#059669', '#EA580C']
  const colorIndex = typeof article.id === 'string' ? article.id.charCodeAt(0) % colors.length : 0
  const backgroundColor = colors[colorIndex]

  return (
    <a
      href={`/posts/${article.slug}`}
      className={cn(
        'group block cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        className
      )}
    >
      {/* 图片区域 */}
      <div
        className={cn(
          'relative mb-4 aspect-[4/3] overflow-hidden rounded-xl',
          isFeatured ? 'aspect-[4/3]' : 'aspect-[4/3]'
        )}
        style={{ backgroundColor }}
      >
        {/* 如果有图片，显示图片，否则显示颜色背景 */}
        {article.meta?.image && typeof article.meta.image === 'object' && 'url' in article.meta.image ? (
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
          <span className="inline-block rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="space-y-3">
        <h3 className={cn(
          'overflow-hidden font-semibold text-gray-900 transition-colors group-hover:text-gray-700',
          isFeatured ? 'text-lg' : 'text-base'
        )}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {article.title}
        </h3>

        <p className="overflow-hidden text-sm leading-relaxed text-gray-600"
           style={{
             display: '-webkit-box',
             WebkitLineClamp: 3,
             WebkitBoxOrient: 'vertical',
           }}>
          {description}
        </p>
      </div>
    </a>
  )
}
