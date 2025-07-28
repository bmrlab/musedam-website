import { cache } from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'
import type { PropsWithLng } from '@/types/page'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'

import PageClient from './page.client'

// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise })
//   const posts = await payload.find({
//     collection: 'posts',
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//   })
//
//   const params = posts.docs.map(({ slug }) => {
//     return { slug }
//   })
//
//   return params
// }

type Args = {
  params: Promise<{ lng: string; slug?: string }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { lng, slug = '' } = await paramsPromise
  const url = '/blog/posts/' + slug
  const post = await queryPostBySlug({ slug, lng })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="mx-auto w-full max-w-[1440px] bg-white">
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
