'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { RelativeContainer } from '@/components/StyleWrapper/Container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

const ImageBasePath = '/assets/Features/Data-Statistics'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl(ImageBasePath)
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #2B5876 0%, #4E4376 100%)"
      handleAnimationComplete={handleAnimationComplete}
    >
      <RelativeContainer className="w-fit md:ml-[50px]">
        <MotionImage
          src={getUrl('Data-Statistics-List.png')}
          width={isMobile ? 237.88 : 467}
          height={isMobile ? 294.93 : 579}
          alt="Data-Statistics-List"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <MotionShadowImage
          src={getUrl('Data-Statistics-Card.png')}
          width={isMobile ? 171.3 : 335.9}
          height={isMobile ? 51.17 : 100.47}
          alt="Data-Statistics-Card"
          className="absolute right-[-43.25px] top-[129.89px] rounded-[13.21px] shadow-[0px_4px_30px_4px_#00000014] md:right-[-84.9px] md:top-[255px]"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
        />
      </RelativeContainer>
    </FeaturesContainer>
  )
}
