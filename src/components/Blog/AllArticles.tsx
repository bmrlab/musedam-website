'use client'

import React, { useMemo, useState } from 'react'
import type { Category, Post } from '@/payload-types'
import { cn } from '@/utilities/cn'

import { Pagination } from '@/components/Pagination'

import { ArticleGrid } from './ArticleGrid'
import { CategorySidebar } from './CategorySidebar'

interface AllArticlesProps {
  articles: Post[]
  categories: Category[]
  currentPage?: number
  totalPages?: number
  selectedCategory?: string
  className?: string
}

export const AllArticles: React.FC<AllArticlesProps> = ({
  articles,
  categories,
  currentPage = 1,
  totalPages = 1,
  selectedCategory,
  className,
}) => {
  // 转换分类数据格式以兼容 CategorySidebar
  const categoryOptions = [
    { id: 'all', title: 'All', count: 0 },
    ...categories.map((cat) => ({
      id: cat.id.toString(),
      title: cat.title,
      count: 0, // 这里可以后续添加文章计数逻辑
    })),
  ]

  return (
    <section className={cn(className)}>
      <div className="mb-[60px]">
        <h2 className="!font-feature text-[54px]/[54px] font-medium text-black">All Articles</h2>
      </div>

      <div className="flex gap-[30px]">
        {/* 左侧分类筛选 */}
        <CategorySidebar
          categories={categoryOptions}
          selectedCategory={selectedCategory || 'all'}
          onCategoryChange={(categoryId) => {
            // 使用 URL 导航而不是本地状态
            const url = categoryId === 'all' ? '/blog' : `/blog?category=${categoryId}`
            window.location.href = url
          }}
          className="w-[240px] lg:sticky lg:top-8 lg:self-start"
        />

        {/* 右侧文章网格 */}
        <div className="flex-1">
          <ArticleGrid articles={articles} />

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination page={currentPage} totalPages={totalPages} basePath="/blog/page" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
