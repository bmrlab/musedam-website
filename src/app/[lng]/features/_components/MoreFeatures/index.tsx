/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-12-03 10:27:16
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-12-03 17:51:01
 * @FilePath: /musedam-website/src/app/[lng]/features/_components/MoreFeatures/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import Link from 'next/link'

import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import { HoverTranslateXArrowRight } from '@/components/StyleWrapper/icon'
import { useFeaturesTranslation } from '@/app/i18n/client'

import FeaturesCard from './card'
import { FeaturesEnum, useFeaturesCards } from './features'

export type MoreFeaturesProps = {
  titleI18nKey: string
  features: FeaturesEnum[]
}

export default function MoreFeatures({ titleI18nKey, features }: MoreFeaturesProps) {
  const { t } = useFeaturesTranslation()
  const FeaturesCards = useFeaturesCards()
  return (
    <FadeInUpContainer className="w-screen">
      <div className="flex flex-col items-center justify-center gap-2 px-6 pt-12 md:flex-row md:justify-between md:gap-0 md:px-[80px] md:pt-[82.5px]">
        <h2 className="font-euclid text-[35px] font-normal leading-[43.47px] tracking-[1px] text-[#141414] md:text-[64px] md:leading-[83.2px]">
          {t(titleI18nKey)}
        </h2>
        <Link
          href="/features"
          className="group flex items-center gap-2 font-mono text-[14px] leading-[28px] tracking-[2%] text-black"
        >
          <span className="underline-animation">{t('more-features.view-all')}</span>
          <HoverTranslateXArrowRight />
        </Link>
      </div>
      <div className="no-scrollbar flex gap-10 overflow-x-scroll px-6 pb-12 pt-10 md:px-[80px] md:pb-[120px] md:pt-[82.5px]">
        {features.map((feature, i) => (
          <FeaturesCard
            key={i}
            {...FeaturesCards[feature]}
            className="h-[406px] w-[280px] shrink-0 md:h-[522px] md:w-[333px] md:transition-transform md:duration-300 md:ease-in-out md:hover:-translate-y-5"
          />
        ))}
      </div>
    </FadeInUpContainer>
  )
}
