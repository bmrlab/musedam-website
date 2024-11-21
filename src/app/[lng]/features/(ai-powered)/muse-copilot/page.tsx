import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import fetchData from '@/app/[lng]/features/data'

import PageClient from './page.client'

export default async function AiPoweredPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData } = await fetchData({
    ns: 'muse-copilot',
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
    title: 'MuseCopilot - AI-Powered Q&A and Content Creation',
    description:
      'MuseCopilot is an AI assistant that revolutionizes material management with integrated Q&A and content creation, significantly enhancing creativity and efficiency.',
  }
}
