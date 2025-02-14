import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import JoinUs from '@/components/About/JoinUs'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

export default async function AllFeaturesPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <FlexColContainer className="w-full items-center">
      <JoinUs />
      <SubscribeBlock lng={lng} className="w-full" />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params
  return getPageMetadata({
    title: t('about-us.title'),
    description: t('about-us.description'),
    url: `${lng}/careers`,
  })
}
