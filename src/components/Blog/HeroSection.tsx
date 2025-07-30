'use client'

import React from 'react'
import Image from 'next/image'
import type { Category, Post } from '@/payload-types'
import { cn } from '@/utilities/cn'

import Icons from '@/components/icon'
import { LocaleLink } from '@/components/LocalLink'
import { useBlogTranslation } from '@/app/i18n/client'

interface HeroSectionProps {
  article: Post
  className?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({ article, className }) => {
  const { t } = useBlogTranslation()
  return (
    <section
      className={cn(
        'flex w-full flex-col justify-between gap-10 md:flex-row md:gap-[120px]',
        className,
      )}
    >
      {/* 左侧内容 */}
      <div className="flex flex-1 flex-col gap-3">
        <p className="!font-euclid text-[14px] uppercase text-[#676C77]">
          {Array.isArray(article.categories) && article.categories.length > 0
            ? typeof article.categories[0] === 'object'
              ? (article.categories[0] as Category).title
              : ''
            : ''}
        </p>

        <LocaleLink href={`/blog/posts/${article.slug}`}>
          <h1 className="!font-euclid text-[40px] font-semibold leading-[41.6px] text-black">
            {article.title}
          </h1>
        </LocaleLink>

        <p className="mt-1 flex-1 !font-euclid text-lg leading-relaxed text-gray-600">
          {article.meta?.description ||
            (typeof article.content === 'object' &&
              article.content?.root?.children?.[0]?.children?.[0]?.text) ||
            ''}
        </p>

        <LocaleLink
          href={`/blog/posts/${article.slug}`}
          className="group inline-flex items-center gap-3 font-medium text-gray-900 transition-colors hover:text-gray-700"
        >
          <span className="!font-euclid text-[18px] font-medium leading-[30px] underline underline-offset-[6px]">
            {t('readMore')}
          </span>

          <div className="transition-transform group-hover:translate-x-1">
            <Icons.arrowRightLong width={24} height={24} />
          </div>
        </LocaleLink>
      </div>

      {/* 右侧图片区域 */}
      <LocaleLink href={`/blog/posts/${article.slug}`} className="relative flex-1">
        <div className="aspect-[4/3] max-h-[440px]  rounded-[14px]">
          {/* 如果有 meta.image，显示实际图片，否则显示默认背景 */}
          {article.meta?.image &&
          typeof article.meta.image === 'object' &&
          'url' in article.meta.image ? (
            <Image
              src={article.meta.image.url ?? ''}
              alt={article.meta.image.alt || article.title}
              fill
              className="rounded-[14px] object-cover"
            />
          ) : (
            <div className="size-full rounded-2xl bg-gradient-to-br from-yellow-200 to-yellow-300 opacity-80"></div>
          )}
        </div>
      </LocaleLink>
    </section>
  )
}
