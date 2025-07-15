'use client'
import { useTranslation } from '@/app/i18n/client'

import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import Link from 'next/link'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { DarkButton } from '@/components/StyleWrapper/button'
import Image from 'next/image'
import usePublicUrl from '@/hooks/usePublicUrl'
import { cn } from '@/utilities/cn'
import { useLanguage } from '@/providers/Language'
import { LocaleLink } from '@/components/LocalLink'

export type AINativeCard = {
    key: string
    title: string
    description: string
    image: string
}

export default function AINatives() {
    const { t } = useTranslation('ai-natives')
    const { getUrl } = usePublicUrl('/assets/Enterprise/AiNatives')
    const { language } = useLanguage()
    const isEn = language === 'en-US'
    const data: AINativeCard[] = [
        {
            key: 'collect',
            title: t('collect.title'),
            description: t('collect.description'),
            image: getUrl('1.png'),
        },
        {
            key: 'organize',
            title: t('organize.title'),
            description: t('organize.description'),
            image: getUrl('2.png'),
        },
        {
            key: 'collaborate',
            title: t('collaborate.title'),
            description: t('collaborate.description'),
            image: getUrl('3.png'),
        },
        {
            key: 'ai-generate',
            title: t('ai-generate.title'),
            description: t('ai-generate.description'),
            image: getUrl('4.png'),
        },
        {
            key: 'compliance',
            title: t('compliance.title'),
            description: t('compliance.description'),
            image: getUrl('5.png'),
        },
        {
            key: 'data-driven',
            title: t('data-driven.title'),
            description: t('data-driven.description'),
            image: getUrl('6.png'),
        },
    ]

    return <div className='flex w-full justify-center bg-white text-black'>
        <div className='w-full overflow-x-scroll md:max-w-[1440px] md:px-[80px] md:py-[60px] md:pb-[120px]'>
            <FadeInUpContainer className="mt-10 flex w-full flex-col items-center gap-4 md:mt-[80px] md:flex-row md:justify-between md:gap-0">
                <div className="flex max-w-[750px] flex-col items-center gap-3 px-6 md:items-start">
                    <h1 className={cn(
                        "text-center text-[32px] font-normal leading-[41.6px]  md:text-left md:text-[64px] md:leading-[73.6px]",
                        isEn && 'font-feature'
                    )}>
                        {t('section.title')}
                    </h1>
                    <p className="text-center text-[14px] font-light text-[rgba(20,20,20,0.72)] md:text-left md:text-[22px]">
                        {t('section.desc')}
                    </p>
                </div>

                <LocaleLink href={'/bookDemo'} prefetch={false}>
                    <DarkButton className="w-[167px] rounded-2xl font-euclid text-xl md:h-[56px]">
                        {t('button.book-demo')}
                    </DarkButton>
                </LocaleLink>
            </FadeInUpContainer>

            <div className='-mr-3 mt-[60px] grid grid-cols-1 gap-10 px-5 md:mt-[100px] md:grid-cols-3 md:px-0'>
                {data.map(({ key, title, description, image }) => <div key={key} className='overflow-hidden rounded-[30px] bg-[#F1F5F9]'>
                    <Image src={image} alt={key} className='aspect-[4/3] w-full rounded-[30px] object-cover' width={400} height={300} />
                    <div className='mx-5 mb-[10px] mt-[30px] text-[22px]'>{title}</div>
                    <div className='mx-5 mb-[30px] text-[18px] font-light text-[rgba(20,20,20,0.72)]'>{description}</div>
                </div>)}
            </div>
        </div>
    </div>
}
