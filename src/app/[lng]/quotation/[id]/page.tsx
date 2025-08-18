import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import { seoTranslation } from '@/app/i18n'
import { getServerSession } from '@/utilities/auth'
import { QuotationPreview } from '@/components/EnterpriseQuotation/Preview'
import { notFound } from 'next/navigation'

type Args = {
    params: Promise<{ lng: string; id?: string }>
}

export default async function MuseQuotationDetailPage({
    searchParams,
    params,
}: {
    searchParams: Promise<{ uId?: string, oId?: string }>
    params: Promise<{ id?: string }>
} & PropsWithLng) {
    try {
        const { id } = await params
        const { uId, oId } = await searchParams
        const user = await getServerSession()

        if (!id) {
            notFound()
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
    } catch (error) {
        console.error('Error in quotation detail page:', error)
        notFound()
    }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
    const { t } = await seoTranslation(params)
    const { lng, id } = await params
    return getPageMetadata({
        title: t('pricing.title'),
        description: t('pricing.description'),
        url: `${lng}/quotation/${id}`,
    })
}
