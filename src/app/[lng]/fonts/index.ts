/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2025-04-23 16:29:04
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2025-07-10 15:01:24
 * @FilePath: /musedam-website/src/app/[lng]/fonts/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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


export const featureDisplayRegularTrial = localFont({
  src: './FeatureDisplay-Regular-Trial.otf',
  display: 'swap',
  variable: '--font-featureDisplay-regular-trial',
})