'use client'

import { cn, twx } from '@/utilities/cn'
import Image from 'next/image'
import { FlexCenterContainer } from '@/components/StyleWrapper/container'

export enum FeaturesEnum {
  AISearch,
  AIParsing,
  ContentCreation,
  AutoTags,
  MuseCopilot,
}

export default function MoreFeatures({ features }: { features: FeaturesEnum[] }) {
  return (
    <div className="w-screen">
      <div className="flex justify-between items-center px-[80px] pt-[82.5px]">
        <h2 className="font-baskervville text-[80px] leading-[91.52px] tracking-[1px] text-[#141414]">
          More in AI-Powered
        </h2>
        <a href="#" className="text-black font-mono text-[18px] leading-[28px] tracking-[2%]">
          <span className="underline">View all features</span> →
        </a>
      </div>
      <div className="flex gap-10 no-scrollbar px-[80px] overflow-x-scroll pt-[82.5px] pb-[120px]">
        {features.map((feature, i) => (
          <FeaturesCard
            key={i}
            {...FeaturesCards[feature]}
            className="w-[333px] h-[522px] transition-transform shrink-0 duration-300 ease-in-out hover:-translate-y-5 hover:shadow-lg"
          />
        ))}
      </div>
    </div>
  )
}

type FeaturesCardProps = {
  title: string
  description: string
  iconUrl: string
  bgColor: string
  iconBgColor: string
}

function FeaturesCard({
  title,
  description,
  bgColor,
  iconBgColor,
  iconUrl,
  className,
}: FeaturesCardProps & { className?: string }) {
  return (
    <div
      style={{ background: bgColor }}
      className={cn('flex flex-col rounded-[20px] py-12 px-6 cursor-pointer', className)}
    >
      <h1 className="text-nowrap font-baskervville font-normal text-[36px] leading-[41.19px] tracking-[1px]">
        {title}
      </h1>
      <Divider className="my-3" />
      <p className="text-[18px] leading-[28px] text-black/60">{description}</p>
      <div className="flex-1 flex items-end">
        <FlexCenterContainer
          style={{ background: iconBgColor }}
          className="w-full h-[293px] rounded-full relative"
        >
          <Image src={iconUrl} fill alt={title} />
        </FlexCenterContainer>
      </div>
    </div>
  )
}

const Divider = twx.div`
  w-full
  border-t
  border-black
  transition-none
`
const FEATURES_ICON_BASE_PATH = '/Features/Features-Card-Icons'

export const FeaturesCards: {
  [key in FeaturesEnum]: FeaturesCardProps
} = {
  [FeaturesEnum.AISearch]: {
    title: 'AI Search',
    description: 'Visual Content Asset Search',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/AI-Search.svg`,
    bgColor: '#BCCAE0',
    iconBgColor: '#fff',
  },
  [FeaturesEnum.AIParsing]: {
    title: 'AI Parsing',
    description: 'Visuals, Color Schemes, Themes, etc.',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/AI-Parsing.svg`,
    bgColor: '#DEFF00',
    iconBgColor: '#333333',
  },
  [FeaturesEnum.ContentCreation]: {
    title: 'Content Creation',
    description: 'Craft Blog from Asset Insights',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Content-Creation.svg`,
    bgColor: '#DDD2F3',
    iconBgColor: '#fff',
  },
  [FeaturesEnum.AutoTags]: {
    title: 'Auto Tags',
    description: 'Auto-Tag for Search & Clustering',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Auto-Tags.svg`,
    bgColor: '#FFB5DB',
    iconBgColor: '#5F4754',
  },
  [FeaturesEnum.MuseCopilot]: {
    title: 'MuseCopilot',
    description: 'Chat with Copilot on your Content',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/MuseCopilot.svg`,
    bgColor: '#928DFF',
    iconBgColor: '#B2FFD8',
  },
}
