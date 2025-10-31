import { cache } from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { BlogSEO } from '@/components/SEO/BlogSEO'
import { seoTranslation, ssTranslation } from '@/app/i18n'

import PageClient from './page.client'

// Disable caching to ensure content real-time updates
export const dynamic = 'force-dynamic'

// Pre-generate static pages for popular articles to improve SEO and performance
// export async function generateStaticParams() {
//   try {
//     const payload = await getPayload({ config: configPromise })

//     // Get top 20 popular articles for pre-generation
//     const posts = await payload.find({
//       collection: 'posts',
//       draft: false,
//       limit: 20,
//       overrideAccess: false,
//       sort: '-publishedAt', // Sort by publish date, prioritize latest articles
//     })

//     const params = posts.docs
//       .filter((post) => post.slug) // Filter out articles without slug
//       .map(({ slug }) => ({
//         slug: slug!,
//         lng: process.env.DEPLOY_REGION === 'mainland' ? 'zh-CN' : 'en-US'
//       }))

//     // Keep log messages in English to avoid language dependency issues during build
//     console.log(`Pre-generated ${params.length} popular articles`)
//     return params
//   } catch (error) {
//     console.error('Failed to pre-generate articles:', error)
//     return [] // Return empty array on failure, doesn't affect page rendering
//   }
// }

type Args = {
  params: Promise<{ lng: string; slug?: string }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { lng, slug = '' } = await paramsPromise
  const { t: seoT } = await seoTranslation(paramsPromise)
  const { t: blogT } = await ssTranslation(lng, 'blog')
  const url = '/blog/' + slug

  const post = await queryPostBySlug({ slug, lng })

  if (!post) return <PayloadRedirects url={url} />

  // Helper function to get keywords based on language
  const getKeywords = () => {
    if (lng === 'zh-CN') {
      return ['数字资产管理', 'AI技术', '团队协作', '创意工作流']
    }
    return ['Digital Asset Management', 'AI Technology', 'Team Collaboration', 'Creative Workflow']
  }

  const keywords = getKeywords()



  // 计算阅读时间（简单估算：每分钟200字）
  const getReadingTime = (content: any): number => {
    if (!content || typeof content !== 'object') return 5

    // 简单的字数统计逻辑
    const textContent = JSON.stringify(content).replace(/[^\w\s]/gi, '')
    const wordCount = textContent.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)
    return readingTime
  }

  return (
    <>
      <BlogSEO
        title={post.meta?.title || blogT('title')}
        description={post.meta?.description || blogT('description')}
        url={`/blog/${slug}`}
        image={typeof post.meta?.image === 'object' && post.meta.image?.url ? post.meta.image.url : '/assets/logo.svg'}
        socialImage={typeof post.meta?.image === 'object' && post.meta.image?.url ? post.meta.image.url : '/assets/logo.svg'}
        lng={lng}
        articleData={{
          headline: post.title,
          datePublished: post.publishedAt || new Date().toISOString(),
          dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
          articleBody: post.content ? JSON.stringify(post.content) : '',
          keywords: keywords,
          articleSection: blogT('seo.articleSection'),
          wordCount: post.content ? JSON.stringify(post.content).length : 0
        }}
        breadcrumbs={[
          { name: seoT('home.shortTitle'), url: `/` },
          { name: blogT('shortTitle'), url: `/blog` },
          { name: post.title, url: `/blog/${slug}` }
        ]}
        category={blogT('seo.category')}
        tags={keywords}
        lastModified={post.updatedAt || post.publishedAt || new Date().toISOString()}
        readingTime={getReadingTime(post.content)}
      />
      <article className="mx-auto min-h-[calc(100vh-56px-68px)] w-full max-w-[1440px] bg-white md:min-h-[calc(100vh-70px)]">
        <PageClient />

        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        <PostHero post={post} />

        <div className="px-6 pb-[60px] md:px-20 md:pb-[120px]">
          <div className="mx-auto max-w-[720px]">
            <RichText
              className="max-w-none"
              content={post.content}
              enableGutter={false}
              enableProse={false}
            />
          </div>

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-16">
              <RelatedPosts
                className=""
                docs={post.relatedPosts.filter((post) => typeof post === 'object')}
              />
            </div>
          )}
        </div>
      </article>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { lng, slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug, lng })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug, lng }: { slug: string; lng: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  // 将 Next.js 语言代码转换为 Payload locale 格式
  const payloadLocale = convertLngToPayloadLocale(lng)

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
    locale: payloadLocale,
  })

  return result.docs?.[0] || null
})
