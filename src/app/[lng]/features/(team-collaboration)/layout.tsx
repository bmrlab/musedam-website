import React from 'react'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { SizeFullFlexColContainer } from '@/components/StyleWrapper/Container'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'
import { languages } from '@/app/i18n/settings'

export async function generateStaticParams() {
  // Next 15.4 dev requests can concurrently rewrite prerender-manifest.json.
  // Resolve routes on demand locally; keep static parameters for production builds.
  if (process.env.NODE_ENV === 'development') return []

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

export async function generateMetadata() {
  return {
    metadataBase: new URL(process.env.SITE_SERVER_URL || 'https://www.musedam.cc'),
    twitter: {
      card: 'summary_large_image',
      creator: '@musedam',
    },
    openGraph: mergeOpenGraph(),
  }
}
