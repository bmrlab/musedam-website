'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { RelativeContainer } from '@/components/StyleWrapper/Container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const ImageBasePath = '/Features/MuseCopilot'
  const { getUrl } = usePublicUrl(ImageBasePath)
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #1A1FD0 0%, #0D106A 100%)"
      handleAnimationComplete={handleAnimationComplete}
    >
      <RelativeContainer>
        <MotionImage
          src={getUrl('MuseCopilot-Library.png')}
          width={isMobile ? 312.04 : 612.59}
          height={isMobile ? 229.22 : 450}
          alt="MuseCopilot-Library"
          initial={{ y: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <RelativeContainer className="absolute bottom-[47.7px] right-[90.21px] md:bottom-[93.65px] md:right-[177.1px]">
          <MotionShadowImage
            src={`${ImageBasePath}/MuseCopilot-Image.png`}
            width={isMobile ? 50.17 : 98.5}
            height={isMobile ? 57.74 : 113.35}
            alt="MuseCopilot-Image"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(2)}
          />
          <MotionShadowImage
            src={`${ImageBasePath}/MuseCopilot-Mouse.svg`}
            width={isMobile ? 13.69 : 26.89}
            height={isMobile ? 19.56 : 38.41}
            alt="MuseCopilot-Mouse.svg"
            className="absolute right-[-3.25px] top-[10.19px] md:right-[-6.39px] md:top-[20px]"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </RelativeContainer>
      </RelativeContainer>
    </FeaturesContainer>
  )
}
