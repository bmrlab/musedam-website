import { Metadata } from 'next'
import PrivacyPageContent from '@/components/About/policy/PrivacyContent'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'
import { MetadataProps, PropsWithLng } from '@/types/page'

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

  return {
    title: t('privacy.title'),
    description: t('privacy.description')
  }
}
