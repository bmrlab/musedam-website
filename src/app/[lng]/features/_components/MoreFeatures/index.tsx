'use client'

import { FeaturesCards, FeaturesEnum } from './features'
import FeaturesCard from './card'
import Link from 'next/link'

export type MoreFeaturesProps = {
  features: FeaturesEnum[]
}

export default function MoreFeatures({ features }: MoreFeaturesProps) {
  return (
    <div className="w-screen">
      <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-0 md:justify-between items-center px-6 md:px-[80px] pt-12 md:pt-[82.5px]">
        <h2 className="font-baskervville font-normal text-[38px] md:text-[80px] leading-[43.47px] md:leading-[91.52px] tracking-[1px] text-[#141414]">
          More in AI-Powered
        </h2>
        <Link
          href="/features"
          className="text-black font-mono text-[18px] leading-[28px] tracking-[2%]"
        >
          <span className="underline">View all features</span> →
        </Link>
      </div>
      <div className="flex gap-10 no-scrollbar px-6 md:px-[80px] overflow-x-scroll pt-10 md:pt-[82.5px] pb-12 md:pb-[120px]">
        {features.map((feature, i) => (
          <FeaturesCard
            key={i}
            {...FeaturesCards[feature]}
            className="w-[280px] md:w-[333px] h-[406px] md:h-[522px] md:transition-transform shrink-0 md:duration-300 md:ease-in-out md:hover:-translate-y-5"
          />
        ))}
      </div>
    </div>
  )
}
