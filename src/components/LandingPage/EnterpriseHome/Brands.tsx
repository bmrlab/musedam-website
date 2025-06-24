'use client'

import { useMemo } from 'react'

import useIsMobile from '@/hooks/useIsMobile'
import { useHighlightTranslation, useTranslation } from '@/app/i18n/client'

import usePublicUrl from '@/hooks/usePublicUrl'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import Link from 'next/link'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { DarkButton } from '@/components/StyleWrapper/button'
import Image from 'next/image'
import { LocaleLink } from '@/components/LocalLink'
import { HoverTranslateXArrowRight } from '@/components/StyleWrapper/icon'

export type AINativeCard = {
    key: string
    image: string
}

export default function Brands() {
    const { t } = useHighlightTranslation()
    const getUrl = (fileName: string) => `/assets/Enterprise/Brands/${fileName}`


    return <div className='flex w-full flex-col items-center overflow-hidden'>
        <div className='w-full overflow-x-scroll p-5 md:max-w-[1440px] md:px-[80px] md:py-[60px] md:pb-[120px]'>
            <FadeInUpContainer className="mt-10 flex w-full flex-col items-center gap-4 md:mt-[80px] md:flex-row md:justify-between md:gap-0 ">
                <div className="flex max-w-[800px] flex-col items-center gap-6 px-6 md:items-start md:gap-10">
                    <h1 className="text-center text-[32px] font-normal leading-[41.6px]  md:text-left md:text-[64px] md:leading-[73.6px]">
                        Discover How Muse Powers Exceptional Brands
                    </h1>
                </div>
                <LocaleLink
                    href="/features"
                    className="group flex items-center gap-2 font-mono text-[14px] leading-[18.2px] tracking-[2%] text-white"
                >
                    <span className="underline-animation">See the full usercase</span>
                    <HoverTranslateXArrowRight />
                </LocaleLink>
            </FadeInUpContainer>
        </div>


        <div className='no-scrollbar w-full overflow-scroll p-5 md:px-[80px] md:py-[60px] md:pb-[120px]'>
            <div className='flex w-fit gap-10'>
                {['1.png', '2.png', '3.png', '4.png'].map((key) =>
                    <Image src={getUrl(key)} key={key} alt={key} className='h-auto w-[200px] shrink-0 object-cover md:h-[257px] md:w-[450px]' width={450} height={250} />
                )}
            </div>
            <div className='mt-10 flex w-fit gap-10'>
                {['5.png', '6.png', '7.png', '8.png'].map((key) =>
                    <Image src={getUrl(key)} key={key} alt={key} className='h-auto w-[200px] shrink-0 object-cover  md:h-[257px] md:w-[450px]' width={450} height={250} />
                )}
            </div>
        </div>
    </div>
}
