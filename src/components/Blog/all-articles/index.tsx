'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { Category, Post } from '@/payload-types'
import { cn } from '@/utilities/cn'

import { useBlogArticles } from '@/hooks/useBlogArticles'
import { AllArticlesPagination } from '@/components/Blog/all-articles/pagination'
import { useUrlQuery } from '@/components/Blog/all-articles/useUrlQuery'
import { useBlogTranslation } from '@/app/i18n/client'

import { CategorySelector } from '../category/CategorySelector'
import { CategorySidebar } from '../category/CategorySidebar'
import { ArticleGrid } from './ArticleGrid'

interface AllArticlesProps {
  articles: Post[]
  categories: Category[]
  currentPage?: number
  totalPages?: number
  selectedCategory: string[]
  className?: string
}

export const AllArticles: React.FC<AllArticlesProps> = ({
  articles: initialArticles,
  categories,
  currentPage: initialCurrentPage = 1,
  totalPages: initialTotalPages = 1,
  selectedCategory: initialSelectedCategory,
  className,
}) => {
  const { t } = useBlogTranslation()
  const { routeWithQuery, routeWithQueryAndRemove, routeWithRemove } = useUrlQuery()

  // 维护本地的selectedCategory状态
  const [selectedCategory, setSelectedCategory] = useState<string[]>(initialSelectedCategory)

  // 只在组件挂载时同步初始状态，避免后续冲突
  useEffect(() => {
    setSelectedCategory(initialSelectedCategory)
  }, [])

  // 使用自定义Hook管理文章数据
  const {
    articles,
    totalPages,
    currentPage,
    isLoading,
    updateArticles,
    setCurrentPage: setHookCurrentPage,
  } = useBlogArticles({
    initialData: initialArticles,
    initialTotalPages,
    initialCurrentPage,
  })

  const setCurrentPage = useCallback(
    (pageNumber: number) => {
      routeWithQuery([{ name: 'page', value: String(pageNumber) }])
      setHookCurrentPage(pageNumber)
      updateArticles(selectedCategory, pageNumber)
    },
    [routeWithQuery, selectedCategory, setHookCurrentPage, updateArticles],
  )

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        id: cat.id.toString(),
        title: cat.title,
      })),
    [categories],
  )

  const handleCategoryChange = useCallback(
    (categoryId: string[]) => {
      // 立即更新本地状态
      setSelectedCategory(categoryId)

      // 更新URL参数
      if (categoryId.length === 0) {
        routeWithRemove(['category'])
      } else {
        routeWithQueryAndRemove({
          query: [{ name: 'category', value: categoryId.join(',') }],
          remove: ['page'],
        })
      }

      // 更新文章数据
      updateArticles(categoryId, 1)
    },
    [routeWithRemove, routeWithQueryAndRemove, updateArticles],
  )

  // 注意：不需要useEffect来同步selectedCategory变化
  // 因为数据更新已经在handleCategoryChange中处理

  return (
    <section className={cn(className)}>
      <div className="mb-[60px]">
        <h2 className="!font-feature text-[54px]/[54px] font-medium text-black">
          {t('article.all')}
        </h2>
      </div>

      {/* 移动端分类选择器 */}
      <div className="mb-6 block md:hidden">
        <CategorySelector
          categories={categoryOptions}
          selectedCategories={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <div className="flex gap-[30px]">
        {/* 左侧分类筛选 - 仅桌面端显示 */}
        <CategorySidebar
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
          className="sticky hidden w-[240px] md:block lg:sticky lg:top-8 lg:self-start"
        />

        {/* 右侧文章网格 */}
        <div className="md:height-[1047px] flex flex-1 flex-col items-center justify-between">
          <ArticleGrid articles={articles} isLoading={isLoading} />

          {/* 分页 */}
          {totalPages > 1 && (
            <AllArticlesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              gotoPrevPage={() => setCurrentPage(currentPage - 1)}
              gotoNextPage={() => setCurrentPage(currentPage + 1)}
              gotoFirstPage={() => setCurrentPage(1)}
              gotoLastPage={() => setCurrentPage(totalPages)}
              className="hidden md:flex"
            />
          )}
        </div>
      </div>
    </section>
  )
}
