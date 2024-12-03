import { cn } from '@/utilities/cn'
import { useHover } from '@uidotdev/usehooks'
import { AnimatePresence } from 'framer-motion'

import useAnimationTrace from '@/hooks/useAnimationTrace'
import usePublicUrl from '@/hooks/usePublicUrl'
import {
  MotionImageWithSkeleton,
  MotionShadowImageRoundedWithSkeleton,
  MotionVideoWithSkeleton,
} from '@/components/ImageWithSkeleton'
import {
  AbsXCenterContainer,
  FlexColContainer,
  RelativeContainer,
} from '@/components/StyleWrapper/Container'
import { MotionImage } from '@/components/StyleWrapper/image'

import { MotionShadowImageRounded, MotionShadowRoundedFullImage } from '.'

export default function DesktopBanner({ className }: { className?: string }) {
  const [aiParseTagRef, aiParseTagHovering] = useHover()
  const [assetMoreRef, assetMoreHovering] = useHover()
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: 1 })
  const { getUrl } = usePublicUrl('/Hero')

  return (
    <div className={cn('flex select-none justify-center gap-6', className)}>
      <FlexColContainer>
        <MotionShadowImageRoundedWithSkeleton
          src={getUrl('MuseDAM-Kanban.png')}
          width={237}
          height={52}
          alt="MuseDAM-Kanban"
          initial={{ y: -20, opacity: 0 }}
          animate={isBuildFinished(18) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(19)}
        />
        <div className="relative">
          <MotionVideoWithSkeleton
            loop
            autoPlay
            muted
            playsInline
            x5-video-player-type="h5-page"
            x5-video-player-fullscreen="false"
            width={237}
            height={315}
            src="/Hero/MuseDAM-Asset-Car.mp4"
            type="video/mp4"
            className="mt-5 h-[315px] rounded-[8px] object-cover"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          />
          <div className="absolute bottom-[34px] right-[-66px] z-[1] flex flex-col gap-2">
            <MotionShadowRoundedFullImage
              src={getUrl('Tag-Automobile.png')}
              width={110}
              height={30}
              alt="Tag-Automobile"
              initial={{ x: 20, opacity: 0 }}
              animate={isBuildFinished(14) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(16)}
            />
            <MotionShadowRoundedFullImage
              src={getUrl('Tag-Raining.png')}
              width={87}
              height={30}
              alt="Tag-Raining"
              initial={{ x: 20, opacity: 0 }}
              animate={isBuildFinished(14) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(17)}
            />
            <MotionShadowRoundedFullImage
              src={getUrl('Tag-Photography.png')}
              width={118}
              height={30}
              alt="Tag-Photography"
              initial={{ x: 20, opacity: 0 }}
              animate={isBuildFinished(14) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(18)}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-[11px]">
          <MotionShadowImageRoundedWithSkeleton
            src="/Hero/MuseDAM-Asset-Car-V2.png"
            width={80}
            height={80}
            alt="MuseDAM-Asset-Car-V2"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(2)}
          />
          <MotionShadowImageRoundedWithSkeleton
            src="/Hero/MuseDAM-Asset-Car-V3.png"
            width={115}
            height={79}
            alt="MuseDAM-Asset-Car-V3"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(3)}
          />
        </div>
      </FlexColContainer>
      <FlexColContainer className="mt-[50px] gap-[25px]">
        <MotionShadowImageRoundedWithSkeleton
          src="/Hero/MuseDAM-Asset-Poster.png"
          width={237}
          height={275}
          alt="MuseDAM-Asset-Poster"
          initial={{ x: 20, opacity: 0 }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(4)}
        />
        <FlexColContainer className="gap-[11px]">
          <MotionShadowImageRoundedWithSkeleton
            src="/Hero/MuseDAM-Asset-Jewellery.png"
            width={237}
            height={175}
            alt="MuseDAM-Asset-Jewellery"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(5)}
          />
          <MotionImageWithSkeleton
            src="/Hero/MuseDAM-AI-Color.png"
            width={237}
            height={38}
            alt="MuseDAM-AI-Color"
            initial={{ y: 20, opacity: 0 }}
            animate={isBuildFinished(18) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(20)}
          />
        </FlexColContainer>
      </FlexColContainer>
      <FlexColContainer className="gap-6">
        <RelativeContainer>
          <MotionShadowImageRoundedWithSkeleton
            src="/Hero/MuseDAM-Asset-3D.png"
            width={237}
            height={295}
            alt="MuseDAM-Asset-3D"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(6)}
          />
          <MotionImage
            src={getUrl('MuseDAM-Comment.png')}
            width={244}
            height={60}
            alt="MuseDAM-Comment"
            className="absolute bottom-[82px] right-[-170px] z-[1] drop-shadow"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(22) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(23)}
          />
        </RelativeContainer>
        <RelativeContainer>
          <MotionShadowImageRoundedWithSkeleton
            src="/Hero/MuseDAM-Asset-Photography.png"
            width={237}
            height={285}
            alt="MuseDAM-Asset-Photography"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(7)}
          />
          <RelativeContainer>
            <MotionImage
              ref={aiParseTagRef}
              src="/Hero/MuseDAM-AI-Parsing-Tag.png"
              width={24}
              height={20}
              alt="MuseDAM-AI-Parsing-Tag"
              className="absolute bottom-[8px] right-[9px] z-[1] cursor-pointer"
              initial={{ opacity: 0 }}
              animate={isBuildFinished(22) ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(24)}
            />
            <div className="absolute bottom-[30px] right-[3px] h-[290px] w-[272px] object-cover">
              <AnimatePresence mode="wait">
                {aiParseTagHovering && (
                  <MotionShadowImageRounded
                    src="/Hero/MuseDAM-AI-Parsing.png"
                    fill
                    alt="MuseDAM-AI-Parsing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0, ease: 'easeInOut' }}
                  />
                )}
              </AnimatePresence>
            </div>
          </RelativeContainer>
        </RelativeContainer>
      </FlexColContainer>
      <FlexColContainer className="mt-[50px] gap-[24px]">
        <MotionShadowImageRoundedWithSkeleton
          src="/Hero/MuseDAM-Asset-Product.png"
          width={237}
          height={235}
          alt="MuseDAM-Asset-Product"
          initial={{ x: -20, opacity: 0 }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(8)}
        />
        <RelativeContainer className="flex justify-center">
          <MotionShadowImageRoundedWithSkeleton
            src="/Hero/MuseDAM-Asset-Group3.png"
            width={196.8}
            height={275}
            alt="MuseDAM-Asset-Group3"
            containerClassName="absolute"
            initial={{ x: -20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(9)}
          />
          <MotionShadowImageRoundedWithSkeleton
            src="/Hero/MuseDAM-Asset-Group2.png"
            width={216.8}
            height={285}
            alt="MuseDAM-Asset-Group2"
            containerClassName="absolute top-[9px]"
            initial={{ y: 20, opacity: 0 }}
            animate={isBuildFinished(11) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(12)}
          />
          <MotionShadowImageRoundedWithSkeleton
            src="/Hero/MuseDAM-Asset-Group1.png"
            width={236.8}
            height={285}
            alt="MuseDAM-Asset-Group1"
            containerClassName="absolute top-[19px]"
            initial={{ y: 20, opacity: 0 }}
            animate={isBuildFinished(12) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(13)}
          />
          <div className="absolute right-2 top-[27px] flex gap-1">
            <MotionImage
              src="/Hero/MuseDAM-Asset-Group-Tag.png"
              width={35}
              height={20}
              alt="MuseDAM-Asset-Group-Tag"
              initial={{ opacity: 0 }}
              animate={isBuildFinished(13) ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(14)}
            />
            <MotionImage
              src="/Hero/MuseDAM-Asset-Comment-Tag.png"
              width={24}
              height={20}
              alt="MuseDAM-Asset-Comment-Tag"
              initial={{ opacity: 0 }}
              animate={isBuildFinished(14) ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(15)}
            />
          </div>
        </RelativeContainer>
      </FlexColContainer>
      <FlexColContainer className="gap-6">
        <RelativeContainer>
          <MotionShadowImageRoundedWithSkeleton
            src="/Hero/MuseDAM-Asset-Cat.png"
            width={237}
            height={275}
            alt="MuseDAM-Asset-Cat"
            initial={{ x: -20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(10)}
          />
          <MotionImage
            ref={assetMoreRef}
            src="/Hero/MuseDAM-Asset-More.png"
            width={30}
            height={30}
            alt="MuseDAM-Asset-More.png"
            className="absolute right-2 top-2.5 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={isBuildFinished(22) ? { opacity: 1 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(25)}
          ></MotionImage>
          <AnimatePresence mode="wait">
            {assetMoreHovering && (
              <MotionImage
                src="/Hero/MuseDAM-Asset-Dropdown.png"
                width={171}
                height={194}
                alt="MuseDAM-Asset-Dropdown.png"
                className="absolute right-2 top-[42px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0, ease: 'easeInOut' }}
              ></MotionImage>
            )}
          </AnimatePresence>
        </RelativeContainer>
        <FlexColContainer className="relative">
          <MotionVideoWithSkeleton
            loop
            autoPlay
            muted
            playsInline
            width={237}
            height={315}
            src="/Hero/MuseDAM-Asset-Video.mp4"
            type="video/mp4"
            className="h-[315px] rounded-[8px] object-cover"
            initial={{ x: -20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(11)}
          />
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-VideoPlayer.png"
            width={237}
            height={40}
            alt="MuseDAM-Asset-VideoPlayer"
            className="mt-[9px]"
            initial={{ y: '10%', opacity: 0 }}
            animate={isBuildFinished(18) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(21)}
          />
          <AbsXCenterContainer className="bottom-[7px]">
            <MotionImage
              src="/Hero/MuseDAM-Video-Frame.png"
              width={57.22}
              height={139}
              alt="MuseDAM-Video-Frame.png"
              initial={{ y: '5%', opacity: 0 }}
              animate={isBuildFinished(21) ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(22)}
            />
          </AbsXCenterContainer>
        </FlexColContainer>
      </FlexColContainer>
    </div>
  )
}
