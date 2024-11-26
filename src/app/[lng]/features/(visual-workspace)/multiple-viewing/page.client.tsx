'use client'

import { useMemo } from 'react'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { MotionImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

const IMAGE_WIDTH = 188.78
const IMAGE_HEIGHT = 387.95
const IMAGE_HEIGHT_MOBILE = 96.16
const IMAGE_WIDTH_MOBILE = 197.61

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl('/Features/Multiple-Viewing')
  const isMobile = useIsMobile()

  const { width, height } = useMemo(() => {
    return isMobile
      ? { width: IMAGE_WIDTH_MOBILE, height: IMAGE_HEIGHT_MOBILE }
      : { width: IMAGE_WIDTH, height: IMAGE_HEIGHT }
  }, [isMobile])

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #ACCBEE 0%, #E7F0FD 100%)"
      handleAnimationComplete={handleAnimationComplete}
      className="grid-cols-3 justify-items-center gap-[12.47px] px-6"
    >
      <MotionImage
        src={getUrl('Multiple-Viewing1.png')}
        width={width}
        height={height}
        alt="Multiple-Viewing1"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
        onAnimationComplete={() => handleAnimationComplete(1)}
      />
      <MotionImage
        src={getUrl('Multiple-Viewing2.png')}
        width={width}
        height={height}
        alt="Multiple-Viewing2"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
      />
      <MotionImage
        src={getUrl('Multiple-Viewing3.png')}
        width={width}
        height={height}
        alt="Multiple-Viewing3"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.4, ease: 'easeInOut' }}
      />
    </FeaturesContainer>
  )
}
