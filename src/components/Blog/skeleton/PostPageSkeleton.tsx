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
        'mx-auto min-h-[calc(100vh-56px-68px)] w-full max-w-[1440px] bg-white md:min-h-[calc(100vh-70px)]',
        className,
      )}
    >
      {/* PostHero 骨架 */}
      <div className="bg-white pb-[40px] pt-[60px] md:pb-[60px] md:pt-20">
        <div className="px-6 md:px-20">
          <div className="mx-auto max-w-[1000px]">
            <div className="flex flex-col">
              {/* 阅读时间和发布信息骨架 */}
              <div className="flex items-center gap-3">
                <div className="h-4 w-[80px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                <span className="text-[14px] text-[rgba(36,36,36,0.7)] opacity-60">·</span>
                <div className="h-4 w-[100px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                {/* 标题骨架 */}
                <div className="space-y-3">
                  <div className="h-10 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:h-[54px]">
                    <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                  <div className="h-10 w-3/4 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:h-[54px]">
                    <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </div>

                {/* 描述骨架 */}
                <div className="space-y-2">
                  <div className="h-6 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:h-7">
                    <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                  <div className="h-6 w-2/3 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:h-7">
                    <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* 分类标签骨架 */}
              <div className="mt-4">
                <div className="h-8 w-[120px] animate-pulse rounded-full bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                  <div className="h-full animate-shimmer rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>

              {/* 特色图片骨架 */}
              <div className="relative mt-10 aspect-[2/1] w-full animate-pulse rounded-[16px] bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:mt-[60px]">
                <div className="size-full animate-shimmer rounded-[16px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 文章内容骨架 */}
      <div className="px-6 pb-[60px] md:px-20 md:pb-[120px]">
        <div className="mx-auto max-w-[720px]">
          {/* 文章段落骨架 */}
          <div className="space-y-6">
            {/* 第一段 */}
            <div className="space-y-3">
              <div className="h-5 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              <div className="h-5 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              <div className="h-5 w-3/4 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>

            {/* 小标题骨架 */}
            <div className="h-8 w-1/2 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* 第二段 */}
            <div className="space-y-3">
              <div className="h-5 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              <div className="h-5 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              <div className="h-5 w-5/6 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>

            {/* 第三段 */}
            <div className="space-y-3">
              <div className="h-5 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              <div className="h-5 w-4/5 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* 相关文章骨架 */}
          <div className="mt-16 border-t border-gray-200 pt-16">
            {/* 相关文章标题骨架 */}
            <div className="mb-8 h-8 w-[200px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* 相关文章列表骨架 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="block overflow-hidden rounded-[14px] md:rounded-[12px]">
                  {/* 图片骨架 */}
                  <div className="relative aspect-[3/2] animate-pulse rounded-[14px] bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] md:rounded-[12px]">
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>

                  {/* 内容骨架 */}
                  <div className="space-y-2 px-[10px] pb-[20px] pt-[25px]">
                    {/* 分类标签骨架 */}
                    <div className="h-4 w-[120px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                      <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </div>

                    {/* 标题骨架 */}
                    <div className="space-y-2">
                      <div className="h-4 w-full animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                        <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </div>
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                        <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
