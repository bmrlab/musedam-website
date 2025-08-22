import React, { Suspense } from 'react'
import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ssTranslation } from '@/app/i18n'
import { MetadataProps } from '@/types/page'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'

import { HelpCenterSearch } from '@/components/HelpCenter/HelpCenterSearch'
import { HelpCenterBreadcrumb } from '@/components/HelpCenter/HelpCenterBreadcrumb'
import { HelpCenterTopicHeader } from '@/components/HelpCenter/HelpCenterTopicHeader'
import { HelpCenterCategories } from '@/components/HelpCenter/HelpCenterCategories'
import { HelpCenterSkeleton } from '@/components/HelpCenter/skeleton/HelpCenterSkeleton'

export const dynamic = 'force-dynamic'

type Args = {
    params: Promise<{ lng: string; slug: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
    const { lng, slug } = await paramsPromise
    const { t } = await ssTranslation(lng, 'seo')

    return (
        <>
            <Suspense fallback={<HelpCenterSkeleton />}>
                <HelpCenterTopicContent lng={lng} slug={slug} t={t} />
            </Suspense>
        </>
    )
}

// 异步数据获取组件
async function HelpCenterTopicContent({
    lng,
    slug,
    t
}: {
    lng: string;
    slug: string;
    t: (key: string) => string
}) {
    const payload = await getPayload({ config: configPromise })

    // 将 Next.js 语言代码转换为 Payload locale 格式
    const payloadLocale = convertLngToPayloadLocale(lng)

    // 获取专题信息
    const topic = await payload.find({
        collection: 'help-topics',
        depth: 1,
        limit: 1,
        overrideAccess: false,
        where: {
            slug: { equals: slug },
        },
        locale: payloadLocale,
    })

    if (!topic.docs.length) {
        notFound()
    }

    const topicDoc = topic.docs[0]

    // 获取该专题下的分类
    const categories = await payload.find({
        collection: 'help-categories',
        depth: 1,
        limit: 100,
        overrideAccess: false,
        where: {
            topic: { equals: topicDoc.id },
        },
        sort: 'index',
        locale: payloadLocale,
    })

    // 获取每个分类下的文档
    const categoriesWithDocs = await Promise.all(
        categories.docs.map(async (category) => {
            const docs = await payload.find({
                collection: 'help-documents',
                depth: 1,
                limit: 100,
                overrideAccess: false,
                where: {
                    category: { equals: category.id },
                    _status: { equals: 'published' },
                },
                sort: 'index',
                locale: payloadLocale,
            })
            return { ...category, documents: docs.docs }
        })
    )

    return (
        <>
            <PageSEO
                type="help"
                title={`${topicDoc.title} | ${t('help.shortTitle')} | MuseDAM`}
                description={topicDoc.description || t('help.description')}
                url={`help/${slug}`}
                image="/assets/logo.svg"
                lng={lng}
                breadcrumbs={[
                    { name: t('help.shortTitle'), url: '/help' },
                    { name: topicDoc.title, url: `/help/${slug}` },
                ]}
            />
            <div className="flex min-h-screen w-full flex-col items-center">
                <div className="flex w-[1440px] max-w-full flex-col gap-10 bg-white px-5 md:px-[180px]">
                    {/* Search Bar */}
                    <div className='mb-10 mt-20'>
                        <HelpCenterSearch />
                    </div>
                    {/* Breadcrumb */}
                    <HelpCenterBreadcrumb topic={topicDoc} />

                    {/* Topic Header */}
                    <HelpCenterTopicHeader
                        topic={topicDoc}
                        articleCount={categoriesWithDocs.reduce((total, cat) => total + cat.documents.length, 0)}
                    />

                    {/* Categories and Documents */}
                    <HelpCenterCategories categories={categoriesWithDocs} />
                </div>
            </div>
        </>
    )
}

export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ lng: string; slug: string }> }): Promise<Metadata> {
    const { lng, slug } = await paramsPromise
    const payloadLocale = convertLngToPayloadLocale(lng)

    try {
        const payload = await getPayload({ config: configPromise })
        const topic = await payload.find({
            collection: 'help-topics',
            depth: 1,
            limit: 1,
            overrideAccess: false,
            where: {
                slug: { equals: slug },
            },
            locale: payloadLocale,
        })

        if (topic.docs.length > 0) {
            const topicDoc = topic.docs[0]
            const { t } = await ssTranslation(lng, 'seo')

            return getPageMetadata({
                title: `${topicDoc.title} | ${t('help.shortTitle')} | MuseDAM`,
                description: topicDoc.description || t('help.description'),
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