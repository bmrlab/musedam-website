import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { GoogleAnalytics } from '@next/third-parties/google'

import './globals.css'

import { getServerSession } from '@/utilities/auth'
import { dir } from 'i18next'

import { TailwindIndicator } from '@/components/ui/tailwind-indicator'
import { Toaster } from '@/components/ui/toaster'
import { CookieConsent } from '@/components/CookieConsent'
import { languages } from '@/app/i18n/settings'

import {
  euclidCircularA,
  euclidCircularALight,
  featureDisplayRegularTrial,
  plexMono,
} from './fonts'
import { LayoutContent } from './layout-content'

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
  const user = await getServerSession()

  return (
    <html
      lang={lng}
      dir={dir(lng)}
      suppressHydrationWarning
      className={` ${plexMono.variable} ${euclidCircularA.variable} ${featureDisplayRegularTrial.variable} ${euclidCircularALight.variable}`}
    >
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Providers lng={lng} country={process.env.DEPLOY_REGION?.toLowerCase()}>
          <LayoutContent isGlobal={isGlobal} user={user}>
            {children}
          </LayoutContent>
          {isGlobal && <CookieConsent />}
        </Providers>
        <TailwindIndicator />
        <Toaster />
        {/* Google Ads Conversion Tracking */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17521133807"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17521133807');
          `}
        </Script> */}
      </body>

      {/* Google Analytics (if you have GA_TRACKING_ID) */}
      {process.env.GA_TRACKING_ID ? <GoogleAnalytics gaId={process.env.GA_TRACKING_ID} /> : null}
      {process.env.GADS_TRACKING_ID ? (
        <Script
          id="google-ads-script"
          dangerouslySetInnerHTML={{
            __html: `
  (function () {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', '${process.env.GADS_TRACKING_ID}');
    }
  })()`,
          }}
        />
      ) : null}
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
    other: {
      'baidu-site-verification': 'codeva-0pKoR0N2fQ',
    },
  }
  return metadata
}
