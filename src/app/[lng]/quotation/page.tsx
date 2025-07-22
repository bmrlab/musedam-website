import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'
import EnterpriseQuotation from '@/components/EnterpriseQuotation'

export default async function MuseAIPricingPage({
    searchParams,
    params,
}: {
    searchParams: Promise<{ plan?: string }>
} & PropsWithLng) {

    return (
        <EnterpriseQuotation />
    )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
    const { t } = await seoTranslation(params)
    const { lng } = await params
    return getPageMetadata({
        title: t('pricing.title'),
        description: t('pricing.description'),
        url: `${lng}/quotation`,
    })
}
