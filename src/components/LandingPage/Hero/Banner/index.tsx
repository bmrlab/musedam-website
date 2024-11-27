'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn, twx } from '@/utilities/cn'
import { motion } from 'framer-motion'

import useIsMobile from '@/hooks/useIsMobile'

import BannerDesktop from './Desktop'
import BannerMobile from './Mobile'

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
      className={cn(
        'no-scrollbar w-full px-6 md:px-0',
        isMobile ? 'overflow-y-hidden overflow-x-scroll' : 'overflow-visible ',
      )}
    >
      <BannerMobile className="md:hidden" />
      <BannerDesktop className="hidden lg:flex" />
    </div>
  )
}

export const ShadowImage = twx(Image)`shadow-[0_1.17px_17.6px_2.35px_#00000014]`
export const ShadowImageRounded = twx(ShadowImage)`rounded-[4.69px]`
export const MotionShadowImageRounded = motion.create(ShadowImageRounded)

export const ShadowRoundedFullImage = twx(ShadowImage)`rounded-full`
export const MotionShadowRoundedFullImage = motion.create(ShadowRoundedFullImage)
