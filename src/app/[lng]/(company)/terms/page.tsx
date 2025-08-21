import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'
import { MetadataProps, PropsWithLng } from '@/types/page'
import TermsPageContent from '@/components/About/policy/TermsContent'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

export default async function TermsPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { t } = await seoTranslation(params)

  return (
    <FlexColContainer className="w-full items-center">
      <PageSEO
        type="terms"
        title={t('terms.title')}
        description={t('terms.description')}
        url="/terms"
        image="/assets/logo.svg"
        lng={lng}
        breadcrumbs={[
          { name: t('home.shortTitle'), url: '/' },
          { name: t('terms.shortTitle'), url: '/terms' }
        ]}
      />
      <TermsPageContent lng={lng} />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params
  return getPageMetadata({
    title: t('terms.title'),
    description: t('terms.description'),
    url: 'terms',
    lng,
  })
}
