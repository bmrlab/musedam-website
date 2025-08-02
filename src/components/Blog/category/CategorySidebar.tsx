'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/utilities/cn'

import { Label } from '@/components/ui/label'
import { Divider } from '@/components/StyleWrapper/Container'
import { useBlogTranslation } from '@/app/i18n/client'

interface CategorySidebarProps {
  categories: { id: string; title: string }[]
  selectedCategory: string[]
  onCategoryChange: (categoryId: string[]) => void
  onClearAll?: () => void
  className?: string
  isLoading?: boolean
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
  isLoading = false,
}) => {
  const { t } = useBlogTranslation()
  const [localSelectedCategory, setLocalSelectedCategory] = useState<string[]>(selectedCategory)

  // 同步外部状态变化
  useEffect(() => {
    setLocalSelectedCategory(selectedCategory)
  }, [selectedCategory, localSelectedCategory])

  const handleCategoryToggle = (categoryId: string) => {
    const isCurrentlySelected = localSelectedCategory.includes(categoryId)
    const newSelection = isCurrentlySelected
      ? localSelectedCategory.filter((id) => id !== categoryId)
      : [...localSelectedCategory, categoryId]

    // 立即更新本地状态，提供即时反馈
    setLocalSelectedCategory(newSelection)

    // 异步更新外部状态
    onCategoryChange(newSelection)
  }

  const handleAllCategoryToggle = (checked: boolean) => {
    if (checked) {
      // 选中"全部"时，清空所有分类选择
      setLocalSelectedCategory([])
      onCategoryChange([])
    }
    // 注意：当checked为false时，说明用户想要取消"全部"选择
    // 但由于"全部"的逻辑是基于其他选项为空，所以这里不需要特殊处理
    // 用户应该通过选择具体分类来取消"全部"状态
  }

  return (
    <aside className={cn('w-full shrink-0 ', className)}>
      <div className="border-none">
        <h3 className="!font-euclid text-[20px] font-medium text-black">{t('category.title')}</h3>

        <Divider className="mb-6 mt-[10px] border-[#E5E5E5]" />
        <nav className="max-h-[1087px] space-y-2 overflow-y-auto">
          <div
            key="category-all"
            className={cn('flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors')}
          >
            <Checkbox
              id="category-all"
              checked={localSelectedCategory.length === 0}
              onChange={(checked) => handleAllCategoryToggle(checked)}
              className="border-2 border-none border-[#00000033]"
              disabled={isLoading}
            />
            <Label
              htmlFor="category-all"
              className="cursor-pointer !font-euclid  text-[16px] text-[#262626]"
            >
              {t('category.all')}
            </Label>
          </div>

          {categories.map((category) => (
            <div
              key={category.id}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors',
                isLoading && 'pointer-events-none opacity-50',
              )}
            >
              <Checkbox
                id={category.id}
                checked={localSelectedCategory.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="border-2 border-none border-[#00000033]"
                disabled={isLoading}
              />
              <Label
                htmlFor={category.id}
                className={cn(
                  'cursor-pointer !font-euclid text-[16px] text-[#262626]',
                  isLoading && 'cursor-not-allowed',
                )}
              >
                {category.title}
              </Label>
            </div>
          ))}
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
  disabled?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  onChange,
  className = '',
  disabled = false,
}) => {
  const handleChange = () => {
    if (disabled) return
    const newChecked = !checked
    onChange?.(newChecked)
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <button
        id={id}
        type="button"
        onClick={handleChange}
        disabled={disabled}
        className={cn(
          'relative flex size-[18px] items-center justify-center border-2 bg-white transition-all duration-300',
          checked ? 'border-black' : 'border-[#CCC] bg-white hover:border-gray-400',
          disabled && 'cursor-not-allowed opacity-50 hover:border-[#CCC]',
        )}
      >
        {/* 选中状态的对勾 */}
        {checked && (
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
