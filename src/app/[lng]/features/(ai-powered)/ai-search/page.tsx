import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import fetchData from '@/app/[lng]/features/data'

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

export function generateMetadata(): Metadata {
  return {
    title: 'MuseDAM | AI Search - Smart Image Analysis for Quick Asset Discovery',
    description:
      "Find assets instantly with MuseDAM's AI. Intelligent image analysis for detailed scene and color search.",
  }
}
