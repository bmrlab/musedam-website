import React from 'react'
import type { Post } from '@/payload-types'
import { cn } from '@/utilities/cn'

import { ArticleCard } from '../ArticleCard'
import { ArticleGridSkeleton } from '../skeleton/ArticleGridSkeleton'

interface ArticleGridProps {
  articles: Post[]
  className?: string
  isLoading?: boolean
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  className,
  isLoading = false,
}) => {
  if (isLoading) {
    return <ArticleGridSkeleton className={className} />
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 gap-x-[30px] gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
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
