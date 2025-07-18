import React from 'react'
import { cn } from '@/utilities/cn'
import type { MockArticle } from '@/data/mockBlogData'

interface ArticleCardProps {
  article: MockArticle
  className?: string
  variant?: 'default' | 'featured'
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  className,
  variant = 'default'
}) => {
  const isFeatured = variant === 'featured'

  return (
    <article className={cn(
      'group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
      className
    )}>
      {/* 图片区域 */}
      <div
        className={cn(
          'relative mb-4 aspect-[4/3] overflow-hidden rounded-xl',
          isFeatured ? 'aspect-[4/3]' : 'aspect-[4/3]'
        )}
        style={{ backgroundColor: article.color }}
      >
        {/* 渐变覆盖层 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10"></div>

        {/* 分类标签 */}
        <div className="absolute left-4 top-4">
          <span className="inline-block rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {article.category}
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
          {article.description}
        </p>
      </div>
    </article>
  )
}
