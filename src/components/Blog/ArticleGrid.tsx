import React from 'react'
import { cn } from '@/utilities/cn'
import { ArticleCard } from './ArticleCard'
import type { MockArticle } from '@/data/mockBlogData'

interface ArticleGridProps {
  articles: MockArticle[]
  className?: string
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, className }) => {
  return (
    <div className={cn('flex-1', className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>

      {/* 分页控件 */}
      <div className="mt-12 flex items-center justify-center space-x-2">
        <button className="flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-gray-600">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex space-x-1">
          <button className="flex size-8 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
            1
          </button>
          <button className="flex size-8 items-center justify-center rounded-full text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
            2
          </button>
          <button className="flex size-8 items-center justify-center rounded-full text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
            3
          </button>
          <span className="flex size-8 items-center justify-center text-sm text-gray-400">
            ...
          </span>
        </div>

        <button className="flex size-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-gray-900">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
