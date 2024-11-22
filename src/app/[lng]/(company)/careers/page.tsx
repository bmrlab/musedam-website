import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { FlexColContainer } from '@/components/StyleWrapper/container'
import JoinUs from '@/components/About/JoinUs'
import { ssTranslation } from '@/app/i18n'

export default async function AllFeaturesPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <FlexColContainer className="w-full items-center">
      <JoinUs />
      <SubscribeBlock lng={lng} className="w-full" />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await ssTranslation(params.lng, 'seo')

  return {
    title: t('careers.title'),
    description: t('careers.description')
  }
}
