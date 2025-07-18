'use client'
import React, { useState, useMemo } from 'react'
import { cn } from '@/utilities/cn'
import { CategorySidebar } from './CategorySidebar'
import { ArticleGrid } from './ArticleGrid'
import type { MockArticle, MockCategory } from '@/data/mockBlogData'

interface AllArticlesProps {
  articles: MockArticle[]
  categories: MockCategory[]
  className?: string
}

export const AllArticles: React.FC<AllArticlesProps> = ({
  articles,
  categories,
  className
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 根据选中的分类筛选文章
  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') {
      return articles
    }

    const categoryTitle = categories.find(cat => cat.id === selectedCategory)?.title.toUpperCase()
    return articles.filter(article =>
      article.category === categoryTitle ||
      article.category.includes(categoryTitle || '')
    )
  }, [articles, categories, selectedCategory])

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
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          className="lg:sticky lg:top-8 lg:self-start"
        />

        {/* 右侧文章网格 */}
        <ArticleGrid articles={filteredArticles} />
      </div>
    </section>
  )
}
