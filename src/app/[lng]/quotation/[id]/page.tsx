import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import { seoTranslation } from '@/app/i18n'
import { getServerSession } from '@/utilities/auth'
import { QuotationPreview } from '@/components/EnterpriseQuotation/Preview'

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

    if (!id) {
        return null
    }
    const userId = uId ?? user?.userId
    const orgId = oId ?? user?.orgId
    return (
        <QuotationPreview
            id={id}
            user={{
                userId: userId ?? '',
                orgId: orgId,
                token: user?.token,
                isOrg: true,
                hasOrg: true,
                isSale: true,
                isPro: false
            }}
            isAdmin={!!uId && !!oId}
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
