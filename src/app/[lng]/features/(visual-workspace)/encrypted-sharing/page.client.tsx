'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { RelativeContainer } from '@/components/StyleWrapper/Container'
import { MotionImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl('/Features/Encrypted-Sharing')
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #6A85B6 0%, #F5EFEF 100%)"
      handleAnimationComplete={handleAnimationComplete}
      className="h-[326px] md:h-[438px]"
    >
      <RelativeContainer>
        <MotionImage
          src={getUrl('Encrypted-Sharing-List.png')}
          width={isMobile ? 320.91 : 630}
          height={isMobile ? 143.68 : 282.08}
          alt="Encrypted-Sharing-List"
          initial={{ y: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <MotionImage
          src={getUrl('Encrypted-Sharing-Modal.png')}
          width={isMobile ? 171.4 : 336.5}
          height={isMobile ? 161.1 : 313.67}
          alt="Encrypted-Sharing-Modal"
          className="absolute right-[32.85px] top-[62.75px] rounded-[11.91px] shadow-[0px_4px_30px_4px_#00000014] md:right-[64.5px] md:top-[124.5px]"
          initial={{ y: '-10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
        />
      </RelativeContainer>
    </FeaturesContainer>
  )
}
