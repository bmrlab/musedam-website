import React from 'react'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { SizeFullFlexColContainer } from '@/components/StyleWrapper/Container'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'
import { languages } from '@/app/i18n/settings'

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
      <FamousQuotes />
      {more}
    </SizeFullFlexColContainer>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_SERVER_URL || 'https://www.musedam.cc'),
  twitter: {
    card: 'summary_large_image',
    creator: '@musedam',
  },
  openGraph: mergeOpenGraph(),
}
