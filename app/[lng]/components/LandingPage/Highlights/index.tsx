'use client'

import { useCallback, useState } from 'react'
import { Controller, Mousewheel, Pagination } from 'swiper/modules'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'

import { data } from './mock'
import Toc from './toc'

import 'swiper/css'
import 'swiper/css/controller'

import 'swiper/css/pagination'
import { motion } from 'framer-motion'
import {
  AIGenerateImageGroup,
  CollaborateImageGroup,
  CollectImageGroup,
  OrganizeImageGroup,
} from "@/[lng]/components/LandingPage/Highlights/image-group";
import { twx } from '@/lib/utils'

export default function SwiperBlock() {
  const [firstSwiper, setFirstSwiper] = useState<SwiperClass>(null)
  const [secondSwiper, setSecondSwiper] = useState<SwiperClass>(null)
  const [animationStep, setAnimationStep] = useState(0) // 用于跟踪当前动画步骤

  const [swiperIndex, setSwiperIndex] = useState(0)

  const [animateKey, setAnimateKey] = useState(0)

  const handleAnimationComplete = useCallback(
    (i: number) => {
      if (animationStep < i) {
        setAnimationStep(i)
      }
    },
    [animationStep],
  )
  const isBuildFinished = useCallback((i: number) => animationStep >= i, [animationStep])

  const handleSlideChange = swiper => {
    if (swiperIndex !== swiper.activeIndex) {
      setSwiperIndex(swiper.activeIndex)
      setAnimateKey(prev => prev + 1) // 更新动画关键帧
    }
    setAnimationStep(0)
  }

  return (
    <div className="grid w-full grid-cols-9">
      <div className="col-span-4 flex w-full items-center justify-center py-[80px] pl-[30px] pr-[80px]">
        <Toc
          data={data.map(d => d.title)}
          activeIndex={swiperIndex}
          setActiveIndex={index => {
            firstSwiper?.slideTo(index)
          }}
          className="w-fit self-start"
        />
        <Swiper
          cssMode={false}
          draggable={false}
          allowTouchMove={false}
          onSwiper={setSecondSwiper}
          controller={{ control: firstSwiper }}
          direction={'vertical'}
          spaceBetween={30}
          onSlideChange={swiper => {
            swiperIndex !== swiper.activeIndex && setSwiperIndex(swiper.activeIndex)
            handleSlideChange(swiper)
          }}
          modules={[Controller]}
          className="h-[605px] w-full"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index} className="flex h-full flex-col justify-center pl-[60px]">
              <div key={`${animateKey}-${index}`} className="flex h-full flex-col justify-center">
                <motion.h1
                  className="text-[48px] font-normal leading-[54.91px] text-[#141414]"
                  initial={{ opacity: 0, x: '-10%' }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  onAnimationComplete={() => handleAnimationComplete(1)}
                >
                  {item.title}
                </motion.h1>
                <motion.div
                  className="mt-6 space-y-3"
                  initial={{ opacity: 0, x: '-10%' }}
                  animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1 }}
                >
                  {item.description.map((desc, index) => (
                    <p
                      key={index}
                      className="w-full text-[16px] font-light leading-[24px] text-[#141414]"
                    >
                      {desc}
                    </p>
                  ))}
                  {item.list && (
                    <div className="pt-3">
                      <ul className="list-inside list-disc text-[16px] font-light leading-[24px] text-[#141414]">
                        {item.list?.map((list, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <div className="h-1 w-1 rounded-full bg-black"></div>
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
                          <h3 className="flex items-center gap-1 text-[16px] font-medium leading-[24px] text-[#141414]">
                            <div className="h-1 w-1 rounded-full bg-black"></div>
                            {point.title}
                          </h3>
                          <p className="text-[16px] font-light leading-[24px] text-[#141414]">
                            {point.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0, y: '100%' }}
                  animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <button className="rounded-[8px] bg-black px-[42.5px] py-[14px] text-white">
                    Start for free
                  </button>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div
        style={{
          background: 'linear-gradient(157.66deg, #D4D6EA 14.56%, #DBCCD5 31.62%, #FB9D70 94.18%)',
        }}
        className="col-span-5 flex h-full w-full items-center justify-center"
      >
        <Swiper
          speed={0}
          cssMode={false}
          draggable={false}
          allowTouchMove={false}
          onSwiper={setFirstSwiper}
          controller={{ control: secondSwiper }}
          direction={'vertical'}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          mousewheel={{
            enabled: true,
            releaseOnEdges: true,
            thresholdDelta: 8,
            thresholdTime: 500,
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
          modules={[Mousewheel, Pagination, Controller]}
          className="h-[765px] w-full"
        >
          <SwiperSlide>
            <SizeFullCenterContainer>
              <CollectImageGroup key={animateKey} isBuildFinished={isBuildFinished} />
            </SizeFullCenterContainer>
          </SwiperSlide>
          <SwiperSlide>
            <SizeFullCenterContainer>
              <OrganizeImageGroup key={animateKey} isBuildFinished={isBuildFinished} />
            </SizeFullCenterContainer>
          </SwiperSlide>
          <SwiperSlide>
            <SizeFullCenterContainer>
              <CollaborateImageGroup key={animateKey} isBuildFinished={isBuildFinished} />
            </SizeFullCenterContainer>
          </SwiperSlide>
          <SwiperSlide>
            <SizeFullCenterContainer>
              <AIGenerateImageGroup key={animateKey} isBuildFinished={isBuildFinished} />
            </SizeFullCenterContainer>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  )
}

const SizeFullCenterContainer = twx.div`size-full flex justify-center items-center`
