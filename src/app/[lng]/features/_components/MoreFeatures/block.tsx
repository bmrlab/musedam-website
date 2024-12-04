'use client'

import { useMemo } from 'react'
import { cn } from '@/utilities/cn'

import useIsZhLng from '@/hooks/useIsZhLng'
import { FlexColContainer, FlexRowContainer } from '@/components/StyleWrapper/Container'
import { FeaturesRectIconCard } from '@/app/[lng]/features/_components/MoreFeatures/card'
import {
  FeaturesEnum,
  useFeaturesCards,
} from '@/app/[lng]/features/_components/MoreFeatures/features'
import { useFeaturesTranslation } from '@/app/i18n/client'

const isOdd = (num: number) => !!(num & 1)

export default function FeaturesBlock() {
  const FeaturesCards = useFeaturesCards()
  const { t } = useFeaturesTranslation()
  const { isZhLng } = useIsZhLng()

  const blocks: {
    category: string
    features: FeaturesEnum[]
  }[] = useMemo(
    () => [
      {
        category: t('features.ai-powered.title'),
        features: [
          FeaturesEnum.AISearch,
          FeaturesEnum.AIParsing,
          FeaturesEnum.ContentCreation,
          FeaturesEnum.AutoTags,
          FeaturesEnum.MuseCopilot,
        ],
      },
      {
        category: t('features.visual-workspace.title'),
        features: [
          FeaturesEnum.FileCollection,
          FeaturesEnum.SmartFolders,
          FeaturesEnum.Formats,
          FeaturesEnum.MultipleViewing,
          FeaturesEnum.Sharing,
        ],
      },
      {
        category: t('features.team-collaboration.title'),
        features: [
          FeaturesEnum.Team,
          FeaturesEnum.Permissions,
          FeaturesEnum.Feedback,
          FeaturesEnum.Versions,
          FeaturesEnum.DataStatistics,
        ],
      },
    ],
    [t],
  )

  return (
    <>
      {blocks.map((block, index) => (
        <FlexRowContainer
          key={index}
          className={cn(
            'flex-col gap-10 bg-[#F0F0F0] px-6 py-[60px] md:flex-row md:px-[80px] md:py-[100px]',
            isOdd(index) && 'bg-white',
          )}
        >
          <FlexColContainer className="w-[250px] shrink-0 gap-3 tracking-[1px] text-black">
            <h1
              className={cn(
                'text-[80px] font-light leading-[80px] md:text-[120px] md:leading-[137.29px]',
                !isZhLng && 'font-mono',
              )}
            >{`0${index + 1}`}</h1>
            <p className="text-[40px] font-normal leading-[40px] md:leading-[45.76px]">
              {block.category}
            </p>
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
