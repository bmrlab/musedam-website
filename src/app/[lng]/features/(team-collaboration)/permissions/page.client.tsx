'use client'

import { cn } from '@/utilities/cn'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import useIsZhLng from '@/hooks/useIsZhLng'
import usePublicUrl from '@/hooks/usePublicUrl'
import { MotionImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

const ImageBasePath = '/assets/Features/Permissions'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl(ImageBasePath)
  const isMobile = useIsMobile()
  const isZhLng = useIsZhLng()
  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #616161 0%, #9BC5C3 100%)"
      handleAnimationComplete={handleAnimationComplete}
      className="w-fit gap-[7.04px] md:w-fit md:gap-[13.67px]"
      containerClassName={cn(isZhLng && 'py-[100px]')}
    >
      <MotionImage
        src={`${ImageBasePath}/Permissions-Members.png`}
        width={isMobile ? 89.28 : 175.28}
        height={isMobile ? 288.79 : 52.33}
        alt="Permissions-Members"
        className="justify-self-end"
        initial={{ x: '10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
        onAnimationComplete={() => handleAnimationComplete(1)}
      />
      <MotionImage
        src={getUrl('Permissions-Modal.png')}
        width={isMobile ? 288.79 : 566.95}
        height={isMobile ? 192.1 : 377.43}
        quality={100}
        unoptimized={true}
        alt="Permissions-Modal"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </FeaturesContainer>
  )
}
