import { Metadata } from 'next'

import { MetadataProps, PropsWithLng } from '@/types/page'
import TermsPageContent from '@/components/About/policy/TermsContent'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'
import { getPageMetadata } from '@/utilities/getMetadata'

export default async function AllFeaturesPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <FlexColContainer className="w-full items-center">
      <TermsPageContent lng={lng} />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)

  return getPageMetadata({ title: t('terms.title'), description: t('terms.description'), url: 'terms' })
}
