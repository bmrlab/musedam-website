'use client'

import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/Container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #6A85B6 0%, #F5EFEF 100%)',
      }}
    >
      <motion.div
        className="grid h-[438px] w-[640px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <RelativeContainer>
          <MotionImage
            src="/Features/Encrypted-Sharing/Encrypted-Sharing-List.png"
            width={630}
            height={282.08}
            alt="Encrypted-Sharing-List"
            initial={{ y: '10%', opacity: 0 }}
            animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          />
          <MotionImage
            src="/Features/Encrypted-Sharing/Encrypted-Sharing-Modal.png"
            width={336.5}
            height={313.67}
            alt="Encrypted-Sharing-Modal"
            className="absolute right-[64.5px] top-[124.5px] rounded-[11.91px] shadow-[0px_4px_30px_4px_#00000014]"
            initial={{ y: '-10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
          />
        </RelativeContainer>
      </motion.div>
    </FlexCenterContainer>
  )
}
