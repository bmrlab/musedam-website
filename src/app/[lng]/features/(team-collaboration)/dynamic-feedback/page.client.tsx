'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { RelativeContainer } from '@/components/StyleWrapper/Container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

const ImageBasePath = '/assets/Features/Dynamic-Feedback'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl(ImageBasePath)
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(153.22deg, #DBDBDA 4.46%, #FAF9E7 60%)"
      handleAnimationComplete={handleAnimationComplete}
      className="w-fit md:pl-1 md:pr-[31px]"
    >
      <MotionImage
        src={`${ImageBasePath}/Dynamic-Feedback1.png`}
        width={isMobile ? 75.39 : 148}
        height={isMobile ? 15.28 : 30}
        alt="Dynamic-Feedback1"
        className="mr-[-9.17px] justify-self-end md:mr-[13px]"
        initial={{ x: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
        onAnimationComplete={() => handleAnimationComplete(1)}
      />
      <MotionImage
        src={`${ImageBasePath}/Dynamic-Feedback.png`}
        width={isMobile ? 117.16 : 230}
        height={isMobile ? 18.34 : 36}
        alt="Dynamic-Feedback"
        className="mr-[-15.79px] justify-self-end md:mr-0"
        initial={{ y: '10%', opacity: 0 }}
        animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }}
      />
      <RelativeContainer className="mt-[10.19px] w-fit md:mt-5">
        <MotionImage
          src={`${ImageBasePath}/Dynamic-Feedback-Image.png`}
          width={isMobile ? 292.38 : 566.95}
          height={isMobile ? 239.41 : 377.43}
          alt="Dynamic-Feedback-Image"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <MotionShadowImage
          src={getUrl('Dynamic-Feedback-Comment.png')}
          width={isMobile ? 142.48 : 279.71}
          height={isMobile ? 42.79 : 83.19}
          alt="Dynamic-Feedback-Comment"
          className="absolute bottom-[28.01px] right-[-14.12px] shadow-[0px_4px_30px_4px_#00000014] md:bottom-[55.81px] md:right-[-27.71px]"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </RelativeContainer>
    </FeaturesContainer>
  )
}
