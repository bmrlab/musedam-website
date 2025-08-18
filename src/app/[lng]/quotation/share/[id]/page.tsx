import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { PropsWithLng } from '@/types/page'
import { seoTranslation } from '@/app/i18n'
import { QuotationSharePreview } from '@/components/EnterpriseQuotation/Preview/Share'
import { getServerSession } from '@/utilities/auth'
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
        const user = await getServerSession()

        if (!id) {
            notFound()
        }

        return (
            <QuotationSharePreview
                uuid={id}
                user={user}
            />
        )
    } catch (error) {
        console.error('Error in quotation share page:', error)
        notFound()
    }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
    const { t } = await seoTranslation(params)
    const { lng, id } = await params
    return getPageMetadata({
        title: t('pricing.title'),
        description: t('pricing.description'),
        url: `${lng}/quotation/share/${id}`,
    })
}
