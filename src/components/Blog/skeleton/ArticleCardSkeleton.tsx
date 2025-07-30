import React from 'react'
import { cn } from '@/utilities/cn'

interface ArticleCardSkeletonProps {
  className?: string
  variant?: 'default' | 'featured'
}

export const ArticleCardSkeleton: React.FC<ArticleCardSkeletonProps> = ({
  className,
  variant = 'default',
}) => {
  return (
    <div className={cn('block overflow-hidden rounded-[20px]', className)}>
      {/* 图片骨架 */}
      <div className="relative aspect-[3/2] animate-pulse rounded-[20px] bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* 内容骨架 */}
      <div
        className={cn(
          variant === 'featured'
            ? 'space-y-[10px] p-4 md:p-[30px]'
            : 'space-y-2 px-[10px] pb-[20px] pt-[25px]',
        )}
      >
        {/* 分类标签骨架 */}
        <div className="h-4 w-[120px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
          <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* 标题骨架 */}
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div className="h-4 w-[200px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
