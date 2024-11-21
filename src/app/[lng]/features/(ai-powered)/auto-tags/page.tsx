import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import fetchData from '@/app/[lng]/features/data'

import PageClient from './page.client'

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

export function generateMetadata(): Metadata {
  return {
    title: 'MuseDAM | AI Tags - Automatic Tagging for Smart Retrieval',
    description:
      "MuseDAM's AI Tags feature automatically assigns accurate tags to materials, greatly improving retrieval efficiency and making digital asset management smarter and more efficient.",
  }
}
