import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'
import { MetadataProps, PropsWithLng } from '@/types/page'
import PrivacyPageContent from '@/components/About/policy/PrivacyContent'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

export default async function PrivacyPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { t } = await seoTranslation(params)

  return (
    <FlexColContainer className="w-full items-center">
      <PageSEO
        type="privacy"
        title={t('privacy.title')}
        description={t('privacy.description')}
        url="/privacy"
        image="/assets/logo.svg"
        lng={lng}
        breadcrumbs={[
          { name: t('home.shortTitle'), url: '/' },
          { name: t('privacy.shortTitle'), url: '/privacy' }
        ]}
      />
      <PrivacyPageContent lng={lng} />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params
  return getPageMetadata({
    title: t('privacy.title'),
    description: t('privacy.description'),
    url: 'privacy',
    lng,
  })
}
