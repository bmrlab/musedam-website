import React from 'react'
import { cn } from '@/utilities/cn'
import { ArticleCard } from './ArticleCard'
import type { MockArticle } from '@/data/mockBlogData'

interface TopArticlesProps {
  articles: MockArticle[]
  className?: string
}

export const TopArticles: React.FC<TopArticlesProps> = ({ articles, className }) => {
  return (
    <section className={cn('container mx-auto px-4 py-16', className)}>
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Top Articles
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="featured"
          />
        ))}
      </div>
    </section>
  )
}
