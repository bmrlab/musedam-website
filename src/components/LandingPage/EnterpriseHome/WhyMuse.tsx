
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
import { Button } from '@/components/ui/button'

export type AINativeCard = {
    key: string
    title: string
    description: string
    image: string
}

export default function WhyMuse() {
    const { t } = useHighlightTranslation()
    const getUrl = (fileName: string) => `/assets/Hero/MuseDAM-Asset-${fileName}`

    const data: AINativeCard[] = [
        {
            key: 'collect',
            title: 'Intelligent Asset Management & Organization',
            description: 'Streamline Content Lifecycle',
            image: getUrl('3D.png'),
        },
        {
            key: 'organize',
            title: 'Conversational Search & Discovery',
            description: 'Simplify Content Access',
            image: getUrl('Group1.png'),
        },
        {
            key: 'collaborate',
            title: 'Smart Distribution & Publishing',
            description: 'Streamline Team Collaboration',
            image: getUrl('Group2.png'),
        },
        {
            key: 'ai-generate',
            title: 'Enterprise Security & Compliance',
            description: 'Drive Multi-Channel Content Strategy',
            image: getUrl('Group3.png'),
        },
        {
            key: 'Compliance',
            title: 'Enterprise Security & Compliance',
            description: 'Protect Digital Asset Value',
            image: getUrl('Poster.png'),
        },
        {
            key: 'Data-Driven',
            title: 'Data-Driven Insights',
            description: 'Drive Strategic Decisions & Growth',
            image: getUrl('Product.png'),
        },
    ]

    return <div className='flex w-full  justify-center  px-[80px] py-[60px] pb-[120px]'>
        <div className='flex w-full flex-col items-center overflow-x-scroll md:max-w-[1440px]'>
            <h1 className="max-w-[791px] text-center text-[32px] font-normal leading-[41.6px]  md:text-[64px] md:leading-[73.6px]">
                MuseDAM, as an AI-native digital asset management platform, redefines enterprise digital asset management, helping leading global brands
            </h1>

            <div className='mt-[80px] flex w-full items-center justify-between rounded-[56px] bg-[#FF2EE7] px-[60px] py-[50px]'>
                <div className='flex-1 text-[54px] leading-[60px]'>
                    <span>Experience MuseDAM's AI-Native Platform. <span className='text-white'>Free demo, instant insights.</span></span>
                </div>
                <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                    <Button className='rounded-lg bg-white text-black'>
                        Schedule a demo
                    </Button>
                </Link>
            </div>
        </div>
    </div>
}
