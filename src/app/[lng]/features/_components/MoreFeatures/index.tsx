'use client'

import { useFeaturesCards, FeaturesEnum } from './features'
import FeaturesCard from './card'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export type MoreFeaturesProps = {
  features: FeaturesEnum[]
}

export default function MoreFeatures({ features }: MoreFeaturesProps) {
  const { t } = useTranslation('features')
  const FeaturesCards = useFeaturesCards()
  return (
    <div className="w-screen">
      <div className="flex flex-col items-center justify-center gap-2 px-6 pt-12 md:flex-row md:justify-between md:gap-0 md:px-[80px] md:pt-[82.5px]">
        <h2 className="font-baskervville text-[38px] font-normal leading-[43.47px] tracking-[1px] text-[#141414] md:text-[80px] md:leading-[91.52px]">
          {t('more-features.title')}
        </h2>
        <Link
          href="/features"
          className="font-mono text-[18px] leading-[28px] tracking-[2%] text-black"
        >
          <span className="underline">{t('more-features.view-all')}</span> →
        </Link>
      </div>
      <div className="no-scrollbar flex gap-10 overflow-x-scroll px-6 pb-12 pt-10 md:px-[80px] md:pb-[120px] md:pt-[82.5px]">
        {features.map((feature, i) => (
          <FeaturesCard
            key={i}
            {...FeaturesCards[feature]}
            className="h-[406px] w-[280px] shrink-0 md:h-[522px] md:w-[333px] md:transition-transform md:duration-300 md:ease-in-out md:hover:-translate-y-5"
          />
        ))}
      </div>
    </div>
  )
}
