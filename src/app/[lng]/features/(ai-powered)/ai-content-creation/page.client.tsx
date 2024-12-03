'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { MotionImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl('/assets/Features/Content-Creation')
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #C5EDF5 2.5%, #546498 100%)"
      handleAnimationComplete={handleAnimationComplete}
    >
      <FlexColContainer className="w-[268.58px] gap-[8.59px] md:w-[525.62px] md:gap-[16.82px]">
        <MotionImage
          src={getUrl('Content-Creation1.png')}
          width={isMobile ? 242.18 : 474}
          height={isMobile ? 114.34 : 223.3}
          alt="Content-Creation1"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <MotionImage
          src={getUrl('Content-Creation2.png')}
          width={isMobile ? 101.02 : 196.35}
          height={isMobile ? 24.37 : 47.69}
          alt="Content-Creation2"
          className="self-end"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(2)}
        />
        <MotionImage
          src={getUrl('Content-Creation3.png')}
          width={isMobile ? 242.18 : 474}
          height={isMobile ? 152.28 : 297.88}
          alt="Content-Creation3"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </FlexColContainer>
    </FeaturesContainer>
  )
}
