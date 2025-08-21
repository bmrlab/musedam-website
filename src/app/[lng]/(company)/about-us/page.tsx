import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'
import { MetadataProps, PropsWithLng } from '@/types/page'
import HomeHero from '@/components/About/Hero'
import InvestorsCards from '@/components/About/InvestorsCards'
import OurStory from '@/components/About/OurStory'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

export default async function AboutUsPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { t } = await seoTranslation(params)

  return (
    <FlexColContainer className="w-full items-center">
      <PageSEO
        type="about"
        title={t('about-us.title')}
        description={t('about-us.description')}
        url="/about-us"
        image="/assets/logo.svg"
        lng={lng}
        breadcrumbs={[
          { name: t('home.shortTitle'), url: '/' },
          { name: t('about-us.shortTitle'), url: '/about-us' }
        ]}
      />
      <HomeHero />
      <OurStory />
      <InvestorsCards />
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
    url: 'about-us',
    lng,
  })
}
