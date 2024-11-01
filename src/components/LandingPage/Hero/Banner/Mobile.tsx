import { useCallback, useState } from 'react'
import { useHover } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AbsXCenterContainer,
  FlexColContainer,
  MotionImage,
  MotionShadowImageRounded,
  MotionShadowRoundedFullImage,
  RelativeContainer,
} from '.'

export default function MobileBanner() {
  const [animationStep, setAnimationStep] = useState(0) // 用于跟踪当前动画步骤
  const [aiParseTagRef, aiParseTagHovering] = useHover()
  const [assetMoreRef, assetMoreHovering] = useHover()

  const handleAnimationComplete = useCallback(
    (i: number) => {
      if (animationStep < i) {
        setAnimationStep(i)
      }
    },
    [animationStep],
  )

  const isBuildFinished = useCallback((i: number) => animationStep >= i, [animationStep])

  return (
    <div className="flex w-[750.74px] select-none justify-center gap-[14.08px]">
      <FlexColContainer>
        <MotionShadowImageRounded
          src="/Hero/MuseDAM-Kanban.png"
          width={137.25}
          height={30.94}
          alt="MuseDAM-Kanban"
          initial={{ y: -20, opacity: 0 }}
          animate={isBuildFinished(18) ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(19)}
        />
        <div className="relative">
          <motion.video
            loop
            autoPlay
            muted
            width={139}
            height={184.75}
            className="mt-[11.73px] h-[184.75px] rounded-[8px] object-cover"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          >
            <source src="/Hero/MuseDAM-Asset-Car.mp4" type="video/mp4" />
          </motion.video>
          <div className="absolute bottom-[19.13px] right-[-38.58px] z-[1] flex flex-col gap-2">
            <MotionShadowRoundedFullImage
              src="/Hero/Tag-Automobile.png"
              width={65.08}
              height={17.87}
              alt="Tag-Automobile"
              initial={{ x: 20, opacity: 0 }}
              animate={isBuildFinished(14) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(16)}
            />
            <MotionShadowRoundedFullImage
              src="/Hero/Tag-Raining.png"
              width={51.08}
              height={17.87}
              alt="Tag-Raining"
              initial={{ x: 20, opacity: 0 }}
              animate={isBuildFinished(14) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(17)}
            />
            <MotionShadowRoundedFullImage
              src="/Hero/Tag-Photography.png"
              width={69.08}
              height={17.87}
              alt="Tag-Photography"
              initial={{ x: 20, opacity: 0 }}
              animate={isBuildFinished(14) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(18)}
            />
          </div>
        </div>
        <div className="mt-[9.38px] flex gap-[11px]">
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Car-V2.png"
            width={46.92}
            height={46.92}
            alt="MuseDAM-Asset-Car-V2"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(2)}
          />
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Car-V3.png"
            width={67.45}
            height={46.33}
            alt="MuseDAM-Asset-Car-V3"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(3)}
          />
        </div>
      </FlexColContainer>
      <FlexColContainer className="mt-[29.33px] gap-[14.66px]">
        <MotionShadowImageRounded
          src="/Hero/MuseDAM-Asset-Poster.png"
          width={139}
          height={161.29}
          alt="MuseDAM-Asset-Poster"
          initial={{ x: 20, opacity: 0 }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(4)}
        />
        <FlexColContainer className="gap-[11px]">
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Jewellery.png"
            width={139}
            height={102.64}
            alt="MuseDAM-Asset-Jewellery"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(5)}
          />
          <MotionImage
            src="/Hero/MuseDAM-AI-Color.png"
            width={139}
            height={22.9}
            alt="MuseDAM-AI-Color"
            initial={{ y: 20, opacity: 0 }}
            animate={isBuildFinished(19) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(20)}
          />
        </FlexColContainer>
      </FlexColContainer>
      <FlexColContainer className="gap-[14.08px]">
        <RelativeContainer>
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-3D.png"
            width={139}
            height={173.02}
            alt="MuseDAM-Asset-3D"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(6)}
          />
          <MotionImage
            src="/Hero/MuseDAM-Comment.png"
            width={143.11}
            height={35.38}
            alt="MuseDAM-Comment"
            className="absolute bottom-[12.71px] left-[95.6px] z-[1] drop-shadow"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(22) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(23)}
          />
        </RelativeContainer>
        <RelativeContainer>
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Photography.png"
            width={139}
            height={167.16}
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
              width={14.08}
              height={11.73}
              alt="MuseDAM-AI-Parsing-Tag"
              className="absolute bottom-[8px] right-[9px] z-[1] cursor-pointer"
              initial={{ opacity: 0 }}
              animate={isBuildFinished(23) ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(24)}
            />
            <div className="absolute bottom-[22px] right-[3px] z-[2] h-[290px] w-[272px] object-cover">
              <AnimatePresence mode="wait">
                {aiParseTagHovering && (
                  <MotionShadowImageRounded
                    src="/Hero/MuseDAM-AI-Parsing.png"
                    fill
                    alt="MuseDAM-AI-Parsing"
                    initial={{ x: '-10%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0, ease: 'easeInOut' }}
                  />
                )}
              </AnimatePresence>
            </div>
          </RelativeContainer>
        </RelativeContainer>
      </FlexColContainer>
      <FlexColContainer className="mt-[20.93px] gap-[14.08px]">
        <MotionShadowImageRounded
          src="/Hero/MuseDAM-Asset-Product.png"
          width={138.89}
          height={137.83}
          alt="MuseDAM-Asset-Product"
          initial={{ x: -20, opacity: 0 }}
          animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
          onAnimationComplete={() => handleAnimationComplete(8)}
        />
        <RelativeContainer className="flex justify-center">
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Group3.png"
            width={115.43}
            height={161.29}
            alt="MuseDAM-Asset-Group3"
            className="absolute"
            initial={{ x: -20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(9)}
          />
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Group2.png"
            width={127.16}
            height={167.16}
            alt="MuseDAM-Asset-Group2"
            className="absolute top-[5.28px]"
            initial={{ y: 20, opacity: 0 }}
            animate={isBuildFinished(11) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(12)}
          />
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Group1.png"
            width={138.89}
            height={167.16}
            alt="MuseDAM-Asset-Group1"
            className="absolute top-[11.14px]"
            initial={{ y: 20, opacity: 0 }}
            animate={isBuildFinished(12) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(13)}
          />
          <div className="absolute right-[4.9px] top-[15.84px] flex gap-1">
            <MotionImage
              src="/Hero/MuseDAM-Asset-Group-Tag.png"
              width={20.32}
              height={11.73}
              alt="MuseDAM-Asset-Group-Tag"
              initial={{ opacity: 0 }}
              animate={isBuildFinished(13) ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(14)}
            />
            <MotionImage
              src="/Hero/MuseDAM-Asset-Comment-Tag.png"
              width={14.08}
              height={11.73}
              alt="MuseDAM-Asset-Comment-Tag"
              initial={{ opacity: 0 }}
              animate={isBuildFinished(14) ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(15)}
            />
          </div>
        </RelativeContainer>
      </FlexColContainer>
      <FlexColContainer className="gap-[14.08px]">
        <RelativeContainer>
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Cat.png"
            width={139}
            height={161.29}
            alt="MuseDAM-Asset-Cat"
            initial={{ x: -20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(10)}
          />
          <MotionImage
            ref={assetMoreRef}
            src="/Hero/MuseDAM-Asset-More.png"
            width={17.6}
            height={17.6}
            alt="MuseDAM-Asset-More.png"
            className="absolute right-[4.69px] top-[5.87px] cursor-pointer"
            initial={{ opacity: 0 }}
            animate={isBuildFinished(24) ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(25)}
          ></MotionImage>
          <AnimatePresence mode="wait">
            {assetMoreHovering && (
              <MotionImage
                src="/Hero/MuseDAM-Asset-Dropdown.png"
                width={171}
                height={194}
                alt="MuseDAM-Asset-Dropdown.png"
                className="absolute right-2 top-[25px] z-[2]"
                initial={{ x: '10%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0, ease: 'easeInOut' }}
              ></MotionImage>
            )}
          </AnimatePresence>
        </RelativeContainer>
        <FlexColContainer className="relative">
          <motion.video
            loop
            autoPlay
            muted
            width={139}
            height={184.75}
            className="h-[184.75px] rounded-[8px] object-cover"
            initial={{ x: -20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(11)}
          >
            <source src="/Hero/MuseDAM-Asset-Video.mp4" type="video/mp4" />
          </motion.video>
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-VideoPlayer.png"
            width={139}
            height={23.46}
            alt="MuseDAM-Asset-VideoPlayer"
            className="mt-[9px]"
            initial={{ y: '10%', opacity: 0 }}
            animate={isBuildFinished(19) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(21)}
          />
          <AbsXCenterContainer className="bottom-[4.11px]">
            <MotionImage
              src="/Hero/MuseDAM-Video-Frame.png"
              width={33.56}
              height={81.53}
              alt="MuseDAM-Video-Frame.png"
              initial={{ y: '5%', opacity: 0 }}
              animate={isBuildFinished(21) ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(22)}
            />
          </AbsXCenterContainer>
        </FlexColContainer>
      </FlexColContainer>
    </div>
  )
}