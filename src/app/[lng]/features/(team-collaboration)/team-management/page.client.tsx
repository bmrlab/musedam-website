'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { MotionImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

const ImageBasePath = '/Features/Team-Management'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl(ImageBasePath)
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #9795F0 0%, #FBC8D4 100%)"
      handleAnimationComplete={handleAnimationComplete}
      className="gap-[7.64px] md:gap-[15px]"
    >
      <MotionImage
        src={getUrl('Team-Management1.png')}
        width={isMobile ? 280.16 : 550}
        height={isMobile ? 106.46 : 206}
        alt="Team-Management1"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
        onAnimationComplete={() => handleAnimationComplete(1)}
      />
      <MotionImage
        src={getUrl('Team-Management2.png')}
        width={isMobile ? 280.16 : 550}
        height={isMobile ? 160.06 : 312.9}
        alt="Team-Management2"
        initial={{ x: '10%', opacity: 0 }}
        animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </FeaturesContainer>
  )
}
