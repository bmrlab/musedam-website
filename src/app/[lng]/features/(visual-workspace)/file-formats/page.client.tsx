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
        background: 'linear-gradient(180deg, #FFF1EB 0%, #ACE0F9 100%)',
      }}
    >
      <motion.div
        className="grid w-[640px] justify-items-start gap-[13.41px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <MotionImage
          src="/Features/70+Formats/70+Formats1.png"
          width={465.43}
          height={59.65}
          alt="70+Formats1"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <MotionImage
          src="/Features/70+Formats/70+Formats2.png"
          width={465.43}
          height={59.65}
          alt="70+Formats2"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
        />
        <MotionImage
          src="/Features/70+Formats/70+Formats3.png"
          width={465.43}
          height={59.65}
          alt="70+Formats3"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: 'easeInOut' }}
        />
        <MotionImage
          src="/Features/70+Formats/70+Formats4.png"
          width={207.68}
          height={59.65}
          alt="70+Formats4"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: 'easeInOut' }}
        />
        <MotionImage
          src="/Features/70+Formats/70+Formats5.png"
          width={529.86}
          height={59.65}
          alt="70+Formats5"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
        />
        <MotionImage
          src="/Features/70+Formats/70+Formats6.png"
          width={594.3}
          height={59.65}
          alt="70+Formats6"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
        />
        <MotionImage
          src="/Features/70+Formats/70+Formats7.png"
          width={207.68}
          height={59.65}
          alt="70+Formats7"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2, ease: 'easeInOut' }}
        />
      </motion.div>
    </FlexCenterContainer>
  )
}
