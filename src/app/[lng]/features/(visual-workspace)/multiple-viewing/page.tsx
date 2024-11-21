import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import TextDisplay from '@/app/[lng]/features/_components/TextDisplay'
import fetchData from '@/app/[lng]/features/(team-collaboration)/data'

import PageClient from './page.client'

export default async function MultipleViewingPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData, textDisplayData } = await fetchData({
    ns: 'multiple-viewing',
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

export function generateMetadata(): Metadata {
  return {
    title: 'MuseDAM | Multiple Views - Kanban, List, Waterfall, Adaptive',
    description:
      'MuseDAM offers multiple viewing modes, including Kanban, list, waterfall, and adaptive layouts, to meet the needs of different users for material browsing and management, making digital asset management more flexible and efficient.',
  }
}
