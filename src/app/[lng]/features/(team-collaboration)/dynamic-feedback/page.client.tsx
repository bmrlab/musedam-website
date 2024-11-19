'use client'

import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'

const ImageBasePath = '/Features/Dynamic-Feedback'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(153.22deg, #DBDBDA 4.46%, #FAF9E7 60%)',
      }}
    >
      <motion.div
        className="grid w-[640px] pl-1 pr-[31px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <MotionImage
          src={`${ImageBasePath}/Dynamic-Feedback1.png`}
          width={148}
          height={30}
          alt="Dynamic-Feedback1"
          className="justify-self-end mr-[13px]"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <MotionImage
          src={`${ImageBasePath}/Dynamic-Feedback.png`}
          width={230}
          height={36}
          alt="Dynamic-Feedback"
          className="justify-self-end"
          initial={{ y: '10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }}
        />
        <RelativeContainer className="mt-5 w-fit">
          <MotionImage
            src={`${ImageBasePath}/Dynamic-Feedback-Image.png`}
            width={566.95}
            height={377.43}
            alt="Dynamic-Feedback-Image"
            initial={{ x: '-10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          <MotionShadowImage
            src={`${ImageBasePath}/Dynamic-Feedback-Comment.png`}
            width={279.71}
            height={83.19}
            alt="Dynamic-Feedback-Comment"
            className="absolute bottom-[55.81px] right-[-27.71px]"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </RelativeContainer>
      </motion.div>
    </FlexCenterContainer>
  )
}
