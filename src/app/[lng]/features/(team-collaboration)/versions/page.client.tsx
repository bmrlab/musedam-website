'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import { MotionImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

const ImageBasePath = '/Features/Versions'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #CCD8E4 0%, #FFFFFF 100%)"
      handleAnimationComplete={handleAnimationComplete}
      className="justify-center md:py-[70px]"
    >
      <MotionImage
        src={`${ImageBasePath}/Versions1.png`}
        width={isMobile ? 232.78 : 457}
        height={isMobile ? 196.56 : 385.88}
        alt="Versions1"
        initial={{ y: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }}
        onAnimationComplete={() => handleAnimationComplete(1)}
      />
      <div className="mt-[9.17px] flex gap-[6.75px] justify-self-start md:mt-[18px] md:gap-[13.24px]">
        <MotionImage
          src={`${ImageBasePath}/Versions2.png`}
          width={isMobile ? 49.06 : 96.31}
          height={isMobile ? 49.06 : 96.31}
          alt="Versions2"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
        />
        <MotionImage
          src={`${ImageBasePath}/Versions3.png`}
          width={isMobile ? 70.52 : 138.45}
          height={isMobile ? 48.45 : 95.11}
          alt="Versions3"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </FeaturesContainer>
  )
}
