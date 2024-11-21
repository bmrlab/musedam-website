import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import fetchData from '@/app/[lng]/features/data'

import PageClient from './page.client'

export default async function AiParsingPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData } = await fetchData({
    ns: 'ai-parsing',
    lng,
    showcaseLength: 3,
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
    title: 'MuseDAM | AI Parsing - Efficient Material Analysis for Asset Management',
    description:
      'Effortlessly manage digital assets with MuseDAM AI Parsing. Intelligent recognition and analysis for streamlined resource handling.',
  }
}
