'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { twx } from '@/utilities/cn'
import useIsMobile from '@/hooks/useIsMobile'
import BannerDesktop from './Desktop'
import BannerMobile from './Mobile'
import { useEffect, useRef } from 'react'

export default function Banner() {
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)

  // 滚动条居中
  useEffect(() => {
    if (isMobile && containerRef.current) {
      const container = containerRef.current
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2
    }
  }, [isMobile])

  return (
    <div
      ref={containerRef}
      className="no-scrollbar w-full overflow-y-hidden overflow-x-scroll px-6"
    >
      {isMobile ? <BannerMobile /> : <BannerDesktop />}
    </div>
  )
}

export const MotionImage = motion.create(Image)

export const ShadowImage = twx(Image)`shadow-[0_1.17px_17.6px_2.35px_#00000014]`
export const ShadowImageRounded = twx(ShadowImage)`rounded-[4.69px]`
export const MotionShadowImageRounded = motion.create(ShadowImageRounded)

export const ShadowRoundedFullImage = twx(ShadowImage)`rounded-full`
export const MotionShadowRoundedFullImage = motion.create(ShadowRoundedFullImage)

export const FlexColContainer = twx.div`flex flex-col`

export const RelativeContainer = twx.div`relative`

export const AbsXCenterContainer = twx.div`absolute left-1/2 transform -translate-x-1/2`
