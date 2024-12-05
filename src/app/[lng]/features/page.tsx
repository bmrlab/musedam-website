'use client'

import { cn } from '@/utilities/cn'

import useIsZhLng from '@/hooks/useIsZhLng'
import { Button } from '@/components/ui/button'
import HighlightText from '@/components/HighlightText'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { useFeaturesTranslation } from '@/app/i18n/client'

import FeaturesBlock from './_components/MoreFeatures/block'

export default function AllFeaturesPage() {
  const { t } = useFeaturesTranslation()
  const { isZhLng } = useIsZhLng()
  return (
    <FlexColContainer>
      <FlexColContainer className="select-none justify-center px-6 pb-[60px] pt-10 md:min-h-[calc(100vh-70px)] md:px-20 md:pb-[100px] md:pt-[80px]">
        <h2
          className={cn(
            'hidden text-[20px] font-light leading-[20px] text-black md:block',
            !isZhLng && 'font-mono',
          )}
        >
          {t('features.title')}
        </h2>
        <div className="mt-0 animate-fade-in-up md:mt-10">
          {isZhLng ? <ZhHeroText /> : <EnHeroText />}
        </div>
        <div className="mt-[60px] flex h-[50px] animate-fade-in-up items-center justify-center md:mt-12 md:h-[58px] md:justify-between">
          <Button className="h-full w-[240px] rounded-full bg-black px-[52.2px] font-mono text-[16px] font-normal leading-5 text-white transition-colors hover:bg-gray-800 md:py-[19px]">
            {t('button.start')}
          </Button>
        </div>
      </FlexColContainer>
      <FeaturesBlock />
    </FlexColContainer>
  )
}

const ZhHeroText = () => {
  return (
    <p className="text-[35px] font-normal leading-[50px] text-[#141414]  md:text-[54px] md:leading-[94.5px] md:tracking-[1px]">
      MuseDAM: 一款专为设计和创意团队设计的
      <HighlightText text="AI驱动" color="#FF8043" />
      的数字资产管理工具，确保安全且高效的
      <HighlightText text="团队协作" color="#3910EC" />
      。它可以帮助您
      <HighlightText text="管理" color="#89DEFF" />
      资产、
      <HighlightText text="收集" color="#FFB5DB" />
      灵感、
      <HighlightText text="搜索" color="#DEFF00" />
      内容，并借助人工智能的力量
      <HighlightText text="激发创意" color="#B4D9FD" /> 。
    </p>
  )
}

const EnHeroText = () => {
  return (
    <p className="font-euclid text-[32px] font-normal leading-[40.58px] tracking-[1px] text-[#141414]  md:text-[68px] md:leading-[77.79px]">
      MuseDAM: <HighlightText text="AI-driven" color="#FF8043" /> digital asset management tool for
      secure, efficient <HighlightText text="collaboration" color="#3910EC" /> in design and
      creative teams. <HighlightText text="Manage" color="#89DEFF" /> assets,{' '}
      <HighlightText text="collect" color="#FFB5DB" /> inspiration,{' '}
      <HighlightText text="search" color="#DEFF00" /> content, and harness{' '}
      <HighlightText text="AI for creativity." color="#B4D9FD" />{' '}
    </p>
  )
}
