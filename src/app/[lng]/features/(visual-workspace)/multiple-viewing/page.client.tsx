'use client'

import { FlexCenterContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #ACCBEE 0%, #E7F0FD 100%)',
      }}
    >
      <motion.div
        className="grid justify-items-center grid-cols-3 w-[640px] gap-[12.47px] px-6"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <MotionImage
          src="/Features/Multiple-Viewing/Multiple-Viewing1.png"
          width={188.78}
          height={387.95}
          alt="Multiple-Viewing1"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <MotionImage
          src="/Features/Multiple-Viewing/Multiple-Viewing2.png"
          width={188.78}
          height={387.95}
          alt="Multiple-Viewing2"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
        />
        <MotionImage
          src="/Features/Multiple-Viewing/Multiple-Viewing3.png"
          width={188.78}
          height={387.95}
          alt="Multiple-Viewing3"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: 'easeInOut' }}
        />
      </motion.div>
    </FlexCenterContainer>
  )
}
