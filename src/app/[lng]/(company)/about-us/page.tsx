import { Metadata } from 'next'

import { MetadataProps, PropsWithLng } from '@/types/page'
import HomeHero from '@/components/About/Hero'
import InvestorsCards from '@/components/About/InvestorsCards'
import OurStory from '@/components/About/OurStory'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { getPageMetadata } from '@/utilities/getMetadata'

export default async function AboutUsPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <FlexColContainer className="w-full items-center">
      <HomeHero />
      <OurStory />
      <InvestorsCards />
      <SubscribeBlock lng={lng} className="w-full" />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)

  return getPageMetadata({ title: t('about-us.title'), description: t('about-us.description') })
}
