'use client'

import { motion } from 'framer-motion'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import usePublicUrl from '@/hooks/usePublicUrl'
import { FlexCenterContainer } from '@/components/StyleWrapper/Container'
import { MotionImage } from '@/components/StyleWrapper/image'

const ImageBasePath = '/Features/Permissions'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl(ImageBasePath)
  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #616161 0%, #9BC5C3 100%)',
      }}
    >
      <motion.div
        className="grid w-[640px] justify-center gap-[13.67px]"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <MotionImage
          src={`${ImageBasePath}/Permissions-Members.png`}
          width={175.28}
          height={52.33}
          alt="Permissions-Members"
          className="justify-self-end"
          initial={{ x: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <MotionImage
          src={getUrl('Permissions-Modal.png')}
          width={566.95}
          height={377.43}
          quality={100}
          unoptimized={true}
          alt="Permissions-Modal"
          initial={{ x: '-10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </motion.div>
    </FlexCenterContainer>
  )
}
