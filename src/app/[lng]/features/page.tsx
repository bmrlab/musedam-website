import HighlightText from '@/components/HighlightText'
import { FlexColContainer } from '@/components/StyleWrapper/container'
import { Button } from '@/components/ui/button'
import { ArrowDownRight } from 'lucide-react'
import FeaturesBlock from '@/app/[lng]/features/_components/MoreFeatures/block'
import { Metadata } from 'next'
import { seoTranslation } from '@/app/i18n'
import { MetadataProps } from '@/types/page'

export default function AllFeaturesPage() {
  return (
    <FlexColContainer>
      <FlexColContainer className="h-[calc(100vh-70px)] select-none justify-center px-20">
        <h2 className="font-mono text-[20px] font-light leading-[20px] text-black">
          What is MuseDAM?
        </h2>
        <p className="mt-10 font-baskervville text-[68px] font-normal leading-[77.79px] tracking-[1px] text-[#141414]">
          MuseDAM: <HighlightText text="AI-driven" color="#FF8043" /> digital asset management tool
          for secure, efficient <HighlightText text="collaboration" color="#3910EC" /> in design and
          creative teams. <HighlightText text="Manage" color="#89DEFF" /> assets,{' '}
          <HighlightText text="collect" color="#FFB5DB" /> inspiration,{' '}
          <HighlightText text="search" color="#DEFF00" /> content, and harness{' '}
          <HighlightText text="AI for creativity." color="#B4D9FD" />
        </p>
        <div className="mt-12 flex h-[58px] items-center justify-between">
          <Button className="h-full rounded-full bg-black px-[52.2px] py-[19px] font-mono text-[16px] font-normal leading-5 text-white transition-colors hover:bg-gray-800">
            Start for free
          </Button>
          <ArrowDownRight className="size-8 text-black" />
        </div>
      </FlexColContainer>
      <FeaturesBlock />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  return {
    title: t('features.title'),
    description: t('features.description'),
  }
}
