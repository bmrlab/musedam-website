import React from 'react'

import { Metadata } from 'next'
import AdvancedBlock from '@/app/[lng]/features/_components/Advanced'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'
import { languages } from '@/app/i18n/settings'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex size-full flex-col items-center justify-center">
      {children}
      <FamousQuotes className="h-[389px]" />
      <AdvancedBlock />
      <SubscribeBlock className="w-full" />
    </section>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://musedam.cc'),
  twitter: {
    card: 'summary_large_image',
    creator: '@musedam',
  },
  openGraph: mergeOpenGraph(),
}
