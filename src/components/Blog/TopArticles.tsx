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
      {/* 标题区域 */}
      <div className="px-6 md:px-[80px]">
        <h2 className="text-center !font-feature text-[38px]/[38px] font-medium text-black md:text-start md:text-[54px]/[54px]">
          Top Articles
        </h2>
      </div>

      {/* 文章列表 */}
      <div className="md:no-scrollbar flex flex-col  gap-[30px] px-6 pt-[30px] md:grid md:w-full md:auto-cols-max md:grid-flow-col md:gap-[30px] md:overflow-x-auto md:px-[80px] md:pt-[60px]">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            className="w-full md:w-[520px]"
            variant="featured"
          />
        ))}
      </div>
    </section>
  )
}
