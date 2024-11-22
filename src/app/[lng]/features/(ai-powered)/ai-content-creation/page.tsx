import { Metadata } from 'next'

import { MetadataProps, PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import fetchData from '@/app/[lng]/features/data'
import { seoTranslation } from '@/app/i18n'

import PageClient from './page.client'

export default async function AiContentCreationPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData } = await fetchData({
    ns: 'ai-content-creation',
    lng,
    showcaseLength: 4,
  })
  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <PageClient />
      </Showcase>
    </div>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  return {
    title: t('features.ai.content-creation.title'),
    description: t('features.ai.content-creation.description'),
  }
}
