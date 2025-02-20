import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps } from '@/types/page'
import Buy from '@/components/Pricing/Buy'
import DetailTableOfMuseAI from '@/components/Pricing/Compare/MuseAI'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

export default async function MuseAIPricingPage() {
  return (
    <FlexColContainer className="w-full items-center">
      <FlexColContainer className="max-w-full items-center md:w-[1260px]">
        <Buy isMuseAI />
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
