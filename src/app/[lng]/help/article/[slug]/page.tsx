import React, { Suspense } from 'react'
import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ssTranslation } from '@/app/i18n'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'

import { HelpCenterSearch } from '@/components/HelpCenter/HelpCenterSearch'
import { HelpCenterBreadcrumb } from '@/components/HelpCenter/HelpCenterBreadcrumb'
import { HelpCenterArticleContent } from '@/components/HelpCenter/HelpCenterArticleContent'
import { HelpCenterFeedback } from '@/components/HelpCenter/HelpCenterFeedback'
import { HelpCenterSkeleton } from '@/components/HelpCenter/skeleton/HelpCenterSkeleton'
import { RelatedArticles } from '@/components/HelpCenter/RelatedArticles'

export const dynamic = 'force-dynamic'

type Args = {
    params: Promise<{ lng: string; slug: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
    const { lng, slug } = await paramsPromise
    const { t } = await ssTranslation(lng, 'help-center')

    return (
        <>
            <Suspense fallback={<HelpCenterSkeleton />}>
                <HelpCenterArticlePage lng={lng} slug={slug} t={t} />
            </Suspense>
        </>
    )
}

// 缓存的数据查询函数
const queryHelpDocumentBySlug = cache(async ({ slug, lng }: { slug: string; lng: string }) => {
    const payload = await getPayload({ config: configPromise })

    // 将 Next.js 语言代码转换为 Payload locale 格式
    const payloadLocale = convertLngToPayloadLocale(lng)

    // 获取文档信息
    const document = await payload.find({
        collection: 'help-documents',
        depth: 2,
        limit: 1,
        overrideAccess: false,
        where: {
            slug: { equals: slug },
            _status: { equals: 'published' },
        },
        locale: payloadLocale,
    })

    return document
})

// 异步数据获取组件
async function HelpCenterArticlePage({
    lng,
    slug,
    t
}: {
    lng: string;
    slug: string;
    t: (key: string) => string
}) {
    const document = await queryHelpDocumentBySlug({ slug, lng })

    if (!document.docs.length) {
        notFound()
    }

    const documentDoc = document.docs[0]

    // 获取分类和专题信息
    const category = documentDoc.category as any
    const topic = category?.topic as any

    // 获取关联文章
    const payload = await getPayload({ config: configPromise })
    const payloadLocale = convertLngToPayloadLocale(lng)

    // 优先获取手动选择的关联文章
    let relatedArticles: { docs: any[] } = { docs: [] }

    if (documentDoc.relatedArticles && Array.isArray(documentDoc.relatedArticles) && documentDoc.relatedArticles.length > 0) {
        // 如果有手动选择的关联文章，获取这些文章的详细信息
        const relatedArticleIds = documentDoc.relatedArticles.map((article: any) => article.id || article)

        relatedArticles = await payload.find({
            collection: 'help-documents',
            depth: 1,
            limit: 4,
            overrideAccess: false,
            where: {
                _status: { equals: 'published' },
                id: { in: relatedArticleIds },
            },
            sort: '-publishedAt',
            locale: payloadLocale,
        })
    } else {
        // 如果没有手动选择的关联文章，则显示同分类的文章
        // relatedArticles = await payload.find({
        //     collection: 'help-documents',
        //     depth: 1,
        //     limit: 4,
        //     overrideAccess: false,
        //     where: {
        //         _status: { equals: 'published' },
        //         id: { not_equals: documentDoc.id },
        //         category: { equals: category?.id },
        //     },
        //     sort: '-publishedAt',
        //     locale: payloadLocale,
        // })
    }

    return (
        <>
            <PageSEO
                type="help"
                title={`${documentDoc.title} | ${t('help.shortTitle')} | MuseDAM`}
                description={documentDoc.excerpt || t('help.description')}
                url={`help/article/${slug}`}
                image="/assets/logo.svg"
                lng={lng}
                breadcrumbs={[
                    { name: t('help.shortTitle'), url: '/help' },
                    { name: topic?.title || '', url: topic?.slug ? `/help/${topic.slug}` : '/help' },
                    { name: category?.title || '', url: category?.slug ? `/help/category/${category.slug}` : '/help' },
                    { name: documentDoc.title, url: `/help/article/${slug}` },
                ]}
            />
            <div className="flex min-h-screen w-full flex-col items-center">
                <div className="w-full max-w-[1440px] bg-white px-5 py-[30px] md:px-[180px] md:py-[80px]">
                    <div className='md:mb-20 flex justify-center mb-5'>
                        {/* Search Bar */}
                        <HelpCenterSearch />
                    </div>
                    {/* Breadcrumb */}
                    <HelpCenterBreadcrumb
                        topic={topic}
                        category={category}
                        document={documentDoc}
                    />

                    {/* Article Content */}
                    <HelpCenterArticleContent document={documentDoc} />

                    {/* Related Articles */}
                    {!!relatedArticles.docs.length && <RelatedArticles docs={relatedArticles.docs} />}

                    {/* Feedback */}
                    <HelpCenterFeedback documentId={documentDoc.id.toString()} />
                </div>
            </div>
        </>
    )
}

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ lng: string; slug: string }> }): Promise<Metadata> {
    const { lng, slug } = await paramsPromise
    try {
        const document = await queryHelpDocumentBySlug({ slug, lng })

        if (document.docs.length > 0) {
            const documentDoc = document.docs[0]
            const { t } = await ssTranslation(lng, 'seo')

            return getPageMetadata({
                title: `${documentDoc.title} | ${t('help.shortTitle')} | MuseDAM`,
                description: documentDoc.excerpt || t('help.description'),
                lng,
            })
        }
    } catch (error) {
        // 如果获取失败，使用默认标题
    }

    const { t } = await ssTranslation(lng, 'seo')
    return getPageMetadata({
        title: t('help.title'),
        description: t('help.description'),
        lng,
    })
} 