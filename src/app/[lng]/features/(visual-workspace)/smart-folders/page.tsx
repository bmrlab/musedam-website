import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import TextDisplay from '@/app/[lng]/features/_components/TextDisplay'
import fetchData from '@/app/[lng]/features/(team-collaboration)/data'
import { seoTranslation } from '@/app/i18n'

import PageClient from './page.client'

export default async function SmartFoldersPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData, textDisplayData } = await fetchData({
    ns: 'smart-folders',
    lng,
    showcaseLength: 4,
    textDisplayLength: 4,
  })
  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <PageClient />
      </Showcase>
      <TextDisplay {...textDisplayData} />
    </div>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params
  return getPageMetadata({
    title: t('features.smart-folders.title'),
    description: t('features.smart-folders.description'),
    url: `${lng}/features/smart-folders`,
  })
}
