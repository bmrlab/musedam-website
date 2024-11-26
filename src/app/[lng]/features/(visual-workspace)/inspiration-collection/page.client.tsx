'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import { RelativeContainer } from '@/components/StyleWrapper/Container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import FeaturesContainer from '@/app/[lng]/features/_components/Container'

const ImageBasePath = '/Features/Inspiration-Collection'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl(ImageBasePath)
  const isMobile = useIsMobile()

  return (
    <FeaturesContainer
      bgColor="linear-gradient(180deg, #84FAB0 0%, #8FD3F4 100%)"
      handleAnimationComplete={handleAnimationComplete}
    >
      <div className="flex h-9 w-[278.73px] justify-between md:h-[72px] md:w-full md:px-[46px]">
        <motion.div
          className="grid grid-cols-2 gap-0"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <Image
            src={`${ImageBasePath}/Inspiration-Collection-Midjourney.png`}
            width={isMobile ? 25.36 : 49.79}
            height={isMobile ? 25.36 : 49.79}
            alt="Inspiration-Collection-Midjourney"
            className="z-[1]"
          />
          <Image
            src={`${ImageBasePath}/Inspiration-Collection-Discord.png`}
            width={isMobile ? 28.43 : 55.82}
            height={isMobile ? 28.43 : 55.82}
            alt="Inspiration-Collection-Discord"
            className="ml-[-5.49px] self-end md:ml-[-13px]"
          />
        </motion.div>
        <MotionImage
          src={`${ImageBasePath}/Inspiration-Collection-Browsers.png`}
          width={isMobile ? 92.07 : 180.74}
          height={isMobile ? 31.9 : 62.63}
          alt="Inspiration-Collection-Browsers"
          className="h-fit self-end"
          onAnimationComplete={() => handleAnimationComplete(1)}
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>
      <MotionImage
        src={`${ImageBasePath}/Inspiration-Collection-URL.png`}
        width={isMobile ? 265.06 : 516.44}
        height={isMobile ? 19.87 : 39}
        alt="Inspiration-Collection-URL"
        className="mt-[14.77px] md:mt-[29px]"
        initial={{ y: '-10%', opacity: 0 }}
        animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      <RelativeContainer className="mt-[10.19px] md:mt-[20px]">
        <MotionShadowImage
          src={`${ImageBasePath}/Inspiration-Collection-Images.png`}
          width={isMobile ? 236.88 : 465.03}
          height={isMobile ? 234.16 : 459.7}
          alt="Inspiration-Collection-Images"
          initial={{ y: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(4)}
        />
        <MotionImage
          src={getUrl('Inspiration-Collection-Drag.png')}
          width={isMobile ? 98.08 : 192.54}
          height={isMobile ? 98.08 : 192.54}
          alt="Inspiration-Collection-Drag"
          className="absolute right-[-29.29px] top-[73.35px] md:right-[-57.51px] md:top-[144px]"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </RelativeContainer>
    </FeaturesContainer>
  )
}
