import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'
import { ssTranslation } from '@/app/i18n'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'
import { HelpCenterSearch } from '@/components/HelpCenter/HelpCenterSearch'
import { HelpCenterSearchResults } from '@/components/HelpCenter/HelpCenterSearchResults'
import { HelpCenterSearchSkeleton } from '@/components/HelpCenter/skeleton/HelpCenterSearchSkeleton'

interface Args {
    params: Promise<{ lng: string }>
    searchParams: Promise<{ q?: string }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
    const { lng } = await paramsPromise
    const { q } = await searchParamsPromise

    if (!q || q.trim().length === 0) {
        redirect(`/${lng}/help`)
    }

    const { t } = await ssTranslation(lng, 'help-center')

    return (
        <>
            <PageSEO
                type="help"
                title={t('searchResults.header.title') + `: ${q} | ${t('help.shortTitle')} | MuseDAM`}
                description={t('searchResults.header.description', { query: q })}
                url={`help/search?q=${encodeURIComponent(q)}`}
                image="/assets/logo.svg"
                lng={lng}
                breadcrumbs={[
                    { name: t('help.shortTitle'), url: '/help' },
                    { name: t('searchResults.header.title'), url: `/help/search?q=${encodeURIComponent(q)}` },
                ]}
            />
            <Suspense fallback={<HelpCenterSearchSkeleton />}>
                <HelpCenterSearchPageContent lng={lng} query={q} t={t} />
            </Suspense>
        </>
    )
}

// 异步数据获取组件
async function HelpCenterSearchPageContent({
    lng,
    query,
    t
}: {
    lng: string;
    query: string;
    t: (key: string, options?: any) => string
}) {
    const payload = await getPayload({ config: configPromise })
    const payloadLocale = convertLngToPayloadLocale(lng)

    // 搜索帮助文档
    const searchResults = await payload.find({
        collection: 'help-documents',
        depth: 2,
        limit: 50,
        overrideAccess: false,
        where: {
            _status: { equals: 'published' },
            or: [
                {
                    title: {
                        contains: query,
                    },
                },
                {
                    excerpt: {
                        contains: query,
                    },
                },
                // 暂时注释掉富文本内容搜索，避免 jsonb 类型错误
                // {
                //     'content.root.children': {
                //         like: query,
                //     },
                // },
            ],
        },
        sort: '-updatedAt',
        locale: payloadLocale,
    })

    return (
        <div className="flex min-h-screen w-full flex-col items-center">
            <div className="w-full max-w-[1440px] bg-white px-5 py-[30px] md:px-[180px] md:py-[80px]">
                {/* Search Bar */}
                <div className='md:mb-20 flex justify-center mb-5'>
                    <HelpCenterSearch />
                </div>

                {/* Breadcrumb */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 font-euclid text-base">
                        <span className="text-[#95989F]">{t('searchResults.header.title')}</span>
                    </nav>
                </div>

                {/* Search Results */}
                <HelpCenterSearchResults
                    results={searchResults.docs}
                    query={query}
                    total={searchResults.totalDocs}
                />
            </div>
        </div>
    )
}

export async function generateMetadata({ params: paramsPromise, searchParams: searchParamsPromise }: Args): Promise<Metadata> {
    const { lng } = await paramsPromise
    const { q } = await searchParamsPromise

    if (!q) {
        const { t } = await ssTranslation(lng, 'seo')
        return getPageMetadata({
            title: t('help.title'),
            description: t('help.description'),
            lng,
        })
    }

    const { t } = await ssTranslation(lng, 'help-center')
    return getPageMetadata({
        title: `${t('searchResults.header.title')}: ${q} | ${t('help.shortTitle')} | MuseDAM`,
        description: t('searchResults.header.description', { query: q }),
        lng,
    })
} 