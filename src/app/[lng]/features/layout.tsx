import React from 'react'
import { Metadata } from 'next'
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.musedam.cc'),
  twitter: {
    card: 'summary_large_image',
    creator: '@musedam',
  },
  openGraph: mergeOpenGraph(),
}
