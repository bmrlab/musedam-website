'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { RelativeContainer } from '@/components/StyleWrapper/Container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl('/assets/Features/AI-Parsing')
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #FEEBE2 0%, #C2BEFF 100%)"
      handleAnimationComplete={handleAnimationComplete}
    >
      <RelativeContainer>
        <MotionImage
          src="/assets/Features/AI-Parsing/AI-Parsing-Images.png"
          width={isMobile ? 243.89 : 478.8}
          height={isMobile ? 263.61 : 517.51}
          alt="AI-Parsing-Images"
          initial={{ y: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <MotionShadowImage
          src="/assets/Features/AI-Parsing/AI-Parsing-Star.png"
          width={isMobile ? 12.22 : 24}
          height={isMobile ? 10.19 : 20}
          alt="AI-Parsing-Star"
          className="absolute bottom-[7.39px] right-[8.05px] md:bottom-[14.51px] md:right-[15.8px]"
          initial={{ opacity: 0 }}
          animate={isBuildFinished(1) ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(2)}
        />
        <MotionShadowImage
          src={getUrl('AI-Parsing-Summarization.png')}
          width={isMobile ? 158.92 : 312}
          height={isMobile ? 148.31 : 288}
          alt="AI-Parsing-Summarization"
          className="absolute bottom-[18.52px] right-[8.56px] md:bottom-[39.51px] md:right-[16.8px]"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
        />
      </RelativeContainer>
    </FeaturesContainer>
  )
}
