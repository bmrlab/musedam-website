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
        <h1 className="font-euclid text-[38px] font-normal leading-[43.47px] md:text-[48px] md:leading-[55px]">
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
