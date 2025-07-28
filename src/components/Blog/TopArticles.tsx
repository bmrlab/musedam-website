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
    <section className={cn(className)}>
      {/* 标题区域 */}
      <div className="px-6 md:px-[80px]">
        <h2 className="text-center !font-feature text-[38px]/[38px] font-medium text-black md:text-start md:text-[54px]/[54px]">
          Top Articles
        </h2>
      </div>

      {/* 文章列表 */}
      <div
        className={cn(
          ' flex flex-col gap-[30px] px-6 pt-[30px]  md:gap-[30px]',
          'md:no-scrollbar md:mx-[calc(50.6%-50vw)] md:grid md:auto-cols-max md:grid-flow-col md:overflow-x-auto md:px-[max(80px,calc(50vw-50%+80px))] md:pt-[60px] ',
        )}
      >
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
