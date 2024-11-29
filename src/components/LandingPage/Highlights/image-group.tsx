import { HTMLAttributes } from 'react'
import Image from 'next/image'
import { cn, twx } from '@/utilities/cn'
import { motion } from 'framer-motion'

import useIsMobile from '@/hooks/useIsMobile'
import usePublicUrl from '@/hooks/usePublicUrl'
import useAnimationComplete from '@/components/LandingPage/Highlights/useAnimationComplete'
import { useAnimationControl } from '@/components/LandingPage/Highlights/useAnimationControl'

const CollectImagePrefix = '/Highlights/Collect'
const OrganizeImagePrefix = '/Highlights/Organize'
const CollaborateImagePrefix = '/Highlights/Collaborate'
const AIGenerateImagePrefix = '/Highlights/AI-Generate'

export type ImageGroupProps = HTMLAttributes<HTMLDivElement> & {
  isBuildFinished: (i: number) => boolean
  onAnimationComplete?: () => void
}

const MotionImage = motion.create(Image)

const RelativeContainer = twx.div`relative`

const ShadowImage = twx(Image)`shadow-[0_4px_30px_4px_#00000014]`
const MotionShadowImage = motion.create(ShadowImage)

export const CollectImageGroup = ({
  isBuildFinished: _isBuildFinished,
  onAnimationComplete,
}: ImageGroupProps) => {
  const isMobile = useIsMobile()
  const { ref, isBuildFinished } = useAnimationControl(_isBuildFinished)
  const { getUrl } = usePublicUrl(CollectImagePrefix)

  const { handleAnimationComplete } = useAnimationComplete({
    totalAnimations: 5,
    onAnimationComplete,
  })

  return (
    <RelativeContainer>
      <MotionShadowImage
        ref={ref}
        src={getUrl('MuseDAM-Collect-BG.png')}
        width={isMobile ? 290.21 : 540}
        height={isMobile ? 197.77 : 368}
        alt="MuseDAM-Collect-BG"
        className={cn('rounded-[9px]', isMobile && 'rounded-[4.84px]')}
        initial={{ opacity: 0, x: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        onAnimationComplete={handleAnimationComplete}
      />
      <MotionShadowImage
        src={getUrl('MuseDAM-Collect-Browser-Plugin.png')}
        width={isMobile ? 62.12 : 114}
        height={isMobile ? 13.45 : 25}
        alt="MuseDAM-Collect-Browser-Plugin"
        className={cn(
          'absolute left-[-45.37px] top-[51px] rounded-[6.4px]',
          isMobile && 'left-[-24.79px] top-[27.42px] rounded-[3.44px]',
        )}
        initial={{ opacity: 0, x: '-10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        onAnimationComplete={handleAnimationComplete}
      />
      <MotionShadowImage
        src={getUrl('MuseDAM-Collect-Discord-Bot.png')}
        width={isMobile ? 52.12 : 96}
        height={isMobile ? 13.45 : 25}
        alt="MuseDAM-Collect-Discord-Bot"
        className={cn(
          'absolute bottom-[123px] left-[-36.37px] rounded-[6.4px]',
          isMobile && 'bottom-[66.08px] left-[-19.79px] rounded-[3.44px]',
        )}
        initial={{ opacity: 0, x: '-10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        onAnimationComplete={handleAnimationComplete}
      />
      <MotionImage
        src={getUrl('MuseDAM-Collect-Drag-and-Drop.png')}
        width={isMobile ? 89.09 : 165.27}
        height={isMobile ? 89.09 : 165.27}
        alt="MuseDAM-Collect-Drag-and-Drop"
        className={cn(
          'absolute bottom-[-49.79px] right-[96.13px] rounded-[8px] shadow-[0_2.75px_20.66px_2.75px_#00000014]',
          isMobile && 'bottom-[-27.5px] right-[56.75px] rounded-[4.3px]',
        )}
        initial={{ opacity: 0, y: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        onAnimationComplete={handleAnimationComplete}
      />
      <MotionImage
        src={`${CollectImagePrefix}/MuseDAM-Collect-Video.png`}
        width={isMobile ? 86.26 : 160.51}
        height={isMobile ? 65.32 : 121.53}
        alt="MuseDAM-Collect-Video"
        className={cn(
          'absolute bottom-[39.95px] right-[-10.62px] drop-shadow-[0_2.48px_37.2px_4.96px_#00000014]',
          isMobile && 'bottom-[21.47px] right-[-5.71px]',
        )}
        initial={{ opacity: 0, x: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1 }}
        onAnimationComplete={handleAnimationComplete}
      />
      <MotionImage
        src={`${CollectImagePrefix}/MuseDAM-Collect-Image.png`}
        width={isMobile ? 66.29 : 123.35}
        height={isMobile ? 78.22 : 145.54}
        alt="MuseDAM-Collect-Image"
        className={cn(
          'absolute right-[-13.22px] top-[110px] drop-shadow-[0_2.48px_37.2px_4.96px_#00000014]',
          isMobile && 'right-[-7.1px] top-[59.12px]',
        )}
        initial={{ opacity: 0, x: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        onAnimationComplete={handleAnimationComplete}
      />
    </RelativeContainer>
  )
}

export const OrganizeImageGroup = ({
  className,
  isBuildFinished: _isBuildFinished,
  onAnimationComplete,
}: ImageGroupProps) => {
  const isMobile = useIsMobile()
  const { ref, isBuildFinished } = useAnimationControl(_isBuildFinished)
  const { getUrl } = usePublicUrl(OrganizeImagePrefix)
  const { handleAnimationComplete } = useAnimationComplete({
    totalAnimations: 6,
    onAnimationComplete,
  })
  return (
    <div
      className={cn('flex h-full flex-col gap-[28.93px]', isMobile && 'gap-[15.55px]', className)}
    >
      <MotionShadowImage
        src={`${OrganizeImagePrefix}/MuseDAM-Organize-File-Formats.png`}
        width={isMobile ? 291.15 : 541.74}
        height={isMobile ? 34.44 : 64.07}
        alt="MuseDAM-Organize-File-Formats"
        initial={{ opacity: 0, y: '-20px' }}
        animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="rounded-full"
        onAnimationComplete={handleAnimationComplete}
      />
      <RelativeContainer>
        <MotionShadowImage
          ref={ref}
          src={`${OrganizeImagePrefix}/MuseDAM-Organize-BG.png`}
          width={isMobile ? 290.21 : 540}
          height={isMobile ? 187.03 : 348}
          alt="MuseDAM-Organize-BG.png"
          className={cn('rounded-[9px]', isMobile && 'rounded-[4.84px]')}
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          onAnimationComplete={handleAnimationComplete}
        />
        <MotionShadowImage
          src={getUrl('MuseDAM-Organize-70-File-Formats.png')}
          width={isMobile ? 67.05 : 124}
          height={isMobile ? 14.52 : 27}
          alt="MuseDAM-Organize-70-File-Formats"
          className={cn(
            'absolute right-[-51px] top-[51px] rounded-[6.4px] shadow-[0_3.42px_25.63px_3.42px_#00000014]',
            isMobile && 'right-[-27.82px] top-[27.41px] rounded-[2.94px]',
          )}
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          onAnimationComplete={handleAnimationComplete}
        />
        <MotionImage
          src={getUrl('MuseDAM-Organize-Find-Similar-Color-Images.png')}
          width={isMobile ? 99.05 : 184}
          height={isMobile ? 14.52 : 27}
          alt="MuseDAM-Organize-Find-Similar-Color-Images"
          className={cn(
            'absolute right-[-51px] top-[89.73px] rounded-[8px] shadow-[0_2.75px_20.66px_2.75px_#00000014]',
            isMobile && 'right-[-27.94px] top-[48.22px] rounded-[2.94px]',
          )}
          initial={{ opacity: 0, y: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          onAnimationComplete={handleAnimationComplete}
        />
        <MotionImage
          src={getUrl('MuseDAM-Organize-Preview.png')}
          width={isMobile ? 40.72 : 75.53}
          height={isMobile ? 21.28 : 39.47}
          alt="MuseDAM-Organize-Preview"
          className={cn(
            'absolute left-[192px] top-[171px] drop-shadow-[0_2.48px_37.2px_4.96px_#00000014]',
            isMobile && 'left-[103.56px] top-[92.33px]',
          )}
          initial={{ opacity: 0, y: '-10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          onAnimationComplete={handleAnimationComplete}
        />
        <MotionImage
          layout
          src={getUrl('MuseDAM-Organize-Image-Card.png')}
          width={isMobile ? 119.92 : 233.13}
          height={isMobile ? 107.33 : 199.72}
          alt="MuseDAM-Organize-Image-Card"
          className={cn(
            'absolute bottom-[-33.72px] right-[-32px] z-10 drop-shadow-[0_2.48px_37.2px_4.96px_#00000014]',
            isMobile && 'bottom-[-18.12px] right-[-17.2px] rounded-[3.04px]',
          )}
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.1 }}
          onAnimationComplete={handleAnimationComplete}
        />
      </RelativeContainer>
    </div>
  )
}

export const CollaborateImageGroup = ({
  className,
  isBuildFinished: _isBuildFinished,
  onAnimationComplete,
}: ImageGroupProps) => {
  const isMobile = useIsMobile()
  const { ref, isBuildFinished } = useAnimationControl(_isBuildFinished)
  const { getUrl } = usePublicUrl(CollaborateImagePrefix)

  const { handleAnimationComplete } = useAnimationComplete({
    totalAnimations: 5,
    onAnimationComplete,
  })
  return (
    <div
      className={cn('flex h-full flex-col gap-[16.67px]', isMobile && 'gap-[8.96px]', className)}
    >
      <MotionShadowImage
        src={getUrl('MuseDAM-Collaborate-Members.png')}
        width={isMobile ? 94.2 : 175.28}
        height={isMobile ? 28.13 : 52.33}
        alt="MuseDAM-Collaborate-Members"
        className={cn('self-end rounded-[4px]', isMobile && 'rounded-[2.15px]')}
        initial={{ opacity: 0, y: '-20px' }}
        animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
        onAnimationComplete={handleAnimationComplete}
      />
      <RelativeContainer>
        <MotionShadowImage
          ref={ref}
          src={getUrl('MuseDAM-Collaborate-BG.png')}
          width={isMobile ? 290.21 : 540}
          height={isMobile ? 192.4 : 358}
          alt="MuseDAM-Collaborate-BG"
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          onAnimationComplete={handleAnimationComplete}
        />
        <MotionImage
          src={getUrl('MuseDAM-Collaborate-Collaboration.png')}
          width={isMobile ? 63.95 : 119}
          height={isMobile ? 167.68 : 312}
          alt="MuseDAM-Collaborate-Collaboration"
          className={cn(
            'absolute left-[-41px] top-[75px]',
            isMobile && 'left-[-22.03px] top-[40.31px]',
          )}
          initial={{ opacity: 0, x: '-10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          onAnimationComplete={handleAnimationComplete}
        />
        <MotionShadowImage
          src={getUrl('MuseDAM-Collaborate-Ranking.png')}
          width={isMobile ? 128.98 : 184}
          height={isMobile ? 36.7 : 27}
          alt="MuseDAM-Collaborate-Ranking"
          className={cn(
            'absolute right-[-40.07px] top-[43.1px] rounded-[10px]',
            isMobile && 'right-[-21.87px] top-[23.14px] rounded-[5.37px]',
          )}
          initial={{ opacity: 0, x: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          onAnimationComplete={handleAnimationComplete}
        />
        <MotionShadowImage
          src={getUrl('MuseDAM-Collaborate-Share-Card.png')}
          width={isMobile ? 151.82 : 282.5}
          height={isMobile ? 143.04 : 264.89}
          alt="MuseDAM-Collaborate-Share-Card"
          className={cn(
            'absolute right-[-40.5px] top-[144.65px]',
            isMobile && 'right-[-21.79px] top-[77.42px]',
          )}
          initial={{ opacity: 0, y: '10%' }}
          animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          onAnimationComplete={handleAnimationComplete}
        />
      </RelativeContainer>
    </div>
  )
}

export const AIGenerateImageGroup = ({
  isBuildFinished: _isBuildFinished,
  onAnimationComplete,
}: ImageGroupProps) => {
  const isMobile = useIsMobile()
  const { ref, isBuildFinished } = useAnimationControl(_isBuildFinished)
  const { getUrl } = usePublicUrl(AIGenerateImagePrefix)

  const { handleAnimationComplete } = useAnimationComplete({
    totalAnimations: 4,
    onAnimationComplete,
  })

  return (
    <RelativeContainer>
      <MotionShadowImage
        ref={ref}
        src={getUrl('MuseDAM-AI-Generate-BG.png')}
        width={isMobile ? 291.09 : 540}
        height={isMobile ? 198.37 : 368}
        alt="MuseDAM-AI-Generate-BG"
        initial={{ opacity: 0, x: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        onAnimationComplete={handleAnimationComplete}
      />
      <MotionImage
        src={getUrl('MuseDAM-AI-Generate-Search.png')}
        width={isMobile ? 114.73 : 212.83}
        height={isMobile ? 16.17 : 30}
        alt="MuseDAM-AI-Generate-Search"
        className={cn(
          'absolute right-[-49.33px] top-[42px] rounded-[5px] shadow-[0_0_0_2.35px_#3366FF33]',
          isMobile && 'right-[-26.59px] top-[22.64px] rounded-[2.69px]',
        )}
        initial={{ opacity: 0, x: '-10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
        onAnimationComplete={handleAnimationComplete}
      />
      <MotionShadowImage
        src={getUrl('MuseDAM-AI-Generate-AI-Parsing.png')}
        width={isMobile ? 120.89 : 224.94}
        height={isMobile ? 92.46 : 171.41}
        alt="MuseDAM-AI-Generate-AI-Parsing"
        className={cn(
          'absolute bottom-[-79.41px] left-[94px] rounded-[8px]',
          isMobile && 'bottom-[-42.36px] left-[50.47px] rounded-[4.3px]',
        )}
        initial={{ opacity: 0, x: '-10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
        onAnimationComplete={handleAnimationComplete}
      />
      <MotionShadowImage
        src={getUrl('MuseDAM-AI-Generate-Copilot.png')}
        width={isMobile ? 107.06 : 199.2}
        height={isMobile ? 172.63 : 321.21}
        alt="MuseDAM-AI-Generate-Copilot"
        className={cn(
          'absolute right-[-48.2px] top-[105.26px]',
          isMobile && 'right-[-24.98px] top-[56.52px]',
        )}
        initial={{ opacity: 0, y: '10%' }}
        animate={isBuildFinished(1) ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
        onAnimationComplete={handleAnimationComplete}
      />
    </RelativeContainer>
  )
}
