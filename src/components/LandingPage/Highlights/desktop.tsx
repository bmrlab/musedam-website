'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller } from 'swiper/modules'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'

import Toc from './toc'

import 'swiper/css'
import 'swiper/css/controller'
import 'swiper/css/pagination'

import { twx } from '@/utilities/cn'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'

import {
  AIGenerateImageGroup,
  CollaborateImageGroup,
  CollectImageGroup,
  OrganizeImageGroup,
} from '@/components/LandingPage/Highlights/image-group'
import { Highlight } from '@/components/LandingPage/Highlights/index'
import { BlackButton } from '@/components/StyleWrapper/button'
import { useHighlightTranslation } from '@/app/i18n/client'

export default function HighlightsDesktop({ data }: { data: Highlight[] }) {
  const { t } = useHighlightTranslation()
  const [firstSwiper, setFirstSwiper] = useState<SwiperClass>()
  const [secondSwiper, setSecondSwiper] = useState<SwiperClass>()
  const [animationStep, setAnimationStep] = useState(0) // 用于跟踪当前动画步骤
  const [swiperIndex, setSwiperIndex] = useState(0)
  const [animateKey, setAnimateKey] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ['start start', 'end end'],
  })

  const scrollToProgress = useCallback((progress: number) => {
    requestAnimationFrame(() => {
      const element = carouselRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()

      const targetScroll = 4000 * Math.min(Math.max(progress, 0), 1)
      window.scrollTo({
        top: rect.top + targetScroll + window.scrollY,
      })
    })
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleScrollEnd = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        // 确保滚动结束后到达最终位置
        if (scrollYProgress.get() >= 0.9) {
          firstSwiper?.slideTo(3)
        }
        if (scrollYProgress.get() <= 0.1) {
          firstSwiper?.slideTo(0)
        }
      }, 50)
    }

    document.addEventListener('scroll', handleScrollEnd, { passive: true })

    return () => {
      document.removeEventListener('scroll', handleScrollEnd)
      clearTimeout(timer)
    }
  }, [firstSwiper, scrollYProgress])

  // const debouncedSlideChange = useDebouncedCallback((latest: number) => {
  //   if (latest >= 0.1 && latest < 0.3) {
  //     firstSwiper?.slideTo(0)
  //   } else if (latest >= 0.3 && latest < 0.5) {
  //     firstSwiper?.slideTo(1)
  //   } else if (latest >= 0.5 && latest < 0.7) {
  //     firstSwiper?.slideTo(2)
  //   } else if (latest >= 0.7 && latest < 0.9) {
  //     firstSwiper?.slideTo(3)
  //   }
  // }, 100)

  useMotionValueEvent(scrollYProgress, 'change', (latest: number) => {
    if (latest >= 0.1 && latest < 0.3) {
      firstSwiper?.slideTo(0)
    } else if (latest >= 0.3 && latest < 0.5) {
      firstSwiper?.slideTo(1)
    } else if (latest >= 0.5 && latest < 0.7) {
      firstSwiper?.slideTo(2)
    } else if (latest >= 0.7 && latest < 0.9) {
      firstSwiper?.slideTo(3)
    }
  })

  const handleAnimationComplete = useCallback(
    (i: number) => {
      if (animationStep < i) {
        setAnimationStep(i)
      }
    },
    [animationStep],
  )
  const isBuildFinished = useCallback((i: number) => animationStep >= i, [animationStep])

  const handleSlideChange = (swiper) => {
    if (swiperIndex !== swiper.activeIndex) {
      setSwiperIndex(swiper.activeIndex)
      setAnimateKey((prev) => prev + 1) // 更新动画关键帧
    }
    setAnimationStep(0)
  }

  return (
    <div
      ref={carouselRef}
      style={{
        background: data[swiperIndex].bgColor,
      }}
      className="grid h-[8000px] w-full grid-cols-9"
    >
      <SwiperContentContainer className="py-[80px] pl-[30px] pr-[80px] transition-colors duration-500 ease-in-out">
        <Toc
          data={data.map((d) => d.title)}
          activeIndex={swiperIndex}
          setActiveIndex={(index) => {
            firstSwiper?.slideTo(index)
            if (index === 0) {
              scrollToProgress(0.1)
            } else if (index === 1) {
              scrollToProgress(0.3)
            } else if (index === 2) {
              scrollToProgress(0.5)
            } else if (index === 3) {
              scrollToProgress(0.7)
            }
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
          preventInteractionOnTransition={true}
          onSlideChange={(swiper) => {
            swiperIndex !== swiper.activeIndex && setSwiperIndex(swiper.activeIndex)
            handleSlideChange(swiper)
          }}
          modules={[Controller]}
          className="h-[765px] w-full"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index} className="flex h-full flex-col justify-center pl-[60px]">
              <div key={`${animateKey}-${index}`} className="flex h-full flex-col justify-center">
                <motion.h1
                  className="font-baskervville text-[48px] font-normal leading-[54.91px] text-[#141414]"
                  initial={{ opacity: 0, x: '-10%' }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  onAnimationComplete={() => handleAnimationComplete(1)}
                >
                  {item.title}
                </motion.h1>
                <motion.div
                  className="mt-6 flex flex-col gap-3 font-mono"
                  initial={{ opacity: 0, x: '-10%' }}
                  animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1 }}
                >
                  {item.description.map((desc, index) => (
                    <p
                      key={index}
                      className="w-full text-[16px] font-light leading-[26px] text-[#141414]"
                    >
                      {desc}
                    </p>
                  ))}
                  {item.list && (
                    <ul className="flex list-inside list-disc flex-col gap-3 text-[16px] font-light leading-[24px] text-[#141414]">
                      {item.list?.map((list, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <div className="size-1 rounded-full bg-black"></div>
                          {list}
                        </div>
                      ))}
                    </ul>
                  )}
                  {item.point && (
                    <div className="flex flex-col gap-3 pt-6">
                      {item.point?.map((point, index) => (
                        <div key={index} className="space-y-2">
                          {/* 圆点 */}
                          <h3 className="flex items-center gap-1.5 text-[16px] font-medium leading-[24px] text-[#141414]">
                            <div className="size-1 rounded-full bg-black"></div>
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
                  <BlackButton className="rounded-[8px] px-[42.5px] py-[14px] font-mono text-white">
                    {t('highlight.button')}
                  </BlackButton>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperContentContainer>
      <SwiperContentContainer>
        <Swiper
          speed={0}
          cssMode={false}
          draggable={false}
          allowTouchMove={false}
          preventInteractionOnTransition={true}
          onSwiper={setFirstSwiper}
          controller={{ control: secondSwiper }}
          direction={'vertical'}
          modules={[Controller]}
          className="h-[540px] w-full"
        >
          <SwiperSlide
            style={{
              display: 'flex',
            }}
            className="items-center justify-center"
          >
            <ImageContainer>
              <CollectImageGroup key={animateKey} isBuildFinished={isBuildFinished} />
            </ImageContainer>
          </SwiperSlide>
          <SwiperSlide
            style={{
              display: 'flex',
            }}
            className="items-center justify-center"
          >
            <ImageContainer>
              <OrganizeImageGroup key={animateKey} isBuildFinished={isBuildFinished} />
            </ImageContainer>
          </SwiperSlide>
          <SwiperSlide
            style={{
              display: 'flex',
            }}
            className="items-center justify-center"
          >
            <ImageContainer>
              <CollaborateImageGroup key={animateKey} isBuildFinished={isBuildFinished} />
            </ImageContainer>
          </SwiperSlide>
          <SwiperSlide
            style={{
              display: 'flex',
            }}
            className="items-center justify-center"
          >
            <ImageContainer>
              <AIGenerateImageGroup key={animateKey} isBuildFinished={isBuildFinished} />
            </ImageContainer>
          </SwiperSlide>
        </Swiper>
      </SwiperContentContainer>
    </div>
  )
}

const ImageContainer = twx.div`w-full h-[480px] flex justify-center items-center`

const SwiperContentContainer = twx.div`sticky top-[80px] col-span-4 flex h-screen w-full items-center justify-center`
