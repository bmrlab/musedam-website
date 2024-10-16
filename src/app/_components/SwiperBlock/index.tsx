'use client'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/controller'
import 'swiper/css/effect-fade'

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Pagination, Mousewheel, Controller, EffectFade } from 'swiper/modules'
import { useState } from 'react'
import { data } from '@/app/_components/SwiperBlock/mock'
import Image from 'next/image'
import Toc from '@/app/_components/SwiperBlock/toc'

export default function SwiperBlock() {
  const [firstSwiper, setFirstSwiper] = useState<SwiperClass>(null)
  const [secondSwiper, setSecondSwiper] = useState<SwiperClass>(null)

  const [swiperIndex, setSwiperIndex] = useState(0)

  return (
    <div className="grid grid-cols-9 h-[765px] w-full">
      <div className="gap-[60px] py-[80px] pl-[30px] pr-[80px] col-span-4 w-full flex justify-center items-center ">
        <Toc
          data={data.map(d => d.title)}
          activeIndex={swiperIndex}
          setActiveIndex={index => {
            firstSwiper?.slideTo(index)
          }}
          className="self-start w-fit"
        />
        <Swiper
          onSwiper={setSecondSwiper}
          effect={'fade'}
          fadeEffect={{
            crossFade: true,
          }}
          controller={{ control: firstSwiper }}
          direction={'vertical'}
          spaceBetween={30}
          onSlideChange={swiper => {
            swiperIndex !== swiper.activeIndex && setSwiperIndex(swiper.activeIndex)
          }}
          modules={[Controller, EffectFade]}
          className="h-[605px] w-full"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index} className="flex flex-col h-full justify-center">
              <div className="flex flex-col h-full justify-center">
                <h1 className="font-normal text-[48px] leading-[54.91px] text-[#141414]">
                  {item.title}
                </h1>
                <div className="mt-6 space-y-3">
                  {item.description.map((desc, index) => (
                    <p key={index} className="text-[#141414] text-[16px] leading-[24px] font-light">
                      {desc}
                    </p>
                  ))}
                </div>
                {item.list && (
                  <div className="pt-3">
                    <ul className="list-disc list-inside text-[#141414] text-[16px] leading-[24px] font-light">
                      {item.list?.map((list, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-black"></div>
                          {list}
                        </div>
                      ))}
                    </ul>
                  </div>
                )}
                {item.point && (
                  <div className="pt-6">
                    {item.point?.map((point, index) => (
                      <div key={index} className="space-y-3">
                        {/* 圆点 */}
                        <h3 className="flex items-center gap-1 text-[#141414] text-[16px] leading-[24px] font-medium">
                          <div className="w-1 h-1 rounded-full bg-black"></div>
                          {point.title}
                        </h3>
                        <p className="text-[#141414] text-[16px] leading-[24px] font-light">
                          {point.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-12">
                  <button className="text-white bg-black rounded-[8px] px-[42.5px] py-[14px]">
                    Start for free
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div
        style={{
          background: 'linear-gradient(157.66deg, #D4D6EA 14.56%, #DBCCD5 31.62%, #FB9D70 94.18%)',
        }}
        className="col-span-5 w-full h-full flex justify-center items-center"
      >
        <Swiper
          onSwiper={setFirstSwiper}
          controller={{ control: secondSwiper }}
          direction={'vertical'}
          effect={'fade'}
          fadeEffect={{
            crossFade: true,
          }}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          mousewheel={{
            enabled: true,
            releaseOnEdges: true,
          }}
          onSlideChange={swiper => {
            setTimeout(function () {
              swiper.params.mousewheel.releaseOnEdges = false
            }, 200)
          }}
          onReachBeginning={swiper => {
            setTimeout(function () {
              swiper.params.mousewheel.releaseOnEdges = true
            }, 500)
          }}
          onReachEnd={swiper => {
            setTimeout(function () {
              swiper.params.mousewheel.releaseOnEdges = true
            }, 500)
          }}
          modules={[Mousewheel, Pagination, Controller, EffectFade]}
          className="relative w-[640px] h-[480px]"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <Image src={item.image} alt="" fill />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
