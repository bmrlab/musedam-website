'use client'

import React, { startTransition, useEffect, useState } from 'react'
import { getPosts } from '@/data/blog'
import type { Category, Post } from '@/payload-types'
import { cn } from '@/utilities/cn'

import { AllArticlesPagination } from '@/components/Blog/all-articles/pagination'

import { ArticleGrid } from '../ArticleGrid'
import { CategorySelector } from '../category/CategorySelector'
import { CategorySidebar } from '../category/CategorySidebar'

interface AllArticlesProps {
  articles: Post[]
  categories: Category[]
  currentPage?: number
  totalPages?: number
  selectedCategory?: string
  className?: string
}

export const AllArticles: React.FC<AllArticlesProps> = ({
  articles: initialArticles,
  categories,
  currentPage: initialPage = 1,
  totalPages = 1,
  selectedCategory,
  className,
}) => {
  const [articles, setArticles] = useState(initialArticles)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)

  useEffect(() => {
    startTransition(async () => {
      const posts = await getPosts({
        page: currentPage,
        category: [],
      })
      console.log('posts', posts)
      setArticles(posts.docs)
    })
  }, [currentPage])

  // 移动端分类选择状态
  const [mobileSelectedCategories, setMobileSelectedCategories] = useState<number[]>(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryId = parseInt(selectedCategory, 10)
      return !isNaN(categoryId) ? [categoryId] : []
    }
    return []
  })

  // 转换分类数据格式以兼容 CategorySidebar
  const categoryOptions = [
    { id: 'all', title: 'All', count: 0 },
    ...categories.map((cat) => ({
      id: cat.id.toString(),
      title: cat.title,
      count: 0, // 这里可以后续添加文章计数逻辑
    })),
  ]

  // 处理移动端分类变化
  const handleMobileCategoryChange = (newCategories: number[]) => {
    setMobileSelectedCategories(newCategories)

    // 更新URL
    if (newCategories.length === 0) {
      window.location.href = '/blog'
    } else {
      window.location.href = `/blog?category=${newCategories[0]}`
    }
  }

  return (
    <section className={cn(className)}>
      <div className="mb-[60px]">
        <h2 className="!font-feature text-[54px]/[54px] font-medium text-black">All Articles</h2>
      </div>

      {/* 移动端分类选择器 */}
      <div className="mb-6 block md:hidden">
        <CategorySelector
          categories={categories}
          selectedCategories={mobileSelectedCategories}
          onCategoryChange={handleMobileCategoryChange}
        />
      </div>

      <div className="flex gap-[30px]">
        {/* 左侧分类筛选 - 仅桌面端显示 */}
        <CategorySidebar
          categories={categoryOptions}
          selectedCategory={selectedCategory || 'all'}
          onCategoryChange={(categoryId) => {
            // 使用 URL 导航而不是本地状态
            const url = categoryId === 'all' ? '/blog' : `/blog?category=${categoryId}`
            window.location.href = url
          }}
          className="sticky hidden w-[240px] md:block lg:sticky lg:top-8 lg:self-start"
        />

        {/* 右侧文章网格 */}
        <div className="md:height-[1047px] flex flex-1 flex-col items-center justify-between">
          <ArticleGrid articles={articles} />

          {/* 分页 */}
          {totalPages > 1 && (
            <AllArticlesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              gotoPrevPage={() => setCurrentPage(currentPage - 1)}
              gotoNextPage={() => setCurrentPage(currentPage + 1)}
              gotoFirstPage={() => setCurrentPage(1)}
              gotoLastPage={() => setCurrentPage(totalPages)}
            />
          )}
        </div>
      </div>
    </section>
  )
}
