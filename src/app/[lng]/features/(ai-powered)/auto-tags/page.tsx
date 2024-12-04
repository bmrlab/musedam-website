import { Metadata } from 'next'

import { MetadataProps, PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import fetchData from '@/app/[lng]/features/data'
import { seoTranslation } from '@/app/i18n'

import PageClient from './page.client'
import { getPageMetadata } from '@/utilities/getMetadata'

export default async function AutoTagsPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData } = await fetchData({
    ns: 'auto-tags',
    lng,
    showcaseLength: 5,
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
  return getPageMetadata({ title: t('features.ai.tags.title'), description: t('features.ai.tags.description') })
}
