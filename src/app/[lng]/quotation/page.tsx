import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import { seoTranslation } from '@/app/i18n'
import EnterpriseQuotation from '@/components/EnterpriseQuotation'
import { getServerSession } from '@/utilities/auth'
import NotFound from '../not-found'

export default async function MuseAIPricingPage({
    searchParams,
    params,
}: {
    searchParams: Promise<{ plan?: string }>
} & PropsWithLng) {
    const user = await getServerSession()
    return (
        <EnterpriseQuotation user={user} />
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
