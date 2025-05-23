import React from 'react'
import type { Metadata } from 'next'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { GoogleAnalytics } from '@next/third-parties/google'

import './globals.css'

import { dir } from 'i18next'
import NextTopLoader from 'nextjs-toploader'

import { TailwindIndicator } from '@/components/ui/tailwind-indicator'
import { Toaster } from '@/components/ui/toaster'
import { CookieConsent } from '@/components/CookieConsent'
import Footer from '@/components/Footer'
import { Header } from '@/components/Header'
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
  const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'

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
        <Providers lng={lng} country={process.env.DEPLOY_REGION?.toLowerCase()}>
          <Header isGlobal={isGlobal} />
          <div className="flex flex-col items-center justify-center pt-[56px] md:pt-[70px]">
            <NextTopLoader
              color="#000"
              height={1}
              showSpinner={false} // 隐藏移动端右上角转圈圈
            />
            {children}
          </div>
          <Footer />
          {isGlobal && <CookieConsent />}
        </Providers>
        <TailwindIndicator />
        <Toaster />
      </body>
      {process.env.GA_TRACKING_ID ? <GoogleAnalytics gaId={process.env.GA_TRACKING_ID} /> : null}
    </html>
  )
}

export async function generateMetadata() {
  const metadata: Metadata = {
    metadataBase: new URL(process.env.SITE_SERVER_URL || 'https://www.musedam.cc'),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      creator: '@musedam',
    },
  }
  return metadata
}
