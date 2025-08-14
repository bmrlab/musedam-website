import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import { seoTranslation } from '@/app/i18n'
import EnterpriseQuotation from '@/components/EnterpriseQuotation'
import { getServerSession } from '@/utilities/auth'

export default async function MuseQuotationDetailPage({
    searchParams,
    params,
}: {
    searchParams: Promise<{ uId?: string, oId?: string }>
    params: Promise<{ id?: string }>
} & PropsWithLng) {
    const { id } = await params
    const { uId, oId } = await searchParams
    const user = await getServerSession()

    return (
        <EnterpriseQuotation
            id={id}
            user={{
                userId: uId ?? user?.userId ?? '',
                orgId: oId ?? user?.orgId,
                token: user?.token,
                isOrg: true,
                hasOrg: true,
                isSale: true,
                isPro: false
            }}
        />
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
