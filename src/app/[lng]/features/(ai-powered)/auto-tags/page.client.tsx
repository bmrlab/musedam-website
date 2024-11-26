'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { RelativeContainer } from '@/components/StyleWrapper/Container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const ImageBasePath = '/Features/Auto-Tags'
  const { getUrl } = usePublicUrl(ImageBasePath)
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #CEDBFF 0%, #FDE1A9 100%)"
      handleAnimationComplete={handleAnimationComplete}
      className="justify-center md:pl-[60px]"
    >
      <RelativeContainer>
        <MotionImage
          src={`${ImageBasePath}/Auto-Tags-Images.png`}
          width={isMobile ? 232.68 : 456.8}
          height={isMobile ? 240.23 : 471.61}
          alt="Auto-Tags-Images"
          initial={{ y: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <MotionShadowImage
          src={getUrl('Auto-Tags-Example.png')}
          width={isMobile ? 69.51 : 136.45}
          height={isMobile ? 49.56 : 97.3}
          alt="Auto-Tags-Example"
          className="absolute bottom-[20.03px] right-[-48.72px] md:bottom-[39.51px] md:right-[-81.2px]"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        <MotionImage
          src={getUrl('Auto-Tags-Group.png')}
          width={isMobile ? 101.87 : 200}
          height={isMobile ? 125.2 : 238}
          alt="Auto-Tags-Group"
          className="absolute right-[-41.36px] top-[30.05px] md:right-[-95.65px]  md:top-[59px]"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(2)}
        />
      </RelativeContainer>
    </FeaturesContainer>
  )
}
