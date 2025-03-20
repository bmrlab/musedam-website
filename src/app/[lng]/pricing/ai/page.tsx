import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPricingList, ProductItem } from '@/endpoints/pricing'
import { getServerSession } from '@/utilities/auth'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import Buy from '@/components/Pricing/Buy'
import DetailTableOfMuseAI from '@/components/Pricing/Compare/MuseAI'
import { EMuseProductType } from '@/components/Pricing/types/products'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

export default async function MuseAIPricingPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ plan?: string }>
} & PropsWithLng) {
  const user = await getServerSession()

  const { lng } = await params
  const { plan } = await searchParams

  // 没指定版本且用户已登录，要切换对对应的版本
  if (user && typeof plan === 'undefined') {
    if (user.isOrg) {
      redirect(`/${lng}/pricing/ai?plan=team`)
    } else {
      redirect(`/${lng}/pricing/ai?plan=personal`)
    }
  }

  const pricingData = getPricingList(
    process.env.DEPLOY_REGION === 'mainland' ? 'mainland' : 'global',
  ).then((res) => res.map((item) => [item.productType, item] as [EMuseProductType, ProductItem]))

  return (
    <FlexColContainer className="w-full items-center">
      <FlexColContainer className="max-w-full items-center md:w-[1260px]">
        <Buy isMuseAI pricingData={pricingData} user={user} />
        <DetailTableOfMuseAI />
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
    url: `${lng}/pricing/ai`,
  })
}
