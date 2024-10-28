'use client'

import Image from 'next/image'
import { twx } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useHover } from '@uidotdev/usehooks'

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center md:w-full md:px-[80px]">
      <h1 className="mt-[59px] text-center font-baskervville text-[38px] font-normal leading-[43.47px] text-[#141414] md:text-[68px] md:leading-[77.79px]">
        <p>Smart Asset Management</p>
        <p>for the AI Content Era</p>
      </h1>
      <button className="mb-12 mt-6 rounded-[1000px] bg-black px-[52.5px] py-[17px] font-mono text-[16px] font-normal leading-[20px] text-white md:mb-[58px] md:mt-9 md:px-[57.5px] md:py-[19px]">
        Start for free
      </button>
      <div className="no-scrollbar w-full overflow-x-scroll px-6">
        <Banner />
      </div>
      <div className="mt-10 flex w-full flex-col items-center gap-4 md:mt-[80px] md:flex-row md:justify-between md:gap-0">
        <h1 className="text-center font-baskervville text-[38px] font-normal leading-[43.37px] text-[#141414] md:text-left md:text-[68px] md:leading-[77.79px]">
          AI-Powered Asset Management
        </h1>
        <div className="flex max-w-[680px] flex-col items-center gap-6 px-6 md:items-start md:gap-10">
          <p className="text-center font-mono text-[14px] font-light leading-6 text-[#141414] md:text-left md:text-[16px]">
            Dive into the future of asset management with MuseDAM's cutting-edge AI system.
            Experience intelligent search, insightful smart parsing, and a robust suite of creative
            tools, all enhanced by our interactive MuseCopilot for a seamless experience.
          </p>
          <button className="rounded-[8px] bg-black px-[52.5px] py-[17px] font-mono text-[16px] leading-5 text-white md:px-[42.5px] md:py-[14px]">
            Start for free
          </button>
        </div>
      </div>
      <div className="relative mt-12 h-[187.72px] w-full px-6 md:mt-[80px] md:h-[692px] md:px-10">
        <video muted autoPlay loop className="absolute inset-0 size-full h-full object-cover">
          <source src="/Introduction/Introduction.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}

const Banner = () => {
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
    <div className="flex w-[750.74px] select-none justify-center gap-6">
      <FlexColContainer>
        <MotionShadowImageRounded
          src="/Hero/MuseDAM-Kanban.png"
          width={237}
          height={315}
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
            width={237}
            height={315}
            className="mt-5 h-[315px] rounded-[8px] object-cover"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(1)}
          >
            <source src="/Hero/MuseDAM-Asset-Car.mp4" type="video/mp4" />
          </motion.video>
          <div className="absolute bottom-[34px] right-[-66px] z-[1] flex flex-col gap-2">
            <MotionShadowRoundedFullImage
              src="/Hero/Tag-Automobile.png"
              width={110}
              height={30}
              alt="Tag-Automobile"
              initial={{ x: 20, opacity: 0 }}
              animate={isBuildFinished(14) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(16)}
            />
            <MotionShadowRoundedFullImage
              src="/Hero/Tag-Raining.png"
              width={87}
              height={30}
              alt="Tag-Raining"
              initial={{ x: 20, opacity: 0 }}
              animate={isBuildFinished(14) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(17)}
            />
            <MotionShadowRoundedFullImage
              src="/Hero/Tag-Photography.png"
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
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Car-V2.png"
            width={80}
            height={80}
            alt="MuseDAM-Asset-Car-V2"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(2)}
          />
          <MotionShadowImageRounded
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
        <MotionShadowImageRounded
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
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Jewellery.png"
            width={237}
            height={175}
            alt="MuseDAM-Asset-Jewellery"
            initial={{ x: 20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(5)}
          />
          <MotionImage
            src="/Hero/MuseDAM-AI-Color.png"
            width={237}
            height={38}
            alt="MuseDAM-AI-Color"
            initial={{ y: 20, opacity: 0 }}
            animate={isBuildFinished(19) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(20)}
          />
        </FlexColContainer>
      </FlexColContainer>
      <FlexColContainer className="gap-6">
        <RelativeContainer>
          <MotionShadowImageRounded
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
            src="/Hero/MuseDAM-Comment.png"
            width={244}
            height={60}
            alt="MuseDAM-Comment"
            className="absolute bottom-[22px] right-[-170px] z-[1] drop-shadow"
            initial={{ x: '10%', opacity: 0 }}
            animate={isBuildFinished(22) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(23)}
          />
        </RelativeContainer>
        <RelativeContainer>
          <MotionShadowImageRounded
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
              animate={isBuildFinished(23) ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(24)}
            />
            <div className="absolute bottom-[30px] right-[3px] h-[290px] w-[272px] object-cover">
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
      <FlexColContainer className="mt-[50px] gap-[24px]">
        <MotionShadowImageRounded
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
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Group3.png"
            width={196.8}
            height={275}
            alt="MuseDAM-Asset-Group3"
            className="absolute"
            initial={{ x: -20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(9)}
          />
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Group2.png"
            width={216.8}
            height={285}
            alt="MuseDAM-Asset-Group2"
            className="absolute top-[9px]"
            initial={{ y: 20, opacity: 0 }}
            animate={isBuildFinished(11) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(12)}
          />
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-Group1.png"
            width={236.8}
            height={285}
            alt="MuseDAM-Asset-Group1"
            className="absolute top-[19px]"
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
          <MotionShadowImageRounded
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
                className="absolute right-2 top-[42px]"
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
            width={237}
            height={315}
            className="h-[315px] rounded-[8px] object-cover"
            initial={{ x: -20, opacity: 0 }}
            animate={isBuildFinished(1) ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeInOut' }}
            onAnimationComplete={() => handleAnimationComplete(11)}
          >
            <source src="/Hero/MuseDAM-Asset-Video.mp4" type="video/mp4" />
          </motion.video>
          <MotionShadowImageRounded
            src="/Hero/MuseDAM-Asset-VideoPlayer.png"
            width={237}
            height={40}
            alt="MuseDAM-Asset-VideoPlayer"
            className="mt-[9px]"
            initial={{ y: '10%', opacity: 0 }}
            animate={isBuildFinished(19) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
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
              transition={{ duration: 0.6, delay: 0, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(22)}
            />
          </AbsXCenterContainer>
        </FlexColContainer>
      </FlexColContainer>
    </div>
  )
}

const MotionImage = motion.create(Image)

const ShadowImage = twx(Image)`shadow-[0_2px_30px_4px_rgba(0,0,0,0.14)]`
const ShadowImageRounded = twx(ShadowImage)`rounded-[8px]`
const MotionShadowImageRounded = motion.create(ShadowImageRounded)

const ShadowRoundedFullImage = twx(ShadowImage)`rounded-full`
const MotionShadowRoundedFullImage = motion.create(ShadowRoundedFullImage)

const FlexColContainer = twx.div`flex flex-col`

const RelativeContainer = twx.div`relative`

const AbsXCenterContainer = twx.div`absolute left-1/2 transform -translate-x-1/2`
