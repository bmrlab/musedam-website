'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { cn } from '@/utilities/cn'
import { AnimatePresence, motion } from 'framer-motion'

import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/Blog/category/CategorySidebar'
import Icons from '@/components/icon'
import { useBlogTranslation } from '@/app/i18n/client'

interface CategorySelectorProps {
  categories: { id: string; title: string }[]
  selectedCategories: string[]
  onCategoryChange?: (categories: string[]) => void
  className?: string
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  className,
}) => {
  const { t } = useBlogTranslation()

  const [isOpen, setIsOpen] = useState(false)
  const [tempSelected, setTempSelected] = useState<string[]>(selectedCategories)

  // 控制body滚动
  useEffect(() => {
    if (isOpen) {
      // 禁用body滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 恢复body滚动
      document.body.style.overflow = ''
    }

    // 清理函数，在组件卸载时恢复滚动
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // 处理复选框变化
  const handleCheckboxChange = useCallback(
    (categoryId: string, checked: boolean) => {
      if (checked) {
        setTempSelected((prev) => [...prev, categoryId])
      } else {
        setTempSelected((prev) => prev.filter((id) => id !== categoryId))
      }
    },
    [setTempSelected],
  )

  const handleClose = useCallback(() => {
    onCategoryChange?.(tempSelected)
    setIsOpen(false)
  }, [onCategoryChange, tempSelected, setIsOpen])

  return (
    <div className={cn('', className)}>
      {/* 触发器 */}
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between border-b border-black/10 pb-2"
        onClick={() => setIsOpen(true)}
        aria-label="Open category selector"
      >
        <span className="!font-euclid text-[20px] font-medium text-black">
          {t('category.title')}
        </span>
        <div className="flex size-6 items-center justify-center">
          <Icons.caretDown className="size-4 text-black/80" />
        </div>
      </button>

      {/* 模态框 */}
      <AnimatePresence>
        {isOpen && (
          <div className="pointer-events-auto fixed inset-0 z-50 bg-black/50" onClick={handleClose}>
            <motion.div
              className="absolute inset-x-0 bottom-0 rounded-t-[20px] bg-white pt-6"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'tween',
                duration: 0.3,
                ease: 'easeOut',
              }}
            >
              {/* 头部 */}
              <div className="mx-6 flex items-center justify-between border-b border-black/10 pb-2">
                <span className="text-[20px] font-medium text-black">Category</span>
                <button onClick={handleClose} className="flex size-6 items-center justify-center">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.1315 0.879883H0.868974C0.561161 0.879883 0.389286 1.20488 0.579911 1.42676L5.71116 7.37676C5.85804 7.54707 6.14085 7.54707 6.28929 7.37676L11.4205 1.42676C11.6112 1.20488 11.4393 0.879883 11.1315 0.879883Z"
                      fill="black"
                      fillOpacity="0.8"
                    />
                  </svg>
                </button>
              </div>

              {/* 分类列表 */}
              <div className="max-h-[464px] space-y-6 overflow-y-auto py-6 [&>div]:px-6">
                {/* All 选项 */}
                <div className="flex h-5 items-center gap-2">
                  <Checkbox
                    id="category-all"
                    checked={tempSelected.length === 0}
                    onChange={() => setTempSelected([])}
                  />
                  <Label
                    htmlFor="category-all"
                    className="cursor-pointer text-[16px] font-medium leading-none text-[#262626]"
                  >
                    {t('category.all')}
                  </Label>
                </div>

                {/* 分类选项 */}
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div className="flex h-5 items-center gap-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={tempSelected.includes(category.id)}
                        onChange={(e) => handleCheckboxChange(category.id, e)}
                      />
                    </div>
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="cursor-pointer text-[16px] leading-none text-[#262626]"
                    >
                      {category.title}
                    </Label>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
