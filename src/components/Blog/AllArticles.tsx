'use client'
import React, { useState, useMemo } from 'react'
import { cn } from '@/utilities/cn'
import { CategorySidebar } from './CategorySidebar'
import { ArticleGrid } from './ArticleGrid'
import { Pagination } from '@/components/Pagination'
import type { Post, Category } from '@/payload-types'

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
  className
}) => {
  // 转换分类数据格式以兼容 CategorySidebar
  const categoryOptions = [
    { id: 'all', title: 'All', count: 0 },
    ...categories.map(cat => ({
      id: cat.id.toString(),
      title: cat.title,
      count: 0 // 这里可以后续添加文章计数逻辑
    }))
  ]

  return (
    <section className={cn('container mx-auto px-4 py-16', className)}>
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          All Articles
        </h2>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* 左侧分类筛选 */}
        <CategorySidebar
          categories={categoryOptions}
          selectedCategory={selectedCategory || 'all'}
          onCategoryChange={(categoryId) => {
            // 使用 URL 导航而不是本地状态
            const url = categoryId === 'all' ? '/blog' : `/blog?category=${categoryId}`
            window.location.href = url
          }}
          className="lg:sticky lg:top-8 lg:self-start"
        />

        {/* 右侧文章网格 */}
        <div className="flex-1">
          <ArticleGrid articles={articles} />

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                basePath="/blog/page"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
