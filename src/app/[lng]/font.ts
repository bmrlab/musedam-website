import { Baskervville, IBM_Plex_Mono } from 'next/font/google'

export const baskervville = Baskervville({
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-baskervville',
})

export const plexMono = IBM_Plex_Mono({
  weight: ['300', '400', '500'],
  style: ['normal'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-plex_mono',
})
