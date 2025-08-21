import EnterpriseLandingPage from '@/components/LandingPage/EnterpriseHome'
import { Metadata } from 'next'
import { seoTranslation } from '@/app/i18n'
import { MetadataProps } from '@/types/page'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'

export default async function HomePage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  const { t } = await seoTranslation(params)

  return (
    <>
      <PageSEO
        type="home"
        title={t('home.title')}
        description={t('home.description')}
        url="/"
        image="/assets/logo.svg"
        lng={lng}
        breadcrumbs={[
          { name: t('home.shortTitle'), url: '/' },
        ]}
      />
      <EnterpriseLandingPage params={params} />
    </>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params

  return getPageMetadata({
    title: t('home.title'),
    description: t('home.description'),
    lng,
  })
}

