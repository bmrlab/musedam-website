import { Metadata } from 'next'
import PrivacyPageContent from '@/components/About/policy/PrivacyContent'
import { FlexColContainer } from '@/components/StyleWrapper/container'
import { ssTranslation } from '@/app/i18n'
import { PropsWithLng } from '@/types/page'

export default async function AllFeaturesPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <FlexColContainer className="w-full items-center">
      <PrivacyPageContent lng={lng} />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await ssTranslation(params.lng, 'seo')

  return {
    title: t('privacy.title'),
    description: t('privacy.description')
  }
}
