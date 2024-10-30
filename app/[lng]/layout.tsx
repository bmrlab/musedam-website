import React from 'react'
import { Metadata } from 'next'

import { AdminBar } from '@/[lng]/components/AdminBar'
import Footer from '@/[lng]/components/Footer'
import Header from '@/[lng]/components/Header'
import { Providers } from './_providers'
import { InitTheme } from './_providers/Theme/InitTheme'
import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

import '@/_css/app.scss'
import '../globals.css'

import { dir } from 'i18next'
import { languages } from '@/i18n/settings'
import { TailwindIndicator } from '@/components/ui/tailwind-indicator'
import { Baskervville, IBM_Plex_Mono } from 'next/font/google'

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
  return languages.map(lng => ({ lng }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lng: string }>
}) {
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  twitter: {
    card: 'summary_large_image',
    creator: '@musedam',
  },
  openGraph: mergeOpenGraph(),
}
