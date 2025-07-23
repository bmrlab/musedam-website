'use client'

import React, { useState } from 'react'
import type { Category } from '@/payload-types'
import { cn } from '@/utilities/cn'

import Icons from '@/components/icon'

interface CategorySelectorProps {
  categories?: Category[]
  selectedCategories?: number[]
  onCategoryChange?: (categories: number[]) => void
  className?: string
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempSelected, setTempSelected] = useState<number[]>(selectedCategories)

  // 处理复选框变化
  const handleCheckboxChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setTempSelected((prev) => [...prev, categoryId])
    } else {
      setTempSelected((prev) => prev.filter((id) => id !== categoryId))
    }
  }

  // 应用选择并关闭模态框
  const handleApply = () => {
    onCategoryChange?.(tempSelected)
    setIsOpen(false)
  }

  // 关闭模态框时重置临时选择
  const handleClose = () => {
    setTempSelected(selectedCategories)
    setIsOpen(false)
  }

  // 获取显示文本
  const getDisplayText = () => {
    if (selectedCategories.length === 0) return 'Category'
    if (selectedCategories.length === 1) {
      const category = categories.find((cat) => cat.id === selectedCategories[0])
      return category?.title || 'Category'
    }
    return `${selectedCategories.length} Categories`
  }

  return (
    <div className={cn('', className)}>
      {/* 触发器 */}
      <div
        className="flex cursor-pointer items-center justify-between border-b border-black/10 pb-2"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-[20px] font-medium text-black">{getDisplayText()}</span>
        <div className="flex size-6 items-center justify-center">
          <Icons.caretDown className="size-4 text-black/80" />
        </div>
      </div>

      {/* 模态框 */}
      {isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/50" onClick={handleClose}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[20px] bg-white  pt-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="mx-6 flex items-center justify-between border-b border-black/10 pb-2">
              <span className="text-[20px] font-medium text-black">Category</span>
              <button onClick={handleClose} className="flex size-6 items-center justify-center">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.532 4.5L19.9999 5.96788L13.4679 12.4999L20 19.032L18.5321 20.4999L12 13.9678L5.46788 20.4999L4 19.032L10.5321 12.4999L4.00013 5.96788L5.46801 4.5L12 11.032L18.532 4.5Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>

            {/* 分类列表 */}
            <div className="max-h-[464px] space-y-6 overflow-y-auto py-6 [&>div]:px-6">
              {/* All 选项 */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="category-all"
                    checked={tempSelected.length === 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTempSelected([])
                      }
                    }}
                    className="peer size-[18px] appearance-none rounded-sm border-2 border-black/20 checked:border-black checked:bg-white"
                  />
                  {tempSelected.length === 0 && (
                    <svg
                      className="pointer-events-none absolute left-1 top-1.5 size-2.5"
                      viewBox="0 0 11 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4L4 7L10 1"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <label
                  htmlFor="category-all"
                  className="cursor-pointer text-[16px] font-medium text-[#262626]"
                >
                  All
                </label>
              </div>

              {/* 分类选项 */}
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={tempSelected.includes(category.id)}
                      onChange={(e) => handleCheckboxChange(category.id, e.target.checked)}
                      className="peer size-[18px] appearance-none rounded-sm border-2 border-black/20 checked:border-black checked:bg-white"
                    />
                    {tempSelected.includes(category.id) && (
                      <svg
                        className="pointer-events-none absolute left-1 top-1.5 size-2.5"
                        viewBox="0 0 11 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L4 7L10 1"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <label
                    htmlFor={`category-${category.id}`}
                    className="cursor-pointer text-[16px] text-[#262626]"
                  >
                    {category.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
