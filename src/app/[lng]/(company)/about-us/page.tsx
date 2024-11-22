import { Metadata } from 'next'
import { twx } from '@/utilities/cn'

import { PropsWithLng } from '@/types/page'
import HomeHero from '@/components/About/Hero'
import InvestorsCards from '@/components/About/InvestorsCards'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { FlexColContainer } from '@/components/StyleWrapper/container'

const Title = twx.p`font-baskervville md:text-[80px] text-[54px] font-normal md:leading-[91.52px] leading-[48px] tracking-[1px] text-[#141414]`

export default async function AllFeaturesPage({ params }: PropsWithLng) {
  const { lng } = await params
  const descriptions = [
    'In 2015, "Tezign" set sail on a creative voyage, fusing technology and design under the Tech + Design banner, and has since expanded to a global network encompassing over 100,000 creative professionals. Leaping forward to 2017, we launched our enterprise-grade Digital Asset Management (DAM) solution, transforming how businesses handle marketing materials and optimize the flow of digital assets internally. Our expertise has been tapped into by more than 200 brands spanning a spectrum of industries, from FMCG and retail to beauty, fashion, B2B, and pharmaceuticals.',
    'Reaching a pivotal moment in 2021, Tezign secured its Series D1 funding round, catapulting us into the exclusive unicorn startup club with a valuation surpassing one billion dollars. This landmark achievement has turbocharged our expansion and ignited a new wave of innovation within our walls.',
    'By 2023, our organization had cultivated a family of Muse products, including MuseDAM, MuseAI, MuseTransfer, and MuseLink—each meticulously designed for and adored by the creative community. As we moved into 2024, we integrated our Muse offerings, intensifying our dedication to the advancement of MuseDAM. Our mission: to arm both enterprises and individual creators with a cutting-edge design asset management tool, tailor-made for the AI revolution.',
    'MuseDAM stands as the quintessential design asset management tool for the AI age, harmoniously integrating inspiration collection, asset management, team collaboration, and AI-driven generation into one cohesive platform. This convergence frees creators to devote more time and energy to the core of creativity itself.',
  ]
  return (
    <FlexColContainer className="w-full items-center">
      <HomeHero />
      <FlexColContainer className="w-full items-center bg-[#F4F4F4] px-[30px] md:px-20">
        <FlexColContainer className="max-w-[700px] select-none items-center justify-center">
          <Title className="mt-[60px] md:mt-[100px]">Our Story</Title>
          <div className="col-span-1 py-[30px] md:py-10">
            {descriptions.map((item, i) => (
              <p
                className="mt-6 font-mono text-[16px] font-light leading-6 tracking-[2%]"
                key={`our-story-line-${i}`}
              >
                {item}
              </p>
            ))}
          </div>
        </FlexColContainer>
      </FlexColContainer>
      <InvestorsCards />
      <SubscribeBlock lng={lng} className="w-full" />
    </FlexColContainer>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `MuseDAM | Our Story: Empowering Digital Asset Management`,
    description: `Discover the MuseDAM journey and meet our investors. We're revolutionizing digital asset management with intuitive tools and a global vision, connecting creators and businesses worldwide.`,
  }
}
