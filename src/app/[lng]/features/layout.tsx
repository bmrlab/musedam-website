import React from 'react'

import { Metadata } from 'next'
import { languages } from '@/app/i18n/settings'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex size-full flex-col items-center justify-center">{children}</section>
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
