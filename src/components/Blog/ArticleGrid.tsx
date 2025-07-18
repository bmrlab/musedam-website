import React from 'react'
import { cn } from '@/utilities/cn'
import { ArticleCard } from './ArticleCard'
import type { Post } from '@/payload-types'

interface ArticleGridProps {
  articles: Post[]
  className?: string
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, className }) => {
  return (
    <div className={cn('', className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>

      {/* 如果没有文章，显示空状态 */}
      {articles.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">No articles found.</p>
        </div>
      )}
    </div>
  )
}
