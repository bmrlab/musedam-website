'use client'

import React from 'react'
import { cn } from '@/utilities/cn'

interface PostPageSkeletonProps {
  className?: string
}

export const PostPageSkeleton: React.FC<PostPageSkeletonProps> = ({ className }) => {
  return (
    <article
      className={cn(
        'mx-auto min-h-[calc(100vh-56px-68px)] w-full max-w-[1440px] overflow-hidden bg-white pb-[60px] md:min-h-[calc(100vh-70px)] md:pb-[120px]',
        className,
      )}
    >
      {/* PostHero 骨架 */}
      <div className="bg-white  pt-[60px]  md:pt-20">
        <div className="px-6 md:px-20">
          <div className="mx-auto max-w-[1000px]">
            <div className="flex flex-col gap-10 md:gap-[60px]">
              {/* 顶部标签骨架 */}
              <div className="flex flex-col gap-4">
                <div className="h-5 w-[180px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>

                {/* 文本行骨架 */}
                <div className="flex flex-col gap-3">
                  <div className="h-6 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                    <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                  <div className="h-6 w-2/5 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:w-1/2">
                    <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* 特色图片骨架 */}
              <div className="relative h-[184px] w-full animate-pulse rounded-[14px] bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] opacity-40 md:aspect-[2/1] md:h-auto md:rounded-[20px] md:opacity-100">
                <div className="size-full animate-shimmer rounded-[14px] bg-gradient-to-r from-transparent via-white/20 to-transparent md:rounded-[20px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 文章内容骨架 */}
      <div className="mt-10 px-6 md:mt-[60px] md:px-20">
        <div className="mx-auto max-w-[720px]">
          {/* 文章段落骨架 */}
          <div className="flex flex-col gap-3">
            <div className="h-6 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
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
        </div>
      </div>
    </article>
  )
}
