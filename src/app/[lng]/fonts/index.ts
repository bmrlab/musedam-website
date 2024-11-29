import { IBM_Plex_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const plexMono = IBM_Plex_Mono({
  weight: ['300', '400', '500'],
  style: ['normal'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-plex_mono',
})

export const euclidCircularA = localFont({
  src: './Euclid_Circular_A_Regular.ttf',
  display: 'swap',
  variable: '--font-euclid_circular_a',
})
