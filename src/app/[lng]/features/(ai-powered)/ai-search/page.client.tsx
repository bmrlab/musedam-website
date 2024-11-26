'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { RelativeContainer } from '@/components/StyleWrapper/Container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl('/Features/AI-Search')
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #9DAFC7 0%, #C3CFE8 100%)"
      handleAnimationComplete={handleAnimationComplete}
    >
      <div className="flex w-full items-center justify-between pl-[53px] pr-[47.17px]">
        <MotionShadowImage
          src={getUrl('AI-Search-Tags.png')}
          width={isMobile ? 116.98 : 229}
          height={isMobile ? 16.15 : 31}
          alt="AI-Search-Tags"
          className="h-fit"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        <MotionImage
          src={getUrl('AI-Search-Input.png')}
          width={isMobile ? 113.51 : 222.83}
          height={isMobile ? 17.83 : 35}
          alt="AI-Search-Input"
          className="drop-shadow-[0px_0px_0px_2px_#3366FF33]"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </div>
      <RelativeContainer className="mt-[19.1px] md:mt-[37.5px]">
        <MotionImage
          src="/Features/AI-Search/AI-Search-Images.png"
          width={isMobile ? 232.68 : 456.8}
          height={isMobile ? 240.23 : 471.61}
          alt="AI-Search-Images"
          initial={{ y: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <MotionShadowImage
          src="/Features/AI-Search/AI-Search-Color.png"
          width={isMobile ? 88.69 : 174.11}
          height={isMobile ? 63.67 : 125}
          alt="AI-Search-Color.png"
          className="absolute bottom-[18.14px] right-[-36.32px] md:bottom-[35.61px] md:right-[-71.31px]"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
        />
      </RelativeContainer>
    </FeaturesContainer>
  )
}
