import Image from 'next/image'
import { twx } from '@/lib/utils'

export default function Hero() {
  return (
    <div className="flex w-full flex-col items-center justify-center px-[80px]">
      <h1 className="mt-[59px] text-center text-[68px] font-normal leading-[77.79px] text-[#141414]">
        <p>Smart Asset Management</p>
        <p>for the AI Content Era</p>
      </h1>
      <button className="mb-[58px] mt-9 rounded-[1000px] bg-black px-[57.5px] py-[19px] text-[16px] font-normal leading-[20px] text-white">
        Start for free
      </button>
      <Banner />
      <div className="mt-[80px] flex w-full items-center justify-between">
        <h1 className="text-[68px] font-normal leading-[77.79px] text-[#141414]">
          AI-Powered Asset Management
        </h1>
        <div className="flex max-w-[680px] flex-col items-start gap-10">
          <p className="text-[16px] font-light leading-6 text-[#141414]">
            Dive into the future of asset management with MuseDAM's cutting-edge AI system.
            Experience intelligent search, insightful smart parsing, and a robust suite of creative
            tools, all enhanced by our interactive MuseCopilot for a seamless experience.
          </p>
          <button className="rounded-[8px] bg-black px-[42.5px] py-[14px] text-[16px] leading-5 text-white">
            Start for free
          </button>
        </div>
      </div>
      <div className="mt-[80px] w-full px-10">
        <Image
          src="/video-replace.png"
          width={1200}
          height={692}
          alt="muse hero"
          className="object-contain"
        />
      </div>
    </div>
  )
}

const Banner = () => {
  return (
    <div className="flex justify-center gap-6">
      <FlexColContainer>
        <ShadowImageRounded
          src="/banner/MuseDAM-Kanban.png"
          width={237}
          height={315}
          alt="MuseDAM-Kanban"
        />
        <div className="relative">
          <video
            loop
            autoPlay
            muted
            width={237}
            height={315}
            className="mt-5 h-[315px] rounded-[8px] object-cover"
          >
            <source src="/banner/MuseDAM-Asset-Car.mp4" type="video/mp4" />
          </video>
          <div className="absolute bottom-[34px] right-[-66px] flex flex-col gap-2">
            <ShadowRoundedFullImage
              src="/banner/Tag-Automobile.png"
              width={110}
              height={30}
              alt="Tag-Automobile"
            />
            <ShadowRoundedFullImage
              src="/banner/Tag-Raining.png"
              width={87}
              height={30}
              alt="Tag-Raining"
            />
            <ShadowRoundedFullImage
              src="/banner/Tag-Photography.png"
              width={118}
              height={30}
              alt="Tag-Photography"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-[11px]">
          <ShadowImageRounded
            src="/banner/MuseDAM-Asset-Car-V2.png"
            width={80}
            height={80}
            alt="MuseDAM-Asset-Car-V2"
          />
          <ShadowImageRounded
            src="/banner/MuseDAM-Asset-Car-V3.png"
            width={115}
            height={79}
            alt="MuseDAM-Asset-Car-V3"
          />
        </div>
      </FlexColContainer>
      <FlexColContainer className="mt-[50px] gap-[25px]">
        <ShadowImageRounded
          src="/banner/MuseDAM-Asset-Poster.png"
          width={237}
          height={275}
          alt="MuseDAM-Asset-Poster"
        />
        <FlexColContainer className="gap-[11px]">
          <ShadowImageRounded
            src="/banner/MuseDAM-Asset-Jewellery.png"
            width={237}
            height={175}
            alt="MuseDAM-Asset-Jewellery"
          />
          <Image
            src="/banner/MuseDAM-AI-Color.png"
            width={237}
            height={38}
            alt="MuseDAM-AI-Color"
          />
        </FlexColContainer>
      </FlexColContainer>
      <FlexColContainer className="gap-6">
        <RelativeContainer>
          <ShadowImageRounded
            src="/banner/MuseDAM-Asset-3D.png"
            width={237}
            height={295}
            alt="MuseDAM-Asset-3D"
          />
          <Image
            src="/banner/MuseDAM-Comment.png"
            width={244}
            height={60}
            alt="MuseDAM-Comment"
            className="absolute bottom-[22px] right-[-170px] drop-shadow"
          />
        </RelativeContainer>
        <ShadowImageRounded
          src="/banner/MuseDAM-Asset-Photography.png"
          width={237}
          height={285}
          alt="MuseDAM-Asset-Photography"
        />
      </FlexColContainer>
      <FlexColContainer className="mt-[50px] gap-[24px]">
        <ShadowImageRounded
          src="/banner/MuseDAM-Asset-Product.png"
          width={237}
          height={235}
          alt="MuseDAM-Asset-Product"
        />
        <RelativeContainer className="flex justify-center">
          <ShadowImageRounded
            src="/banner/MuseDAM-Asset-Group3.png"
            width={196.8}
            height={275}
            alt="MuseDAM-Asset-Group3"
            className="absolute"
          />
          <ShadowImageRounded
            src="/banner/MuseDAM-Asset-Group2.png"
            width={216.8}
            height={285}
            alt="MuseDAM-Asset-Group2"
            className="absolute top-[9px]"
          />
          <ShadowImageRounded
            src="/banner/MuseDAM-Asset-Group1.png"
            width={236.8}
            height={285}
            alt="MuseDAM-Asset-Group1"
            className="absolute top-[19px]"
          />
          <div className="absolute right-2 top-[27px] flex gap-1">
            <Image
              src="/banner/MuseDAM-Asset-Group-Tag.png"
              width={35}
              height={20}
              alt="MuseDAM-Asset-Group-Tag"
            />
            <Image
              src="/banner/MuseDAM-Asset-Comment-Tag.png"
              width={24}
              height={20}
              alt="MuseDAM-Asset-Comment-Tag"
            />
          </div>
        </RelativeContainer>
      </FlexColContainer>
      <FlexColContainer className="gap-6">
        <ShadowImageRounded
          src="/banner/MuseDAM-Asset-Cat.png"
          width={237}
          height={275}
          alt="MuseDAM-Asset-Cat"
        />
        <FlexColContainer className="relative">
          <video
            loop
            autoPlay
            muted
            width={237}
            height={315}
            className="h-[315px] rounded-[8px] object-cover"
          >
            <source src="/banner/MuseDAM-Asset-Video.mp4" type="video/mp4" />
          </video>
          <ShadowImageRounded
            src="/banner/MuseDAM-Asset-VideoPlayer.png"
            width={237}
            height={40}
            alt="MuseDAM-Asset-VideoPlayer"
            className="mt-[9px]"
          />
          <AbsXCenterContainer className="bottom-[7px]">
            <Image
              src="/banner/MuseDAM-Video-Frame.png"
              width={57.22}
              height={139}
              alt="MuseDAM-Video-Frame.png"
            />
          </AbsXCenterContainer>
        </FlexColContainer>
      </FlexColContainer>
    </div>
  )
}

const ShadowImage = twx(Image)`shadow-[0_2px_30px_4px_rgba(0,0,0,0.14)]`
const ShadowImageRounded = twx(ShadowImage)`rounded-[8px]`
const ShadowRoundedFullImage = twx(ShadowImage)`rounded-full`

const FlexColContainer = twx.div`flex flex-col`

const RelativeContainer = twx.div`relative`

const AbsXCenterContainer = twx.div`absolute left-1/2 transform -translate-x-1/2`
