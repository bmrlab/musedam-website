/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-12-03 10:27:16
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-12-05 12:19:07
 * @FilePath: /musedam-website/src/components/LandingPage/Precept/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import 'swiper/css/grid'
import 'swiper/css'
import 'swiper/css/autoplay'

import usePreceptData from '@/components/LandingPage/Precept/data'
import SlowScrollCards from '@/components/LandingPage/Precept/SlowScrollCards'
import { FadeInContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import { usePreceptTranslation } from '@/app/i18n/client'

export default function Precept() {
  const { t } = usePreceptTranslation()
  const { data } = usePreceptData()
  return (
    <div className="flex w-full flex-col items-center bg-black py-[60px] md:py-[80px]">
      <FadeInContainer className="grid justify-items-center gap-6 font-mono text-white">
        <h1 className="font-euclid text-[32px] font-normal leading-[43.47px] md:text-[48px] md:leading-[55px]">
          {t('precept.title')}
        </h1>
        <span className="font-mono text-[14px] font-light leading-[24px] md:text-[16px]">
          {t('precept.description')}
        </span>
      </FadeInContainer>
      <div className="mt-[60px] w-screen">
        <SlowScrollCards data={data} />
      </div>
    </div>
  )
}
