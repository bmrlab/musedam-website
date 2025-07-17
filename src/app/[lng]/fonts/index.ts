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

export const euclidCircularALight = localFont({
  src: './Euclid_Circular_A_Light.ttf',
  display: 'swap',
  variable: '--font-euclid_circular_a_light',
})

export const featureDisplayRegularTrial = localFont({
  src: './FeatureDisplay-Regular-Trial.otf',
  display: 'swap',
  variable: '--font-featureDisplay-regular-trial',
})