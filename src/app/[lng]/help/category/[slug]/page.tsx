import React, { Suspense } from 'react'
import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { HelpTopic as PayloadHelpTopic } from '@/payload-types'
import { ssTranslation } from '@/app/i18n'
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
    const { t } = await ssTranslation(lng, 'help-center')

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

    // 获取当前分类信息
    const categoryResult = await payload.find({
        collection: 'help-categories',
        depth: 1,
        limit: 1,
        overrideAccess: false,
        where: {
            slug: { equals: slug },
        },
        locale: payloadLocale,
    })

    if (!categoryResult.docs.length) {
        notFound()
    }

    const category = categoryResult.docs[0]

    // 获取分类关联的专题信息
    let topic: PayloadHelpTopic | null = null
    if (typeof category.topic === 'number') {
        // 如果 topic 是 ID，需要获取完整的专题信息
        const topicResult = await payload.findByID({
            collection: 'help-topics',
            id: category.topic,
            depth: 1,
            locale: payloadLocale,
        })
        topic = topicResult
    } else {
        // 如果 topic 已经是完整的对象
        topic = category.topic
    }

    if (!topic) {
        notFound()
    }

    // 获取每个分类下的文档
    const categoriesWithDocs = await Promise.all(
        [category].map(async (cat) => {
            const docs = await payload.find({
                collection: 'help-documents',
                depth: 1,
                limit: 100,
                overrideAccess: false,
                where: {
                    category: { equals: cat.id },
                    _status: { equals: 'published' },
                },
                sort: 'index',
                locale: payloadLocale,
            })
            return { ...cat, documents: docs.docs }
        })
    )

    return (
        <>
            <PageSEO
                type="help"
                title={`${category.title} | ${t('help.shortTitle')} | MuseDAM`}
                description={category.description || t('help.description')}
                url={`help/category/${slug}`}
                image="/assets/logo.svg"
                lng={lng}
                breadcrumbs={[
                    { name: t('help.shortTitle'), url: '/help' },
                    { name: topic.title, url: `/help/${topic.slug}` },
                    { name: category.title, url: `/help/category/${slug}` },
                ]}
            />
            <div className="flex min-h-screen w-full flex-col items-center">
                <div className="flex w-[1440px] max-w-full flex-col gap-10 bg-white px-5 md:px-[180px]">
                    {/* Search Bar */}
                    <div className='mb-10 mt-20'>
                        <HelpCenterSearch />
                    </div>
                    {/* Breadcrumb */}
                    <HelpCenterBreadcrumb topic={topic} category={category} />

                    {/* Topic Header */}

                    <div className="flex flex-col items-start gap-2">
                        {/* 分类信息 */}
                        <h1 className="font-euclid text-[32px] font-medium leading-[45px] text-[#262626]">
                            {category.title}
                        </h1>
                        <p className="font-mono text-sm font-light text-[#676C77]">
                            {categoriesWithDocs[0]?.documents.length || 0} {t('topics.articles')}
                        </p>
                        {category.description && (
                            <p className="mt-3 text-gray-600">
                                {category.description}
                            </p>
                        )}
                    </div>

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
        const category = await payload.find({
            collection: 'help-categories',
            depth: 1,
            limit: 1,
            overrideAccess: false,
            where: {
                slug: { equals: slug },
            },
            locale: payloadLocale,
        })

        if (category.docs.length > 0) {
            const categoryDoc = category.docs[0]
            const { t } = await ssTranslation(lng, 'seo')

            return getPageMetadata({
                title: `${categoryDoc.title} | ${t('help.shortTitle')} | MuseDAM`,
                description: categoryDoc.description || t('help.description'),
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