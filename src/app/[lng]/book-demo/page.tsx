import { Metadata } from 'next'
import { seoTranslation } from '@/app/i18n'
import { MetadataProps } from '@/types/page'
import { getPageMetadata } from '@/utilities/getMetadata'
import { Information } from '@/components/Pricing/Enterprise/information'
import { PageSEO } from '@/components/SEO/PageSEO'

export default async function BookDemoPage({ params, searchParams }: { params: Promise<{ lng: string }>, searchParams: Promise<{ from: string }> }) {
    const { lng } = await params
    const { from } = await searchParams
    const { t } = await seoTranslation(params)

    return (
        <>
            <PageSEO
                type="bookDemo"
                title={t('bookDemo.title')}
                description={t('bookDemo.description')}
                url="/book-demo"
                image="/assets/logo.svg"
                lng={lng}
                breadcrumbs={[
                    { name: t('home.shortTitle'), url: '/' },
                    { name: t('bookDemo.shortTitle'), url: '/book-demo' }
                ]}
            />
            <Information inNewPage={true} from={from || ''} />
        </>
    )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
    const { t } = await seoTranslation(params)
    const { lng } = await params

    return getPageMetadata({
        title: t('bookDemo.title'),
        description: t('bookDemo.description'),
        lng,
        url: 'bookDemo'
    })
}
