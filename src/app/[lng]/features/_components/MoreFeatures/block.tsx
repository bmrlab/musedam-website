import { FeaturesCards, FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'
import { FlexColContainer, FlexRowContainer } from '@/components/StyleWrapper/container'
import { cn } from '@/utilities/cn'
import { FeaturesRectIconCard } from '@/app/[lng]/features/_components/MoreFeatures/card'

const blocks: {
  category: string
  features: FeaturesEnum[]
}[] = [
  {
    category: 'AI Powered',
    features: [
      FeaturesEnum.AISearch,
      FeaturesEnum.AIParsing,
      FeaturesEnum.ContentCreation,
      FeaturesEnum.AutoTags,
      FeaturesEnum.MuseCopilot,
    ],
  },
  {
    category: 'Visual Workspace',
    features: [
      FeaturesEnum.FileCollection,
      FeaturesEnum.SmartFolders,
      FeaturesEnum.Formats,
      FeaturesEnum.MultipleViewing,
      FeaturesEnum.Sharing,
    ],
  },
  {
    category: 'Team Collaboration',
    features: [
      FeaturesEnum.Team,
      FeaturesEnum.Permissions,
      FeaturesEnum.Feedback,
      FeaturesEnum.Versions,
      FeaturesEnum.DataStatistics,
    ],
  },
]

const isOdd = (num: number) => !!(num & 1)

export default function FeaturesBlock() {
  return (
    <>
      {blocks.map((block, index) => (
        <FlexRowContainer
          key={index}
          className={cn('gap-10 bg-[#F0F0F0] px-[80px] py-[100px]', isOdd(index) && 'bg-white')}
        >
          <FlexColContainer className="w-[250px] shrink-0 gap-3 font-baskervville font-normal tracking-[1px] text-black">
            <h1 className="text-[120px] leading-[137.29px]">{`0${index + 1}`}</h1>
            <p className="text-[40px] leading-[45.76px]">{block.category}</p>
          </FlexColContainer>
          <FlexRowContainer className="flex-wrap gap-6">
            {block.features.map((feature, index) => (
              <FeaturesRectIconCard
                key={index}
                {...FeaturesCards[feature]}
                className="h-[385px] w-[314px] shrink-0 transition-transform duration-300 ease-in-out hover:-translate-y-5"
              />
            ))}
          </FlexRowContainer>
        </FlexRowContainer>
      ))}
    </>
  )
}
