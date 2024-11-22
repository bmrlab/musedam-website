import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import TextDisplay from '@/app/[lng]/features/_components/TextDisplay'
import fetchData from '@/app/[lng]/features/(team-collaboration)/data'
import { ssTranslation } from '@/app/i18n'

import PageClient from './page.client'

export default async function TeamManagementPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData, textDisplayData } = await fetchData({
    ns: 'team-management',
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

export async function generateMetadata({ params }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await ssTranslation(params.lng, 'seo')
  return {
    title: t('features.team-management.title'),
    description: t('features.team-management.description'),
  }
}
