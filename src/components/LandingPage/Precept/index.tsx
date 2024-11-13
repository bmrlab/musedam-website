'use client'

import 'swiper/css/grid'
import 'swiper/css'
import 'swiper/css/autoplay'
import SlowScrollCards from '@/components/LandingPage/Precept/SlowScrollCards'
import { preceptData } from '@/components/LandingPage/Precept/mock'

export default function Precept() {
  return (
    <div className="flex w-full flex-col items-center bg-black py-[60px] md:py-[80px]">
      <div className="grid justify-items-center gap-6 font-mono text-white">
        <h1 className="font-baskervville text-[38px] font-normal leading-[43.47px] md:text-[48px] md:leading-[55px]">
          Trusted by the Best
        </h1>
        <span className="font-mono text-[14px] font-light leading-[24px] md:text-[16px]">
          Discover What Our Community Loves About Muse
        </span>
      </div>
      <div className="mt-[60px] w-screen">
        <SlowScrollCards data={preceptData} />
      </div>
    </div>
  )
}
