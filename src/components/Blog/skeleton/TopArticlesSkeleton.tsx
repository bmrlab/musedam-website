'use client'

import React from 'react'
import { cn } from '@/utilities/cn'

import { useBlogTranslation } from '@/app/i18n/client'

interface TopArticlesSkeletonProps {
  className?: string
  count?: number
}

export const TopArticlesSkeleton: React.FC<TopArticlesSkeletonProps> = ({
  className,
  count = 3,
}) => {
  const { t } = useBlogTranslation()
  return (
    <section className={cn(className)}>
      {/* 标题区域骨架 */}
      <div className="px-6 md:px-[80px]">
        <div className="hidden h-[38px] w-[280px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:block">
          <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        <h2 className="text-center !font-feature text-[38px]/[38px] font-medium text-black md:hidden md:text-start md:text-[54px]/[54px]">
          {t('article.top')}
        </h2>
      </div>

      {/* 文章列表骨架 */}
      <div
        className={cn(
          ' flex flex-col gap-6 px-6 pt-[30px]  md:gap-[30px]',
          'md:no-scrollbar md:mx-[calc(50.6%-50vw)] md:grid md:auto-cols-max md:grid-flow-col md:px-[max(80px,calc(50vw-50%+80px))] md:pt-[60px] ',
        )}
      >
        {Array.from({ length: count }).map((_, index) => (
          <TopArticleCardSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}

const TopArticleCardSkeleton: React.FC = () => {
  return (
    <div className="w-full overflow-hidden rounded-[14px] md:w-[520px] md:rounded-[20px]">
      {/* 图片区域骨架 */}
      <div className="relative aspect-[3/2] animate-pulse rounded-[14px] bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:rounded-[20px]">
        <div className="absolute inset-0 animate-shimmer rounded-[14px] bg-gradient-to-r from-transparent via-white/20 to-transparent md:rounded-[20px]"></div>
      </div>

      {/* 内容区域骨架 */}
      <div className="space-y-[10px] p-4 md:p-[30px]">
        {/* 分类标签骨架 */}
        <div className="h-[18px] w-[120px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
          <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* 标题骨架 */}
        <div className="space-y-3">
          <div className="h-6 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:h-7">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div className="h-6 w-3/4 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:h-7 md:w-1/2">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
