import { Metadata } from 'next'

import { MetadataProps, PropsWithLng } from '@/types/page'
import Buy from '@/components/Pricing/Buy'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'
import { getPageMetadata } from '@/utilities/getMetadata'
import DetailTableOfMuseDam from '@/components/Pricing/Compare/MuseDam'

export default async function AboutUsPage() {
  return (
    <FlexColContainer className="w-full items-center">
      <FlexColContainer className="max-w-full items-center md:w-[1260px]">
        <Buy />
        <DetailTableOfMuseDam />
      </FlexColContainer>
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)

  return getPageMetadata({ title: t('pricing.title'), description: t('pricing.description') })
}
