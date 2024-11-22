'use client'

import { FlexCenterContainer } from '@/components/StyleWrapper/Container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'

const ImageBasePath = '/Features/Team-Management'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #9795F0 0%, #FBC8D4 100%)',
      }}
    >
      <motion.div
        className="grid w-[640px] justify-center gap-[15px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <MotionImage
          src={`${ImageBasePath}/Team-Management1.png`}
          width={550}
          height={206}
          alt="Team-Management1"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <MotionImage
          src={`${ImageBasePath}/Team-Management2.png`}
          width={550}
          height={312.9}
          alt="Team-Management2"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </motion.div>
    </FlexCenterContainer>
  )
}
