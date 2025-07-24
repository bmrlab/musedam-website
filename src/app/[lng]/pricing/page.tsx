import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPricingList, ProductItem } from '@/endpoints/pricing'
import { getServerSession } from '@/utilities/auth'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import DetailTableOfMuseDam from '@/components/Pricing/Compare/MuseDam'
import { EMuseProductType } from '@/components/Pricing/types/products'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'
import FeatureList from '@/components/Pricing/Enterprise/FeatureList'
import FAQ from '@/components/Pricing/Enterprise/FAQ'
import Buy from '@/components/Pricing/Enterprise/Buy'

export default async function MuseDAMPricingPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ plan?: string }>
} & PropsWithLng) {
  const user = await getServerSession()

  return (
    <FlexColContainer className="w-full items-center bg-[#070707]">
      <FlexColContainer className="w-full items-center ">
        <Buy user={user} />
        <div className='h-[20px] w-full'></div>
        <FeatureList />
      </FlexColContainer>
      <FAQ />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params
  return getPageMetadata({
    title: t('pricing.title'),
    description: t('pricing.description'),
    url: `${lng}/pricing`,
  })
}
