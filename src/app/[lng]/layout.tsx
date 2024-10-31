import type { Metadata } from 'next'

import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { Baskervville, IBM_Plex_Mono } from 'next/font/google'
import { languages } from '@/app/i18n/settings'
import { dir } from 'i18next'
import { TailwindIndicator } from '@/components/ui/tailwind-indicator'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const baskervville = Baskervville({
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-baskervville',
})

const plexMono = IBM_Plex_Mono({
  weight: ['300', '400', '500'],
  style: ['normal'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-plex_mono',
})

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lng: string }>
}) {
  const { isEnabled } = await draftMode()
  const { lng } = await params
  return (
    <html
      lang={lng}
      dir={dir(lng)}
      suppressHydrationWarning
      className={`no-scrollbar ${baskervville.variable} ${plexMono.variable}`}
    >
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <Header />
          <div className="flex flex-col items-center justify-center">{children}</div>
          <Footer lng={lng} />
        </Providers>
        <TailwindIndicator />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://musedam.cc'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@musedam',
  },
}
