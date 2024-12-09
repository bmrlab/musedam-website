'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/utilities/cn'
import { useHover } from '@uidotdev/usehooks'
import { AnimatePresence } from 'framer-motion'

import useIsZhLng from '@/hooks/useIsZhLng'
import usePublicUrl from '@/hooks/usePublicUrl'
import {
  AbsXCenterContainer,
  FlexColContainer,
  RelativeContainer,
} from '@/components/StyleWrapper/Container'
import {
  AnimationImagePreset,
  BottomToTopImage,
  LeftToRightImage,
  RightToLeftImage,
  TopToBottomImage,
} from '@/components/StyleWrapper/image'

export default function MobileBanner({ className }: { className?: string }) {
  const [assetMoreRef, assetMoreHovering] = useHover()
  const { getUrl } = usePublicUrl('/assets/Hero')
  const { isZhLng } = useIsZhLng()

  return (
    <div className="no-scrollbar flex justify-center overflow-hidden px-6">
      <div
        className={cn(
          'flex w-[800px] shrink-0 select-none justify-center gap-[14.08px]',
          className,
        )}
      >
        <FlexColContainer>
          <TopToBottomImage
            src={getUrl('MuseDAM-Kanban.png')}
            width={137.25}
            height={30.94}
            priority
            alt="MuseDAM-Kanban"
            className="rounded-[4.69px] shadow-[0_1.17px_17.6px_2.35px_#00000014] duration-1000 delay-3750"
          />
          <div className="relative">
            <video
              loop
              autoPlay
              muted
              playsInline
              x5-video-player-type="h5-page"
              x5-video-player-fullscreen="false"
              width={160}
              height={190}
              className={cn(
                'mt-[11.73px] h-[184.75px] rounded-[8px] object-cover',
                'ease-in-out animate-in fade-in slide-in-from-right duration-600 [animation-fill-mode:backwards]',
              )}
            >
              <source src="/assets/Hero/MuseDAM-Asset-Car.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-[19.13px] right-[-29.58px] z-[1] flex flex-col gap-2">
              <RightToLeftImage
                src={getUrl('Tag-Automobile.png')}
                width={isZhLng ? 34.08 : 65.08}
                height={17.87}
                priority
                alt="Tag-Automobile"
                className="shadow-[0px_4px_30px_4px_#00000014] duration-600 delay-2650"
              />
              <RightToLeftImage
                src={getUrl('Tag-Raining.png')}
                width={isZhLng ? 42.08 : 51.08}
                height={17.87}
                priority
                alt="Tag-Raining"
                className="shadow-[0px_4px_30px_4px_#00000014] duration-800 delay-2750"
              />
              <RightToLeftImage
                src={getUrl('Tag-Photography.png')}
                width={isZhLng ? 50.08 : 69.08}
                height={17.87}
                priority
                alt="Tag-Photography"
                className="shadow-[0px_4px_30px_4px_#00000014] duration-1000 delay-2750"
              />
            </div>
          </div>
          <div className="mt-[9.38px] flex gap-[11px]">
            <RightToLeftImage
              src="/assets/Hero/MuseDAM-Asset-Car-V2.png"
              width={46.92}
              height={46.92}
              priority
              alt="MuseDAM-Asset-Car-V2"
            />
            <RightToLeftImage
              src="/assets/Hero/MuseDAM-Asset-Car-V3.png"
              width={67.45}
              height={46.33}
              priority
              alt="MuseDAM-Asset-Car-V3"
            />
          </div>
        </FlexColContainer>
        <FlexColContainer className="mt-[29.33px] gap-[14.66px]">
          <RightToLeftImage
            src="/assets/Hero/MuseDAM-Asset-Poster.png"
            width={160}
            height={184}
            priority
            alt="MuseDAM-Asset-Poster"
            className="duration-600 delay-50"
          />
          <FlexColContainer className="gap-[11px]">
            <RightToLeftImage
              src="/assets/Hero/MuseDAM-Asset-Jewellery.png"
              width={160}
              height={120}
              priority
              alt="MuseDAM-Asset-Jewellery"
              className="duration-600 delay-50"
            />
            <BottomToTopImage
              src="/assets/Hero/MuseDAM-AI-Color.png"
              width={160}
              height={22.9}
              priority
              alt="MuseDAM-AI-Color"
              className="duration-1000 delay-3750"
            />
          </FlexColContainer>
        </FlexColContainer>
        <FlexColContainer className="gap-[14.08px]">
          <RelativeContainer>
            <RightToLeftImage
              src="/assets/Hero/MuseDAM-Asset-3D.png"
              width={160}
              height={198}
              priority
              alt="MuseDAM-Asset-3D"
              className="duration-600 delay-50"
            />
            <RightToLeftImage
              src={getUrl('MuseDAM-Comment.png')}
              width={180}
              height={60}
              priority
              alt="MuseDAM-Comment"
              className="absolute bottom-[42px] left-[95.6px] z-[1] drop-shadow duration-1000 delay-5350"
            />
          </RelativeContainer>
          <RelativeContainer>
            <RightToLeftImage
              src="/assets/Hero/MuseDAM-Asset-Photography.png"
              width={160}
              height={167.16}
              priority
              alt="MuseDAM-Asset-Photography"
              className="duration-600 delay-50"
            />
            {/*<RelativeContainer>*/}
            {/*  <AnimationImagePreset*/}
            {/*    ref={aiParseTagRef}*/}
            {/*    src="/assets/Hero/MuseDAM-AI-Parsing-Tag.png"*/}
            {/*    width={14.08}*/}
            {/*    height={11.73}*/}
            {/*    priority*/}
            {/*    alt="MuseDAM-AI-Parsing-Tag"*/}
            {/*    className="absolute bottom-[8px] right-[9px] z-[1] cursor-pointer duration-600 delay-5350"*/}
            {/*  />*/}
            {/*  <div className="absolute bottom-[22px] right-[3px] z-[2] h-[192px] w-[180px] object-cover">*/}
            {/*    <AnimatePresence mode="wait">*/}
            {/*      {aiParseTagHovering && (*/}
            {/*        <AnimationImagePreset*/}
            {/*          src="/assets/Hero/MuseDAM-AI-Parsing.png"*/}
            {/*          fill*/}
            {/*          alt="MuseDAM-AI-Parsing"*/}
            {/*        />*/}
            {/*      )}*/}
            {/*    </AnimatePresence>*/}
            {/*  </div>*/}
            {/*</RelativeContainer>*/}
          </RelativeContainer>
        </FlexColContainer>
        <FlexColContainer className="mt-[20.93px] gap-[14.08px]">
          <LeftToRightImage
            src="/assets/Hero/MuseDAM-Asset-Product.png"
            width={138.89}
            height={137.83}
            priority
            alt="MuseDAM-Asset-Product"
            className="duration-600 delay-50"
          />
          <RelativeContainer className="flex justify-center">
            <LeftToRightImage
              src="/assets/Hero/MuseDAM-Asset-Group3.png"
              width={115.43}
              height={161.29}
              priority
              alt="MuseDAM-Asset-Group3"
              className="absolute duration-600"
            />
            <BottomToTopImage
              src="/assets/Hero/MuseDAM-Asset-Group2.png"
              width={127.16}
              height={167.16}
              priority
              alt="MuseDAM-Asset-Group2"
              className="absolute top-[9px] duration-500 delay-750"
            />
            <BottomToTopImage
              src="/assets/Hero/MuseDAM-Asset-Group1.png"
              width={138.89}
              height={167.16}
              priority
              alt="MuseDAM-Asset-Group1"
              className="absolute top-[19px] duration-600 delay-1450"
            />
            <div className="absolute right-[4.9px] top-[22.84px] flex gap-1">
              <AnimationImagePreset
                src="/assets/Hero/MuseDAM-Asset-Group-Tag.png"
                width={20.32}
                height={11.73}
                priority
                alt="MuseDAM-Asset-Group-Tag"
                className="duration-500 delay-2050"
              />
              <AnimationImagePreset
                src="/assets/Hero/MuseDAM-Asset-Comment-Tag.png"
                width={14.08}
                height={11.73}
                priority
                alt="MuseDAM-Asset-Comment-Tag"
                className="duration-500 fade-in delay-2750"
              />
            </div>
          </RelativeContainer>
        </FlexColContainer>
        <FlexColContainer className="gap-[14.08px]">
          <RelativeContainer>
            <LeftToRightImage
              src="/assets/Hero/MuseDAM-Asset-Cat.png"
              width={160}
              height={184}
              priority
              alt="MuseDAM-Asset-Cat"
              className="duration-600 delay-50"
            />
            <AnimationImagePreset
              ref={assetMoreRef}
              src="/assets/Hero/MuseDAM-Asset-More.png"
              width={17.6}
              height={17.6}
              priority
              alt="MuseDAM-Asset-More.png"
              className="absolute right-[4.69px] top-[5.87px] cursor-pointer delay-5350"
            />
            <AnimatePresence mode="wait">
              {assetMoreHovering && (
                <AnimationImagePreset
                  src="/assets/Hero/MuseDAM-Asset-Dropdown.png"
                  width={171}
                  height={194}
                  alt="MuseDAM-Asset-Dropdown.png"
                  className="absolute right-2 top-[25px] z-[2] duration-800"
                ></AnimationImagePreset>
              )}
            </AnimatePresence>
          </RelativeContainer>
          <FlexColContainer className="relative">
            <video
              loop
              autoPlay
              muted
              playsInline
              x5-video-player-type="h5-page"
              x5-video-player-fullscreen="false"
              width={160}
              height={184.75}
              className={cn(
                'h-[184.75px] rounded-[8px] object-cover',
                'animate-in fade-in slide-in-from-left duration-600 delay-50 [animation-fill-mode:backwards]',
              )}
            >
              <source src="/assets/Hero/MuseDAM-Asset-Video.mp4" type="video/mp4" />
            </video>
            <BottomToTopImage
              src="/assets/Hero/MuseDAM-Asset-VideoPlayer.png"
              width={160}
              height={23.46}
              priority
              alt="MuseDAM-Asset-VideoPlayer"
              className="mt-[9px] duration-1000 delay-3750"
            />
            <AbsXCenterContainer className="bottom-[4.11px]">
              <BottomToTopImage
                src="/assets/Hero/MuseDAM-Video-Frame.png"
                width={33.56}
                height={81.53}
                priority
                alt="MuseDAM-Video-Frame.png"
                className="duration-600 delay-4750"
              />
            </AbsXCenterContainer>
          </FlexColContainer>
        </FlexColContainer>
      </div>
    </div>
  )
}
