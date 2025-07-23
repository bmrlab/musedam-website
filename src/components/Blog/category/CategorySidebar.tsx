'use client'

import React, { useState } from 'react'
import type { MockCategory } from '@/data/mockBlogData'
import { cn } from '@/utilities/cn'

import { Label } from '@/components/ui/label'
import { Divider } from '@/components/StyleWrapper/Container'

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
  className,
}) => {
  return (
    <aside className={cn('w-full shrink-0 ', className)}>
      <div className="border-none">
        <h3 className="!font-euclid text-[20px] font-medium text-black">Category</h3>

        <Divider className="mb-6 mt-[10px] border-[#E5E5E5]" />
        <nav className="space-y-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id

            return (
              <div
                key={category.id}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors',
                )}
              >
                <Checkbox
                  id={category.id}
                  checked={isSelected}
                  onChange={() => onCategoryChange(category.id)}
                  className="border-2 border-none border-[#00000033]"
                />
                <Label
                  htmlFor={category.id}
                  className="cursor-pointer !font-euclid  text-[16px] text-[#262626]"
                >
                  {category.title}
                </Label>
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

interface CheckboxProps {
  id: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  onChange,
  className = '',
}) => {
  const [isChecked, setIsChecked] = useState(checked)

  const handleChange = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    onChange?.(newChecked)
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <button
        id={id}
        type="button"
        onClick={handleChange}
        className={cn(
          'relative flex size-[18px] items-center justify-center border-2 bg-white transition-all duration-300',
          isChecked ? 'border-black' : 'border-[#CCC] bg-white hover:border-gray-400',
        )}
      >
        {/* 选中状态的对勾 */}
        {isChecked && (
          <svg
            width="11"
            height="8"
            viewBox="0 0 11 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.41747 7.60407L4.39985 7.62169L0 3.22185L1.43268 1.78917L4.41752 4.77402L9.19154 0L10.6242 1.43268L4.43514 7.62175L4.41747 7.60407Z"
              fill="black"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
