'use client'

import { twx } from '@/utilities/cn'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { useTranslation } from '@/app/i18n/client'
import { useMemo } from 'react'

const Title = twx.p`font-euclid md:text-[80px] text-[54px] font-normal md:leading-[91.52px] leading-[48px] tracking-[1px] text-[#141414]`

export default function HomeHero() {
    const { t } = useTranslation('company')

    const descriptions = useMemo(() => [
        t("about-us.our-story.p1"),
        t("about-us.our-story.p2"),
        t("about-us.our-story.p3"),
        t("about-us.our-story.p4"),
    ], [t])

    return (
        <FlexColContainer className="w-full items-center bg-[#F4F4F4] px-[30px] md:px-20">
            <FlexColContainer className="max-w-[700px] items-center justify-center py-[60px] md:py-[100px]">
                <Title>{t("about-us.our-story.title")}</Title>
                <div className="col-span-1">
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
    )
}
