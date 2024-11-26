'use client'

import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/Container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import Image from 'next/image'
import usePublicUrl from '@/hooks/usePublicUrl'

const ImageBasePath = '/Features/Inspiration-Collection'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl(ImageBasePath)

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #84FAB0 0%, #8FD3F4 100%)',
      }}
    >
      <motion.div
        className="grid w-[640px] justify-items-center"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <div className="flex h-[72px] w-full justify-between px-[46px]">
          <motion.div
            className="grid grid-cols-2 gap-0"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          >
            <Image
              src={`${ImageBasePath}/Inspiration-Collection-Midjourney.png`}
              width={49.79}
              height={49.79}
              alt="Inspiration-Collection-Midjourney"
            />
            <Image
              src={`${ImageBasePath}/Inspiration-Collection-Discord.png`}
              width={55.82}
              height={55.82}
              alt="Inspiration-Collection-Discord"
              className="ml-[-13px] self-end"
            />
          </motion.div>
          <MotionImage
            src={`${ImageBasePath}/Inspiration-Collection-Browsers.png`}
            width={180.74}
            height={62.63}
            alt="Inspiration-Collection-Browsers"
            className="h-fit self-end"
            onAnimationComplete={() => handleAnimationComplete(1)}
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </div>
        <MotionImage
          src={`${ImageBasePath}/Inspiration-Collection-URL.png`}
          width={516.44}
          height={39}
          alt="Inspiration-Collection-URL"
          className="mt-[29px]"
          initial={{ y: '-10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <RelativeContainer className="mt-[20px]">
          <MotionShadowImage
            src={`${ImageBasePath}/Inspiration-Collection-Images.png`}
            width={465.03}
            height={459.7}
            alt="Inspiration-Collection-Images"
            initial={{ y: '10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(4)}
          />
          <MotionImage
            src={getUrl('Inspiration-Collection-Drag.png')}
            width={192.54}
            height={192.54}
            alt="Inspiration-Collection-Drag"
            className="absolute right-[-57.51px] top-[144px]"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(4) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </RelativeContainer>
      </motion.div>
    </FlexCenterContainer>
  )
}
