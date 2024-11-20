'use client'

import { motion } from 'framer-motion'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'

const ImageBasePath = '/Features/Data-Statistics'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #2B5876 0%, #4E4376 100%)',
      }}
    >
      <motion.div
        className="grid w-[640px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <RelativeContainer className="ml-[50px] w-fit">
          <MotionImage
            src={`${ImageBasePath}/Data-Statistics-List.png`}
            width={467}
            height={579}
            alt="Data-Statistics-List"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          />
          <MotionShadowImage
            src={`${ImageBasePath}/Data-Statistics-Card.png`}
            width={335.9}
            height={100.47}
            alt="Data-Statistics-Card"
            className="absolute right-[-84.9px] top-[255px]"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
          />
        </RelativeContainer>
      </motion.div>
    </FlexCenterContainer>
  )
}
