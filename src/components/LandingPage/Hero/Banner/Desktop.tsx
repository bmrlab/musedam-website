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

import { MotionShadowImageRounded } from '.'

export default function DesktopBanner({ className }: { className?: string }) {
  const [aiParseTagRef, aiParseTagHovering] = useHover()
  const [assetMoreRef, assetMoreHovering] = useHover()
  const { getUrl } = usePublicUrl('/assets/Hero')
  const { isZhLng } = useIsZhLng()

  return (
    <div className={cn('flex select-none justify-center gap-6', className)}>
      <FlexColContainer>
        <TopToBottomImage
          src={getUrl('MuseDAM-Kanban.png')}
          width={237}
          height={52}
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
            width={237}
            height={315}
            className={cn(
              'mt-5 h-[315px] rounded-[8px] object-cover',
              'ease-in-out animate-in fade-in slide-in-from-right duration-600 [animation-fill-mode:backwards]',
            )}
          >
            <source src="/assets/Hero/MuseDAM-Asset-Car.mp4" type="video/mp4" />
          </video>
          <div
            className={cn(
              'absolute bottom-[34px] z-[1] flex flex-col gap-2',
              isZhLng ? 'right-[-32px]' : 'right-[-66px]',
            )}
          >
            <RightToLeftImage
              src={getUrl('Tag-Automobile.png')}
              width={isZhLng ? 58 : 110}
              height={30}
              priority
              alt="Tag-Automobile"
              className="shadow-[0px_4px_30px_4px_#00000014] duration-600 delay-2650"
            />
            <RightToLeftImage
              src={getUrl('Tag-Raining.png')}
              width={isZhLng ? 71 : 87}
              height={30}
              priority
              alt="Tag-Raining"
              className="shadow-[0px_4px_30px_4px_#00000014] duration-800 delay-2750"
            />
            <RightToLeftImage
              src={getUrl('Tag-Photography.png')}
              width={isZhLng ? 84 : 118}
              height={30}
              priority
              alt="Tag-Photography"
              className="shadow-[0px_4px_30px_4px_#00000014] duration-1000 delay-2750"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-[11px]">
          <RightToLeftImage
            src="/assets/Hero/MuseDAM-Asset-Car-V2.png"
            width={80}
            height={80}
            priority
            alt="MuseDAM-Asset-Car-V2"
          />
          <RightToLeftImage
            src="/assets/Hero/MuseDAM-Asset-Car-V3.png"
            width={115}
            height={79}
            priority
            alt="MuseDAM-Asset-Car-V3"
          />
        </div>
      </FlexColContainer>
      <FlexColContainer className="mt-[50px] gap-[25px]">
        <RightToLeftImage
          src="/assets/Hero/MuseDAM-Asset-Poster.png"
          width={237}
          height={275}
          priority
          alt="MuseDAM-Asset-Poster"
          className="duration-600 delay-50"
        />
        <FlexColContainer className="gap-[11px]">
          <RightToLeftImage
            src="/assets/Hero/MuseDAM-Asset-Jewellery.png"
            width={237}
            height={175}
            priority
            alt="MuseDAM-Asset-Jewellery"
            className="duration-600 delay-50"
          />
          <BottomToTopImage
            src="/assets/Hero/MuseDAM-AI-Color.png"
            width={237}
            height={38}
            priority
            alt="MuseDAM-AI-Color"
            className="duration-1000 delay-3750"
          />
        </FlexColContainer>
      </FlexColContainer>
      <FlexColContainer className="gap-6">
        <RelativeContainer>
          <RightToLeftImage
            src="/assets/Hero/MuseDAM-Asset-3D.png"
            width={237}
            height={295}
            priority
            alt="MuseDAM-Asset-3D"
            className="duration-600 delay-50"
          />
          <RightToLeftImage
            src={getUrl('MuseDAM-Comment.png')}
            width={244}
            height={60}
            priority
            alt="MuseDAM-Comment"
            className="absolute bottom-[82px] right-[-170px] z-[1] drop-shadow duration-1000 delay-5350"
          />
        </RelativeContainer>
        <RelativeContainer>
          <RightToLeftImage
            src="/assets/Hero/MuseDAM-Asset-Photography.png"
            width={237}
            height={285}
            priority
            alt="MuseDAM-Asset-Photography"
            className="duration-600 delay-50"
          />
          <RelativeContainer>
            <AnimationImagePreset
              ref={aiParseTagRef}
              src="/assets/Hero/MuseDAM-AI-Parsing-Tag.png"
              width={24}
              height={20}
              priority
              alt="MuseDAM-AI-Parsing-Tag"
              className="absolute bottom-[8px] right-[9px] z-[1] cursor-pointer duration-600 delay-5350"
            />
            <div className="absolute bottom-[30px] right-[3px] h-[290px] w-[272px] object-cover">
              <AnimatePresence mode="wait">
                {aiParseTagHovering && (
                  <MotionShadowImageRounded
                    src="/assets/Hero/MuseDAM-AI-Parsing.png"
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
        <LeftToRightImage
          src="/assets/Hero/MuseDAM-Asset-Product.png"
          width={237}
          height={235}
          priority
          alt="MuseDAM-Asset-Product"
          className="duration-600 delay-50"
        />
        <RelativeContainer className="flex justify-center">
          <LeftToRightImage
            src="/assets/Hero/MuseDAM-Asset-Group3.png"
            width={196.8}
            height={275}
            priority
            alt="MuseDAM-Asset-Group3"
            className="absolute duration-600"
          />
          <BottomToTopImage
            src="/assets/Hero/MuseDAM-Asset-Group2.png"
            width={216.8}
            height={285}
            priority
            alt="MuseDAM-Asset-Group2"
            className="absolute top-[9px] duration-500 delay-750"
          />
          <BottomToTopImage
            src="/assets/Hero/MuseDAM-Asset-Group1.png"
            width={236.8}
            height={285}
            alt="MuseDAM-Asset-Group1"
            className="absolute top-[19px] duration-600 delay-1450"
          />
          <div className="absolute right-2 top-[27px] flex gap-1">
            <AnimationImagePreset
              src="/assets/Hero/MuseDAM-Asset-Group-Tag.png"
              width={35}
              height={20}
              priority
              alt="MuseDAM-Asset-Group-Tag"
              className="duration-500 delay-2050"
            />
            <AnimationImagePreset
              src="/assets/Hero/MuseDAM-Asset-Comment-Tag.png"
              width={24}
              height={20}
              priority
              alt="MuseDAM-Asset-Comment-Tag"
              className="duration-500 fade-in delay-2750"
            />
          </div>
        </RelativeContainer>
      </FlexColContainer>
      <FlexColContainer className="gap-6">
        <RelativeContainer>
          <LeftToRightImage
            src="/assets/Hero/MuseDAM-Asset-Cat.png"
            width={237}
            height={275}
            priority
            alt="MuseDAM-Asset-Cat"
            className="duration-600 delay-50"
          />
          <AnimationImagePreset
            ref={assetMoreRef}
            src="/assets/Hero/MuseDAM-Asset-More.png"
            width={30}
            height={30}
            priority
            alt="MuseDAM-Asset-More.png"
            className="absolute right-2 top-2.5 cursor-pointer delay-5350"
          ></AnimationImagePreset>
          <AnimatePresence mode="wait">
            {assetMoreHovering && (
              <AnimationImagePreset
                src="/assets/Hero/MuseDAM-Asset-Dropdown.png"
                width={171}
                height={194}
                alt="MuseDAM-Asset-Dropdown.png"
                className="absolute right-2 top-[42px] duration-800"
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
            width={237}
            height={315}
            className={cn(
              'h-[315px] rounded-[8px] object-cover',
              'animate-in fade-in slide-in-from-left duration-600 delay-50 [animation-fill-mode:backwards]',
            )}
          >
            <source src="/assets/Hero/MuseDAM-Asset-Video.mp4" type="video/mp4" />
          </video>
          <BottomToTopImage
            src="/assets/Hero/MuseDAM-Asset-VideoPlayer.png"
            width={237}
            height={40}
            priority
            alt="MuseDAM-Asset-VideoPlayer"
            className="mt-[9px] duration-1000 delay-3750"
          />
          <AbsXCenterContainer className="bottom-[7px]">
            <BottomToTopImage
              src="/assets/Hero/MuseDAM-Video-Frame.png"
              width={57.22}
              height={139}
              priority
              alt="MuseDAM-Video-Frame.png"
              className="duration-600 delay-4750"
            />
          </AbsXCenterContainer>
        </FlexColContainer>
      </FlexColContainer>
    </div>
  )
}
