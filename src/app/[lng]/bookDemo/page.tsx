import { Metadata } from 'next'
import { seoTranslation } from '@/app/i18n'
import { MetadataProps } from '@/types/page'
import { getPageMetadata } from '@/utilities/getMetadata'
import { Information } from '@/components/Pricing/Enterprise/information'
import { PageSEO } from '@/components/SEO/PageSEO'

export default async function BookDemoPage({ params }: { params: Promise<{ lng: string }> }) {
    const { lng } = await params
    const { t } = await seoTranslation(params)

    return (
        <>
            <PageSEO
                type="bookDemo"
                title={t('bookDemo.title')}
                description={t('bookDemo.description')}
                url="/bookDemo"
                image="/assets/logo.svg"
                lng={lng}
                breadcrumbs={[
                    { name: t('home.shortTitle'), url: '/' },
                    { name: t('bookDemo.shortTitle'), url: '/bookDemo' }
                ]}
            />
            <Information inNewPage={true} />
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
