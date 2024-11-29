/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-22 11:24:23
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-22 11:26:35
 * @FilePath: /musedam-website/src/components/About/OurStory.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
            <FlexColContainer className="max-w-[700px] select-none items-center justify-center">
                <Title className="mt-[60px] md:mt-[100px]">{t("about-us.our-story.title")}</Title>
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
    )
}
