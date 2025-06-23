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

export type AINativeCard = {
    key: string
    title: string
    description: string
    image: string
}

export default function AINatives() {
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

    return <div className='flex w-full  justify-center bg-white text-black'>
        <div className='w-full overflow-x-scroll px-[80px] py-[60px] pb-[120px] md:max-w-[1440px]'>
            <FadeInUpContainer className="mt-10 flex w-full flex-col items-center gap-4 md:mt-[80px] md:flex-row md:justify-between md:gap-0">
                <div className="flex max-w-[750px] flex-col items-center gap-6 px-6 md:items-start md:gap-10">
                    <h1 className="text-center text-[32px] font-normal leading-[41.6px]  md:text-left md:text-[64px] md:leading-[73.6px]">
                        Six AI-Native Capabilities Powering Brand Growth
                    </h1>
                    <p className="text-center font-mono text-[14px] font-light text-[rgba(255,255,255,0.72)] md:text-left md:text-[22px]">
                        MuseDAM Enterprise enhances six core digital asset management capabilities through AI-native technology.
                    </p>
                </div>

                <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                    <DarkButton className="h-[56px] w-[143px] rounded-[8px]">
                        Book a demo
                    </DarkButton>
                </Link>
            </FadeInUpContainer>


            <div className='grid grid-cols-3 gap-10'>
                {data.map(({ key, title, description, image }) => <div key={key} className='overflow-hidden rounded-[30px] bg-[#F1F5F9]'>
                    <Image src={image} alt={key} className='aspect-[4/3] w-full rounded-[30px] object-cover' width={100} height={100} />
                    <div className='mx-5 mb-[10px] mt-[30px] text-[22px]'>{title}</div>
                    <div className='mx-5 mb-[30px] text-[18px] font-light'>{description}</div>
                </div>)}
            </div>
        </div>
    </div>
}
