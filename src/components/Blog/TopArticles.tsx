import React from 'react'
import type { Post } from '@/payload-types'
import { cn } from '@/utilities/cn'

import { ArticleCard } from './ArticleCard'

interface TopArticlesProps {
  articles: Post[]
  className?: string
}

export const TopArticles: React.FC<TopArticlesProps> = ({ articles, className }) => {
  return (
    <section className={cn('', className)}>
      <div className="px-0 md:px-[80px]">
        <h2 className="text-center !font-feature text-[38px]/[38px] font-medium text-black md:text-start md:text-[54px]/[54px]">
          Top Articles
        </h2>
      </div>

      <div className="no-scrollbar grid w-full auto-cols-max grid-flow-col gap-[30px] overflow-x-auto px-[80px] pt-[60px]">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            className="w-[520px]"
            variant="featured"
          />
        ))}
      </div>
    </section>
  )
}
