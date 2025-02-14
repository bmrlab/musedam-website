import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import PrivacyPageContent from '@/components/About/policy/PrivacyContent'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

export default async function AllFeaturesPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <FlexColContainer className="w-full items-center">
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
    url: `${lng}/privacy`,
  })
}
