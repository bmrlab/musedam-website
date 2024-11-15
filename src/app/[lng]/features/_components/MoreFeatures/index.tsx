'use client'

import { FeaturesCards, FeaturesEnum } from './features'
import FeaturesCard from './card'

export type MoreFeaturesProps = {
  features: FeaturesEnum[]
}

export default function MoreFeatures({ features }: MoreFeaturesProps) {
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
