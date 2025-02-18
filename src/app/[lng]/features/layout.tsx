import React from 'react'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { languages } from '@/app/i18n/settings'

export async function generateStaticParams() {
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
