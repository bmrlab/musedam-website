import React from 'react'
import { cn } from '@/utilities/cn'

import { ArticleGridSkeleton } from './ArticleGridSkeleton'
import { HeroSectionSkeletonContainer } from './HeroSectionSkeleton'
import { TopArticlesSkeleton } from './TopArticlesSkeleton'

interface BlogPageSkeletonProps {
  className?: string
  showHero?: boolean
  showTopArticles?: boolean
  showAllArticles?: boolean
}

export const BlogPageSkeleton: React.FC<BlogPageSkeletonProps> = ({
  className,
  showHero = true,
  showTopArticles = true,
  showAllArticles = true,
}) => {
  return (
    <div className={cn('min-h-screen w-full max-w-[1440px] bg-white', className)}>
      {/* Hero Section 骨架 */}
      {showHero && <HeroSectionSkeletonContainer count={2} />}

      {/* Top Articles 骨架 */}
      {showTopArticles && (
        <TopArticlesSkeleton className="mt-0 pb-[100px] md:mt-[60px]" count={3} />
      )}

      {/* All Articles 骨架 */}
      {showAllArticles && (
        <section className="px-6 pb-[60px] pt-0 md:p-20">
          {/* 标题骨架 */}
          <div className="mb-[60px]">
            <div className="h-[54px] w-[200px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>

          {/* 移动端分类选择器骨架 */}
          <div className="mb-6 block md:hidden">
            <div className="flex w-full items-center justify-between border-b border-black/10 pb-2">
              <div className="h-[20px] w-[80px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              <div className="size-6 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="flex gap-[30px]">
            {/* 左侧分类筛选骨架 - 仅桌面端显示 */}
            <aside className="sticky hidden w-[240px] md:block lg:sticky lg:top-8 lg:self-start">
              <div className="border-none">
                {/* 分类标题骨架 */}
                <div className="h-[20px] w-[80px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>

                {/* 分隔线 */}
                <div className="mb-6 mt-[10px] h-px w-full bg-[#E5E5E5]"></div>

                {/* 分类选项骨架 */}
                <nav className="max-h-[1087px] space-y-2 overflow-y-auto">
                  {/* "全部"选项骨架 */}
                  <div className="flex w-full items-center gap-2 rounded-md px-3 py-2">
                    <div className="size-[18px] animate-pulse rounded border-2 bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                      <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </div>
                    <div className="h-4 w-[60px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                      <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </div>
                  </div>

                  {/* 分类选项骨架 */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2"
                    >
                      <div className="size-[18px] animate-pulse rounded border-2 bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                        <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </div>
                      <div className="h-4 w-[80px] animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]">
                        <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>

            {/* 右侧文章网格骨架 */}
            <div className="md:height-[1047px] flex flex-1 flex-col items-center justify-between">
              <ArticleGridSkeleton count={9} />

              {/* 分页骨架 */}
              <div className="mt-8 hidden items-center gap-2 md:flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="size-10 animate-pulse rounded bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB]"
                  >
                    <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
