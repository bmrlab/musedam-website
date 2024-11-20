'use client'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import { FlexCenterContainer, FlexColContainer } from '@/components/StyleWrapper/container'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #C5EDF5 2.5%, #546498 100%)',
      }}
    >
      <motion.div
        className="grid w-[640px] justify-items-center"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <FlexColContainer className="w-[525.62px] gap-[16.82px]">
          <MotionImage
            src="/Features/Content-Creation/Content-Creation1.png"
            width={474}
            height={223.3}
            alt="Content-Creation1"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          />
          <MotionImage
            src="/Features/Content-Creation/Content-Creation2.png"
            width={196.35}
            height={47.69}
            alt="Content-Creation2"
            className="self-end"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(2)}
          />
          <MotionImage
            src="/Features/Content-Creation/Content-Creation3.png"
            width={474}
            height={297.88}
            alt="Content-Creation3"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </FlexColContainer>
      </motion.div>
    </FlexCenterContainer>
  )
}
