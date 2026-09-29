import React from 'react'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { languages } from '@/app/i18n/settings'

export async function generateStaticParams() {
  // Next 15.4 dev requests can concurrently rewrite prerender-manifest.json.
  // Resolve routes on demand locally; keep static parameters for production builds.
  if (process.env.NODE_ENV === 'development') return []

  return languages.map((lng) => ({ lng }))
}

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lng: string }>
  children: React.ReactNode
}) {
  const { lng } = await params
  return (
    <section className="flex size-full flex-col items-center justify-center">
      {children}
      <SubscribeBlock lng={lng} className="w-full" />
    </section>
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
