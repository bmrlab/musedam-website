import React from 'react'
import { Metadata } from 'next'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import { Providers } from './_providers'
import { InitTheme } from './_providers/Theme/InitTheme'
import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

import './_css/app.scss'
import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="no-scrollbar">
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
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
  openGraph: mergeOpenGraph(),
}
