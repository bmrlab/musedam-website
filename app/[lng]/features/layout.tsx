import React from 'react'

import { languages } from '@/i18n/settings'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@/[lng]/_utilities/mergeOpenGraph'
import SubscribeBlock from '@/[lng]/components/Subscribe'
import AdvancedBlock from '@/[lng]/features/_components/Advanced'
import FamousQuotes from '@/[lng]/features/_components/FamousQuotes'

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }))
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  twitter: {
    card: 'summary_large_image',
    creator: '@musedam',
  },
  openGraph: mergeOpenGraph(),
}
