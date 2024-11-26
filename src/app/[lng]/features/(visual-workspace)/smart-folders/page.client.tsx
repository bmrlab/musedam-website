'use client'

import { FlexCenterContainer } from '@/components/StyleWrapper/Container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'
import Image from 'next/image'
import usePublicUrl from '@/hooks/usePublicUrl'

const ImageBasePath = '/Features/Smart-Folders'

export default function PageClient() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })
  const { getUrl } = usePublicUrl(ImageBasePath)

  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #CFD9DF 0%, #E2EBF0 100%)',
      }}
    >
      <motion.div
        className="grid w-[640px] justify-items-center"
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        <MotionImage
          src={`${ImageBasePath}/Smart-Folders-Group.png`}
          width={407}
          height={174.69}
          alt="Smart-Folders-Group"
          initial={{ y: '10%', opacity: 0 }}
          animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(1)}
        />
        <Image
          src={getUrl('Smart-Folders-Folder.png')}
          width={120.52}
          height={110.77}
          alt="Smart-Folders-Folder"
          className="mt-[10.31px]"
        />
        <MotionImage
          src={getUrl('Smart-Folders-Settings.png')}
          width={508.73}
          height={253.65}
          alt="Smart-Folders-Settings"
          className="mt-[34.23px]"
          initial={{ y: '-10%', opacity: 0 }}
          animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
        />
      </motion.div>
    </FlexCenterContainer>
  )
}
