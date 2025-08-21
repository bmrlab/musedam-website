import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'
import { MetadataProps, PropsWithLng } from '@/types/page'
import JoinUs from '@/components/About/JoinUs'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

export default async function CareersPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { t } = await seoTranslation(params)

  return (
    <FlexColContainer className="w-full items-center">
      <PageSEO
        type="careers"
        title={t('careers.title')}
        description={t('careers.description')}
        url="/careers"
        image="/assets/logo.svg"
        lng={lng}
        breadcrumbs={[
          { name: t('home.shortTitle'), url: '/' },
          { name: t('careers.shortTitle'), url: '/careers' }
        ]}
      />
      <JoinUs />
      <SubscribeBlock lng={lng} className="w-full" />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params
  return getPageMetadata({
    title: t('careers.title'),
    description: t('careers.description'),
    url: 'careers',
    lng,
  })
}
