import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import Buy from '@/components/Pricing/Buy'
import DetailTableOfMuseDam from '@/components/Pricing/Compare/MuseDam'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

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
  const { lng } = await params
  return getPageMetadata({
    title: t('pricing.title'),
    description: t('pricing.description'),
    url: `${lng}/pricing`,
  })
}
