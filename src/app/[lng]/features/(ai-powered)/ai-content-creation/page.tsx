import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import fetchData from '@/app/[lng]/features/data'

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

export function generateMetadata(): Metadata {
  return {
    title: 'MuseDAM | AI Content Creation - Intelligent Summarization and Article Generation',
    description:
      "MuseDAM's AI Content Creation feature intelligently summarizes material content and even writes new articles based on it, greatly improving the efficiency and quality of creative work.",
  }
}
