import React from 'react'
import { cn } from '@/utilities/cn'

interface HeroSectionSkeletonProps {
  className?: string
}

export const HeroSectionSkeleton: React.FC<HeroSectionSkeletonProps> = ({ className }) => {
  return (
    <section
      className={cn(
        'flex w-full flex-col justify-between gap-10 md:flex-row md:gap-[120px]',
        className,
      )}
    >
      {/* 左侧内容骨架 */}
      <div className="flex flex-1 flex-col gap-3">
        {/* 分类标签骨架 */}
        <div className="h-4 w-[120px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
          <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* 标题骨架 */}
        <div className="space-y-3">
          <div className="h-10 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:h-12">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div className="h-10 w-4/5 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:h-12">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>

        {/* 描述文本骨架 */}
        <div className="mt-1 flex-1 space-y-2">
          <div className="h-6 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div className="h-6 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div className="h-6 w-3/4 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>

        {/* 阅读更多按钮骨架 */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-7 w-[130px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          <div className="size-6 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* 右侧图片区域骨架 */}
      <div className="relative flex-1">
        <div className="aspect-[4/3] max-h-[440px] animate-pulse rounded-[14px] bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
          <div className="size-full animate-shimmer rounded-[14px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>
    </section>
  )
}

interface HeroSectionSkeletonContainerProps {
  count?: number
  className?: string
}

export const HeroSectionSkeletonContainer: React.FC<HeroSectionSkeletonContainerProps> = ({
  count = 2,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-20 px-6 py-[60px] md:p-[80px] [&>section:nth-child(even)]:md:flex-row-reverse',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <HeroSectionSkeleton key={index} />
      ))}
    </div>
  )
}
