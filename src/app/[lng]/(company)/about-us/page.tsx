/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-22 10:56:51
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-22 11:26:46
 * @FilePath: /musedam-website/src/app/[lng]/(company)/about-us/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Metadata } from 'next'

import { MetadataProps, PropsWithLng } from '@/types/page'
import HomeHero from '@/components/About/Hero'
import InvestorsCards from '@/components/About/InvestorsCards'
import OurStory from '@/components/About/OurStory'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'

export default async function AboutUsPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <FlexColContainer className="w-full items-center">
      <HomeHero />
      <OurStory />
      <InvestorsCards />
      <SubscribeBlock lng={lng} className="w-full" />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)

  return {
    title: t('about-us.title'),
    description: t('about-us.description'),
  }
}
