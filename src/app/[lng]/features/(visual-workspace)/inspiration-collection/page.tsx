/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-22 10:02:46
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-22 14:56:09
 * @FilePath: /musedam-website/src/app/[lng]/features/(visual-workspace)/inspiration-collection/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import TextDisplay from '@/app/[lng]/features/_components/TextDisplay'
import fetchData from '@/app/[lng]/features/(team-collaboration)/data'
import { ssTranslation } from '@/app/i18n'

import PageClient from './page.client'

export default async function InspirationCollectionPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { heroData, showcaseData, textDisplayData } = await fetchData({
    ns: 'inspiration-collection',
    lng,
    showcaseLength: 6,
    textDisplayLength: 4,
  })
  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <PageClient />
      </Showcase>
      <TextDisplay {...textDisplayData} />
    </div>
  )
}

export async function generateMetadata({ params }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await ssTranslation(params.lng, 'seo')
  return {
    title: t('features.inspiration-collection.title'),
    description: t('features.inspiration-collection.description'),
  }
}
