import React from 'react'
import type { Metadata } from 'next'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { AdminBar } from '@/components/AdminBar'

import './globals.css'

import { dir } from 'i18next'

import { TailwindIndicator } from '@/components/ui/tailwind-indicator'
import { Toaster } from '@/components/ui/toaster'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { getCountry } from '@/app/[lng]/country'
import { languages } from '@/app/i18n/settings'

import { euclidCircularA, plexMono } from './fonts'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lng: string }>
}) {
  const { lng } = await params
  const country = await getCountry(lng)

  return (
    <html
      lang={lng}
      dir={dir(lng)}
      suppressHydrationWarning
      className={` ${plexMono.variable} ${euclidCircularA.variable}`}
    >
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Providers lng={lng} country={country}>
          <AdminBar />
          <Header />
          <div className="flex flex-col items-center justify-center pt-[56px] md:pt-[70px]">
            {children}
          </div>
          <Footer />
        </Providers>
        <TailwindIndicator />
        <Toaster />
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
