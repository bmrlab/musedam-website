'use client'

import { useMemo } from 'react'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import { MotionImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

const IMAGE_HEIGHT = 59.65
const IMAGE_HEIGHT_MOBILE = 30.38

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const isMobile = useIsMobile()

  const imageHeight = useMemo(() => (isMobile ? IMAGE_HEIGHT_MOBILE : IMAGE_HEIGHT), [isMobile])

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #FFF1EB 0%, #ACE0F9 100%)"
      handleAnimationComplete={handleAnimationComplete}
      className="w-fit justify-items-start gap-[6.83px] md:w-fit md:gap-[13.41px]"
    >
      <MotionImage
        src="/assets/Features/70+Formats/70+Formats1.png"
        width={isMobile ? 237.08 : 465.43}
        height={imageHeight}
        alt="70+Formats1"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      <MotionImage
        src="/assets/Features/70+Formats/70+Formats2.png"
        width={isMobile ? 237.08 : 465.43}
        height={imageHeight}
        alt="70+Formats2"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
      />
      <MotionImage
        src="/assets/Features/70+Formats/70+Formats3.png"
        width={isMobile ? 237.08 : 465.43}
        height={imageHeight}
        alt="70+Formats3"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.4, ease: 'easeInOut' }}
      />
      <MotionImage
        src="/assets/Features/70+Formats/70+Formats4.png"
        width={isMobile ? 105.79 : 207.68}
        height={imageHeight}
        alt="70+Formats4"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6, ease: 'easeInOut' }}
      />
      <MotionImage
        src="/assets/Features/70+Formats/70+Formats5.png"
        width={isMobile ? 269.9 : 529.86}
        height={imageHeight}
        alt="70+Formats5"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
      />
      <MotionImage
        src="/assets/Features/70+Formats/70+Formats6.png"
        width={isMobile ? 302.72 : 594.3}
        height={imageHeight}
        alt="70+Formats6"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
      />
      <MotionImage
        src="/assets/Features/70+Formats/70+Formats7.png"
        width={isMobile ? 105.79 : 207.68}
        height={imageHeight}
        alt="70+Formats7"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2, ease: 'easeInOut' }}
      />
    </FeaturesContainer>
  )
}
