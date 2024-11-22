import { Metadata } from 'next'

import { MetadataProps, PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import TextDisplay from '@/app/[lng]/features/_components/TextDisplay'
import fetchData from '@/app/[lng]/features/(team-collaboration)/data'

import PageClient from './page.client'
import { seoTranslation } from '@/app/i18n'

export default async function PermissionsPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData, textDisplayData } = await fetchData({
    ns: 'permissions',
    lng,
    showcaseLength: 3,
    textDisplayLength: 5,
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
  return {
    title: t('features.permissions.title'),
    description: t('features.permissions.description'),
  }
}
