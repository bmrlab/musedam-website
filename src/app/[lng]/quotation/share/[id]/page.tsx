import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import { seoTranslation } from '@/app/i18n'
import { QuotationSharePreview } from '@/components/EnterpriseQuotation/Preview/Share'
import { getServerSession } from '@/utilities/auth'

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
    const { id } = await params
    const user = await getServerSession()

    if (!id) return <div></div>
    return (
        <QuotationSharePreview
            uuid={id}
            user={user}
        />
    )
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
