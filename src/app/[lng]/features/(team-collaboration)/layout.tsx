import React from 'react'

import { Metadata } from 'next'
import { languages } from '@/app/i18n/settings'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'
import { SizeFullFlexColContainer } from '@/components/StyleWrapper/container'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default async function RootLayout({
  children,
  more,
}: {
  children: React.ReactNode
  more: React.ReactNode
}) {
  return (
    <SizeFullFlexColContainer>
      {children}
      <FamousQuotes className="h-[800px]" />
      {more}
    </SizeFullFlexColContainer>
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
