'use client'

import { FlexCenterContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'

const ImageBasePath = '/Features/Versions'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #CCD8E4 0%, #FFFFFF 100%)',
      }}
      className="py-10"
    >
      <motion.div
        className="grid w-[640px] justify-center py-[70px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <MotionImage
          src={`${ImageBasePath}/Versions1.png`}
          width={457}
          height={385.88}
          alt="Versions1"
          initial={{ y: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <div className="flex gap-[13.24px] mt-[18px]">
          <MotionImage
            src={`${ImageBasePath}/Versions2.png`}
            width={96.31}
            height={96.31}
            alt="Versions2"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
          />
          <MotionImage
            src={`${ImageBasePath}/Versions3.png`}
            width={138.45}
            height={95.11}
            alt="Versions3"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </FlexCenterContainer>
  )
}
