'use client'

import 'swiper/css/grid'
import 'swiper/css'
import 'swiper/css/autoplay'
import SlowScrollCards from "@/components/LandingPage/SlowScrollCards";

export default function Precept() {
  return (
    <div className="flex w-full flex-col items-center bg-black py-[80px]">
      <div className="grid justify-items-center gap-6 text-white">
        <h1 className="text-[48px] font-normal leading-[55px]">Trusted by the Best</h1>
        <span className="text-[16px] font-light leading-[24px]">
          Discover What Our Community Loves About Muse
        </span>
      </div>
      <div className="mt-[60px] w-screen">
        <SlowScrollCards />
      </div>
    </div>
  )
}


