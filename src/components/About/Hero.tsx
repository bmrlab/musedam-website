'use client'

import { Button } from '@payloadcms/ui'
import Image from 'next/image'
import { CSSProperties, useEffect, useMemo, useState } from 'react'
import { useMeasure, useWindowScroll, useWindowSize } from 'react-use'
import Icons from '../icon'
import { useTranslation } from '@/app/i18n/client'
import Link from 'next/link'

const keyframes = [0.4, 0.45]

export default function HomeHero() {
  const { width: windowWidth } = useWindowSize()
  const [ref] = useMeasure<HTMLDivElement>()
  const paddingBottom = 2000
  const { t } = useTranslation('company')

  const { y: scrollTop } = useWindowScroll()

  const [windowHeight, seiCachedWindowHeight] = useState(0)

  useEffect(() => {
    seiCachedWindowHeight(global.window.innerHeight)
  }, [])

  const scrolledPrecent = Math.min(1, Math.max(0, scrollTop) / paddingBottom)

  const introBgStyle = useMemo(() => {
    return {
      transform: `translate3d(0, 0, 0) scale(${1 + scrolledPrecent}, ${1 + scrolledPrecent})`,
    }
  }, [scrolledPrecent])

  const introMaskStyle: CSSProperties = useMemo(() => {
    const scaleValue = 1.02 + Math.max(0, scrolledPrecent) * 20
    return {
      opacity: scrolledPrecent <= keyframes[0] ? 1 - scrolledPrecent / keyframes[0] : 0,
      visibility: scrolledPrecent < keyframes[0] ? 'inherit' : 'hidden',
      transform: `translate3d(0, 0, 0) scale(${scaleValue}, ${scaleValue})`,
    }
  }, [scrolledPrecent])

  const introFocusStyle: CSSProperties = useMemo(() => {
    return {
      transform: `translate3d(-50%, -${scrolledPrecent >= keyframes[1] ? 50 - (scrolledPrecent - keyframes[1]) * 10 : 50
        }%, 0)`,
    }
  }, [scrolledPrecent])
  return (
    <div
      className="hero-container w-full overflow-hidden"
      style={{
        height: `calc(100vh + ${paddingBottom}px)`,
        paddingBottom: `${paddingBottom}px`,
      }}
    >
      <div
        ref={ref}
        className={`flex max-h-screen w-full max-w-[100vw] translate-x-0 translate-y-0 flex-col justify-end overflow-hidden bg-black py-0 text-white lg:justify-center ${scrolledPrecent >= 1 ? 'relative' : 'fixed inset-0'
          }`}
        style={{
          width: `${windowWidth}px`,
          height: `${windowHeight}px`,
          transform: `translate(0, ${scrolledPrecent >= 1 ? paddingBottom.toString() + 'px' : '0'})`,
        }}
      >
        <div
          id="hero-bg"
          className={`absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat`}
          style={introBgStyle}
        >
          <Image src={'/Company/intro-background.jpeg'} className="absolute inset-0 hidden lg:block" fill alt="hero-bg" />
          <Image src={'/Company/intro-background-mobile.jpeg'} className="absolute inset-0 block lg:hidden" fill alt="hero-bg" />
        </div>
        <div
          id="hero-mask"
          className={`absolute inset-0 z-[2] bg-cover bg-right bg-no-repeat after:absolute after:inset-0 after:block after:content-[""]`}
          style={introMaskStyle}
        >
          <Image
            src={'/Company/intro-mask.svg'}
            className="absolute inset-0 hidden lg:block"
            fill
            alt="hero-mask"
            style={{
              objectFit: 'cover',
            }}
          />

          <Image
            src={'/Company/intro-mask-mobile.svg'}
            className="absolute inset-0 block lg:hidden"
            fill
            alt="hero-mask"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <div className="overlay absolute inset-0 z-[3] bg-transparent"></div>
        <div
          className={
            `3xl:px-40 absolute bottom-[18%] left-0 top-auto z-[4] w-full px-[30px] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:px-10 2xl:px-24${scrolledPrecent > keyframes[1] ? 'invisible opacity-0' : 'opacity-1 visible'
            }`}
        >
          <div className="max-w-[680px]">
            <h1 className="font-baskervville text-[48px] font-medium leading-[54.91px] md:text-[80px] md:leading-[91.52px]">
              {t("about-us.hero.head")}
            </h1>
            <Button className="mt-10 h-[48px] min-w-[180px] cursor-pointer rounded-full shadow shadow-transparent ring-2 ring-white transition-colors hover:bg-white hover:text-black hover:shadow-white md:mt-20"
            >
              <Link
                href={'/careers'}
                className='flex items-center justify-center gap-4'
              >
                <span className="inline-block font-mono">{t("about-us.hero.join.btn")}</span>
                <Icons.arrowRight width={16} height={10} />
              </Link>
            </Button>
          </div>
        </div>
        <div
          className={`3xl:px-40 absolute inset-0 z-[5] flex items-center justify-center bg-black/50 px-[30px] lg:px-10 2xl:px-24 ${scrolledPrecent > keyframes[1] ? 'visible' : 'invisible'
            }`}
          style={{
            opacity: ((scrolledPrecent - keyframes[1]) / 3) * 10,
          }}
        >
          <div className="container relative mx-auto h-full">
            <div
              className={`absolute left-1/2 top-1/2 z-[1] w-full lg:flex lg:items-start lg:justify-between`}
              style={introFocusStyle}
            >
              <div className="mb-[30px] w-full lg:mb-0 lg:w-1/2 2xl:w-[45%]">
                <h2 className="break-words text-[24px] font-medium leading-tight lg:text-[48px] lg:leading-[1.325] 2xl:text-[54px]">
                  {t("about-us.hero.head")}
                </h2>
              </div>

              <Button
                className="mt-10 h-[48px] min-w-[180px] cursor-pointer rounded-full shadow shadow-transparent ring-2 ring-white transition-colors hover:bg-white hover:text-black hover:shadow-white md:mt-20"
              >
                <Link
                  href={'/careers'}
                  className='flex items-center justify-center gap-4'
                >
                  <span className="inline-block font-mono">{t("about-us.hero.join.btn")}</span>
                  <Icons.arrowRight width={16} height={10} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
