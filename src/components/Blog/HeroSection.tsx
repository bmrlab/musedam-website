import React from 'react'
import { cn } from '@/utilities/cn'
import type { Post } from '@/payload-types'

interface HeroSectionProps {
  article: Post
  className?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({ article, className }) => {
  return (
    <section className={cn('container mx-auto px-4 py-12', className)}>
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* 左侧内容 */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="text-lg leading-relaxed text-gray-600">
            {article.meta?.description ||
             (typeof article.content === 'object' && article.content?.root?.children?.[0]?.children?.[0]?.text) ||
             'Discover insights and best practices in this featured article.'}
          </p>

          <a
            href={`/posts/${article.slug}`}
            className="group inline-flex items-center font-medium text-gray-900 transition-colors hover:text-gray-700"
          >
            <span>Read More</span>
            <svg
              className="ml-2 size-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* 右侧图片区域 */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl">
            {/* 如果有 meta.image，显示实际图片，否则显示默认背景 */}
            {article.meta?.image && typeof article.meta.image === 'object' && 'url' in article.meta.image ? (
              <img
                src={article.meta.image.url ?? ''}
                alt={article.meta.image.alt || article.title}
                className="size-full rounded-2xl object-cover"
              />
            ) : (
              <div className="size-full rounded-2xl bg-gradient-to-br from-yellow-200 to-yellow-300 opacity-80"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
