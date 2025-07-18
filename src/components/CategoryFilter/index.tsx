'use client'
import { cn } from '@/utilities/cn'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import type { Category } from '@/payload-types'

export type CategoryFilterProps = {
  categories: Category[]
  className?: string
  basePath?: string // 支持不同的基础路径
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  className,
  basePath = '/blog'
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams?.get('category')

  const handleCategoryChange = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams?.toString() || '')

    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }

    const queryString = params.toString()
    const url = queryString ? `${basePath}?${queryString}` : basePath
    router.push(url)
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <button
        onClick={() => handleCategoryChange(null)}
        className={cn(
          'rounded-full px-4 py-2 text-sm font-medium transition-colors',
          !currentCategory
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        全部
      </button>

      {categories.map((category) => {
        const isActive = currentCategory === category.id.toString()

        return (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id.toString())}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {category.title}
          </button>
        )
      })}
    </div>
  )
}
