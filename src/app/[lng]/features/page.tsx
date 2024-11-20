import HighlightText from '@/components/HighlightText'
import { FlexColContainer } from '@/components/StyleWrapper/container'
import { Button } from '@/components/ui/button'
import { ArrowDownRight } from 'lucide-react'
import FeaturesBlock from '@/app/[lng]/features/_components/MoreFeatures/block'
import { Metadata } from 'next'

export default function AllFeaturesPage() {
  return (
    <FlexColContainer>
      <FlexColContainer className="h-[calc(100vh-70px)] px-20 justify-center select-none">
        <h2 className="font-mono font-light text-[20px] leading-[20px] text-black">
          What is MuseDAM?
        </h2>
        <p className="mt-10 font-baskervville font-normal text-[68px] leading-[77.79px] tracking-[1px] text-[#141414]">
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
          <ArrowDownRight className="h-8 w-8 text-black" />
        </div>
      </FlexColContainer>
      <FeaturesBlock />
    </FlexColContainer>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'MuseDAM | Features - AI-Driven Asset Management & Teamwork',
    description:
      'Discover MuseDAM, the smart digital asset management software that simplifies collection, organization, and team collaboration with AI-powered features.',
  }
}