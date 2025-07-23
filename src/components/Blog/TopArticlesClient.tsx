'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category, Post } from '@/payload-types'

import { TopArticles } from './TopArticles'

interface TopArticlesClientProps {
  articles: Post[]
  categories: Category[]
  className?: string
}

export const TopArticlesClient: React.FC<TopArticlesClientProps> = ({
  articles,
  categories,
  className,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  // 从URL参数初始化选中的分类
  useEffect(() => {
    const categoryParam = searchParams?.get('category')
    if (categoryParam) {
      const categoryId = parseInt(categoryParam, 10)
      if (!isNaN(categoryId)) {
        setSelectedCategories([categoryId])
      }
    } else {
      setSelectedCategories([])
    }
  }, [searchParams])

  // 处理分类变化
  const handleCategoryChange = (newCategories: number[]) => {
    setSelectedCategories(newCategories)

    // 更新URL参数
    const params = new URLSearchParams(searchParams?.toString())

    if (newCategories.length === 0) {
      params.delete('category')
    } else if (newCategories.length === 1) {
      params.set('category', newCategories[0].toString())
    } else {
      // 如果选择了多个分类，暂时只使用第一个
      // 后续可以扩展支持多分类查询
      params.set('category', newCategories[0].toString())
    }

    const newUrl = params.toString() ? `/blog?${params.toString()}` : '/blog'
    router.push(newUrl)
  }

  return (
    <TopArticles
      articles={articles}
      categories={categories}
      selectedCategories={selectedCategories}
      onCategoryChange={handleCategoryChange}
      className={className}
    />
  )
}
