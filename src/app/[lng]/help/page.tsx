import React, { Suspense } from 'react'
import type { Metadata } from 'next/types'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { seoTranslation } from '@/app/i18n'
import { MetadataProps } from '@/types/page'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'

import { HelpCenterHero } from '@/components/HelpCenter/HelpCenterHero'
import { HelpCenterTopics } from '@/components/HelpCenter/HelpCenterTopics'
import { HelpCenterSkeleton } from '@/components/HelpCenter/skeleton/HelpCenterSkeleton'

export const dynamic = 'force-dynamic'

type Args = {
    params: Promise<{ lng: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
    const { lng } = await paramsPromise
    const { t } = await seoTranslation(paramsPromise)

    return (
        <>
            <PageSEO
                type="help"
                title={t('help.title')}
                description={t('help.description')}
                url="help"
                image="/assets/logo.svg"
                lng={lng}
                breadcrumbs={[
                    { name: t('help.shortTitle'), url: '/help' },
                ]}
            />
            <Suspense fallback={<HelpCenterSkeleton />}>
                <HelpCenterContent lng={lng} />
            </Suspense>
        </>
    )
}

// 异步数据获取组件
async function HelpCenterContent({ lng }: { lng: string }) {
    const payload = await getPayload({ config: configPromise })

    // 将 Next.js 语言代码转换为 Payload locale 格式
    const payloadLocale = convertLngToPayloadLocale(lng)

    // 获取所有专题，按index排序
    const topics = await payload.find({
        collection: 'help-topics',
        depth: 1,
        limit: 100,
        overrideAccess: false,
        sort: 'index',
        locale: payloadLocale,
        where: {
            _status: { equals: 'published' },
        }
    })

    return (
        <div className="flex min-h-screen w-full flex-col items-center">
            <div className="w-full max-w-[1440px] bg-white px-5 md:px-[180px]">
                {/* Hero Section */}
                <HelpCenterHero />

                {/* Topics Grid */}
                <HelpCenterTopics topics={topics.docs} />

            </div>
        </div>
    )
}

export async function generateMetadata({ params: paramsPromise }: MetadataProps): Promise<Metadata> {
    const { t } = await seoTranslation(paramsPromise)
    const { lng } = await paramsPromise

    return getPageMetadata({
        title: t('help.title'),
        description: t('help.description'),
        lng,
    })
} 