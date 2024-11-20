'use client'

import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import { motion } from 'framer-motion'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import useAnimationTrace from '@/hooks/useAnimationTrace'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #9DAFC7 0%, #C3CFE8 100%)',
      }}
    >
      <motion.div
        className="grid w-[640px] justify-items-center px-[24.09px] py-10 md:p-0"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <div className="flex w-full justify-between pl-[53px] pr-[47.17px]">
          <MotionShadowImage
            src="/Features/AI-Search/AI-Search-Tags.png"
            width={229}
            height={31}
            alt="AI-Search-Tags"
            onAnimationComplete={() => handleAnimationComplete(1)}
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          <MotionImage
            src="/Features/AI-Search/AI-Search-Input.png"
            width={222.83}
            height={35}
            alt="AI-Search-Input"
            className="drop-shadow-[0px_0px_0px_2px_#3366FF33]"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </div>
        <RelativeContainer className="mt-[37.5px]">
          <MotionImage
            src="/Features/AI-Search/AI-Search-Images.png"
            width={456.8}
            height={471.61}
            alt="AI-Search-Images"
            initial={{ y: '10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <MotionShadowImage
            src="/Features/AI-Search/AI-Search-Color.png"
            width={174.11}
            height={125}
            alt="AI-Search-Color.png"
            className="absolute bottom-[35.61px] right-[-71.31px]"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
          />
        </RelativeContainer>
      </motion.div>
    </FlexCenterContainer>
  )
}
