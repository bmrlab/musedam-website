import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPricingList, ProductItem } from '@/endpoints/pricing'
import { getServerSession } from '@/utilities/auth'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import Buy from '@/components/Pricing/Enterprise/Buy'
import DetailTableOfMuseAI from '@/components/Pricing/Compare/MuseAI'
import { EMuseProductType } from '@/components/Pricing/types/products'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'
import FeatureList from '@/components/Pricing/Enterprise/FeatureList'
import FAQ from '@/components/Pricing/Enterprise/FAQ'

export default async function MuseAIPricingPage({
    searchParams,
    params,
}: {
    searchParams: Promise<{ plan?: string }>
} & PropsWithLng) {
    const user = await getServerSession()

    const pricingData = getPricingList(
        process.env.DEPLOY_REGION === 'mainland' ? 'mainland' : 'global',
    ).then((res) => res.map((item) => [item.productType, item] as [EMuseProductType, ProductItem]))

    return (
        <FlexColContainer className="w-full items-center bg-[#070707]">
            <FlexColContainer className="w-full items-center">
                <Buy pricingData={pricingData} user={user} />
                <FeatureList />
                <FAQ />
            </FlexColContainer>
        </FlexColContainer>
    )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
    const { t } = await seoTranslation(params)
    const { lng } = await params
    return getPageMetadata({
        title: t('pricing.ai.title'),
        description: t('pricing.ai.description'),
        url: `${lng}/enterprise/pricing`,
    })
}
