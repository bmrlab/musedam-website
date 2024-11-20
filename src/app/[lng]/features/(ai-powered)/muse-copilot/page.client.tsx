'use client'

import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import { motion } from 'framer-motion'
import useAnimationTrace from '@/hooks/useAnimationTrace'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #1A1FD0 0%, #0D106A 100%)',
      }}
    >
      <motion.div
        className="grid justify-items-start w-[640px] pl-[60px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <RelativeContainer>
          <MotionImage
            src="/Features/MuseCopilot/MuseCopilot-Library.png"
            width={612.59}
            height={450}
            alt="MuseCopilot-Library"
            initial={{ y: '10%', opacity: 0 }}
            animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          />
          <RelativeContainer className="absolute bottom-[93.65px] right-[177.1px]">
            <MotionShadowImage
              src="/Features/MuseCopilot/MuseCopilot-Image.png"
              width={98.5}
              height={113.35}
              alt="MuseCopilot-Image"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(2)}
            />
            <MotionShadowImage
              src="/Features/MuseCopilot/MuseCopilot-Mouse.svg"
              width={26.89}
              height={38.41}
              alt="MuseCopilot-Mouse.svg"
              className="absolute top-[20px] right-[-6.39px]"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </RelativeContainer>
        </RelativeContainer>
      </motion.div>
    </FlexCenterContainer>
  )
}