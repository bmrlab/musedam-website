'use client'

import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #CEDBFF 0%, #FDE1A9 100%)',
      }}
    >
      <motion.div
        className="grid w-[640px] justify-items-start pl-[60px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <RelativeContainer>
          <MotionImage
            src="/Features/Auto-Tags/Auto-Tags-Images.png"
            width={456.8}
            height={471.61}
            alt="Auto-Tags-Images"
            initial={{ y: '10%', opacity: 0 }}
            animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          />
          <MotionShadowImage
            src="/Features/Auto-Tags/Auto-Tags-Example.png"
            width={136.45}
            height={97.3}
            alt="Auto-Tags-Example"
            className="absolute bottom-[39.51px] right-[-81.2px]"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          <MotionImage
            src="/Features/Auto-Tags/Auto-Tags-Group.png"
            width={200}
            height={238}
            alt="Auto-Tags-Group"
            className="absolute right-[-95.65px] top-[59px]"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(2)}
          />
        </RelativeContainer>
      </motion.div>
    </FlexCenterContainer>
  )
}
