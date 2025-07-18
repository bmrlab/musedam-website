'use client'
import React, { useState } from 'react'
import { cn } from '@/utilities/cn'
import type { MockCategory } from '@/data/mockBlogData'

interface CategorySidebarProps {
  categories: MockCategory[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  className?: string
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className
}) => {
  return (
    <aside className={cn('w-full shrink-0 lg:w-64', className)}>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Category
        </h3>

        <nav className="space-y-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors',
                  isSelected
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <span className="text-sm font-medium">
                  {category.title}
                </span>
                {category.id !== 'all' && (
                  <span className={cn(
                    'rounded-full px-2 py-1 text-xs',
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  )}>
                    {category.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
