import { Metadata } from 'next'

import { MetadataProps } from '@/types/page'
import Buy from '@/components/Pricing/Buy'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'
import { getPageMetadata } from '@/utilities/getMetadata'
import DetailTableOfMuseAI from '@/components/Pricing/Compare/MuseAI'

export default async function AboutUsPage() {

  return (
    <FlexColContainer className="w-full items-center">
      <FlexColContainer className="max-w-full items-center md:w-[1260px]">
        <Buy isMuseAI={true} />
        <DetailTableOfMuseAI />
      </FlexColContainer>
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)

  return getPageMetadata({ title: t('pricing.ai.title'), description: t('pricing.ai.description') })
}
