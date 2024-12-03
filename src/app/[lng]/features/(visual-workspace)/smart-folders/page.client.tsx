'use client'

import Image from 'next/image'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { MotionImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

const ImageBasePath = '/assets/Features/Smart-Folders'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl(ImageBasePath)
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #CFD9DF 0%, #E2EBF0 100%)"
      handleAnimationComplete={handleAnimationComplete}
    >
      <MotionImage
        src={`${ImageBasePath}/Smart-Folders-Group.png`}
        width={isMobile ? 207.32 : 407}
        height={isMobile ? 88.98 : 174.69}
        alt="Smart-Folders-Group"
        initial={{ y: '10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
        onAnimationComplete={() => handleAnimationComplete(1)}
      />
      <Image
        src={getUrl('Smart-Folders-Folder.png')}
        width={isMobile ? 61.39 : 120.52}
        height={isMobile ? 56.78 : 110.77}
        alt="Smart-Folders-Folder"
        className="mt-[5.25px] md:mt-[10.31px]"
      />
      <MotionImage
        src={getUrl('Smart-Folders-Settings.png')}
        width={isMobile ? 259.14 : 508.73}
        height={isMobile ? 129.97 : 253.65}
        alt="Smart-Folders-Settings"
        className="mt-[16.31px] md:mt-[34.23px]"
        initial={{ y: '-10%', opacity: 0 }}
        animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
      />
    </FeaturesContainer>
  )
}
