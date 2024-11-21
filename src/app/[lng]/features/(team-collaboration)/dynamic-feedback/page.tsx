import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import TextDisplay from '@/app/[lng]/features/_components/TextDisplay'

import fetchData from '../data'
import PageClient from './page.client'

export default async function DynamicFeedbackPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData, textDisplayData } = await fetchData({
    ns: 'dynamic-feedback',
    lng,
    showcaseLength: 5,
    textDisplayLength: 3,
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
    title: 'MuseDAM | Feedback - Dynamic Comments, Smart Annotations',
    description:
      'MuseDAM supports dynamic feedback on materials, allowing team members to leave comments and annotations, enhancing collaboration and communication, and making the creative workflow smoother and more efficient.',
  }
}
