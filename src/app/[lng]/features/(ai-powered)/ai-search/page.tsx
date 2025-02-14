import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import fetchData from '@/app/[lng]/features/data'
import { seoTranslation } from '@/app/i18n'

import PageClient from './page.client'

export default async function AiSearchPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData } = await fetchData({
    ns: 'ai-search',
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
  const { lng } = await params
  return getPageMetadata({
    title: t('features.ai.search.title'),
    description: t('features.ai.search.description'),
    url: `${lng}/features/ai-search`,
  })
}
