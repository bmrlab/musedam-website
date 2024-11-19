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
        background: 'linear-gradient(180deg, #FEEBE2 0%, #C2BEFF 100%)',
      }}
    >
      <motion.div
        className="grid justify-items-center w-[640px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <RelativeContainer>
          <MotionImage
            src="/Features/AI-Parsing/AI-Parsing-Images.png"
            width={478.8}
            height={517.51}
            alt="AI-Parsing-Images"
            initial={{ y: '10%', opacity: 0 }}
            animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          />
          <MotionShadowImage
            src="/Features/AI-Parsing/AI-Parsing-Star.png"
            width={24}
            height={20}
            alt="AI-Parsing-Star"
            className="absolute bottom-[14.51px] right-[15.8px]"
            initial={{ opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(2)}
          />
          <MotionShadowImage
            src="/Features/AI-Parsing/AI-Parsing-Summarization.png"
            width={312}
            height={288}
            alt="AI-Parsing-Summarization"
            className="absolute bottom-[39.51px] right-[16.8px]"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
          />
        </RelativeContainer>
      </motion.div>
    </FlexCenterContainer>
  )
}
