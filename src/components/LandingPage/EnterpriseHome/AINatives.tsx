'use client'
import { useTranslation } from '@/app/i18n/client'

import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import { DarkButton } from '@/components/StyleWrapper/button'
import Image from 'next/image'
import usePublicUrl from '@/hooks/usePublicUrl'
import { cn } from '@/utilities/cn'
import { useLanguage } from '@/providers/Language'
import { LocaleLink } from '@/components/LocalLink'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { useCountry } from '@/providers/Country'
import Link from 'next/link'

export type AINativeCard = {
    key: string
    title: string
    description: string
    image: string
    color: string
}

export default function AINatives() {
    const { t } = useTranslation('ai-natives')
    const { getUrl } = usePublicUrl('/assets/Enterprise/AiNatives')
    const { language } = useLanguage()
    const { isInChina } = useCountry()
    const isEn = language === 'en-US'
    const data: AINativeCard[] = [
        {
            key: 'collect',
            title: t('collect.title'),
            description: t('collect.description'),
            image: getUrl('1.png'),
            color: '#04625D'
        },
        {
            key: 'organize',
            title: t('organize.title'),
            description: t('organize.description'),
            image: getUrl('2.png'),
            color: '#BFA3E7'
        },
        {
            key: 'collaborate',
            title: t('collaborate.title'),
            description: t('collaborate.description'),
            image: getUrl('3.png'),
            color: '#D1E6D1'
        },
        {
            key: 'ai-generate',
            title: t('ai-generate.title'),
            description: t('ai-generate.description'),
            image: getUrl('4.png'),
            color: '#6D83E6'
        },
        {
            key: 'compliance',
            title: t('compliance.title'),
            description: t('compliance.description'),
            image: getUrl('5.png'),
            color: '#803A2B'
        },
        {
            key: 'data-driven',
            title: t('data-driven.title'),
            description: t('data-driven.description'),
            image: getUrl('6.png'),
            color: '#084354'
        },
    ]

    return <div className='flex w-full justify-center bg-white text-black'>
        <div className='w-full overflow-x-scroll md:max-w-[1440px] md:px-[80px] md:py-[60px] md:pb-[120px]'>
            <FadeInUpContainer className="mt-10 flex w-full flex-col items-center gap-12 md:mt-[80px] md:flex-row md:justify-between md:gap-0">
                <div className="flex max-w-[770px] flex-col items-center gap-3 px-6 md:items-start">
                    <h1 className={cn(
                        "text-center font-feature text-[40px] font-normal md:text-left md:text-[64px] md:leading-[73.6px]",
                        isEn && 'font-feature'
                    )}>
                        {t('section.title')}
                    </h1>
                    <p className="text-center font-euclidlight text-base font-light text-[rgba(20,20,20,0.72)] md:text-left md:text-[22px]">
                        {t('section.desc')}
                    </p>
                </div>
                <LocaleLink href={`/book-demo?from=home-ai-natives-btn`} prefetch={false}>
                    <DarkButton className={cn("h-[48px] w-[240px] rounded-lg font-euclid text-base font-medium md:h-[56px] md:w-[167px]",
                        isEn && 'md:text-[18px]'
                    )}>
                        {t('button.book-demo')}
                    </DarkButton>
                </LocaleLink>

            </FadeInUpContainer>

            <div className='my-[60px] grid grid-cols-1 gap-6 px-5 font-euclid md:-mr-3 md:mb-0 md:mt-[100px] md:grid-cols-3 md:gap-10 md:px-0'>
                {data.map(({ key, title, description, image, color }) =>
                    <div key={key} className='group overflow-hidden rounded-[30px] bg-[#F1F5F9] transition-transform duration-300 ease-in-out md:hover:-translate-y-2'>
                        <div className='aspect-[4/3] w-full rounded-[30px] object-cover' style={{
                            backgroundColor: color
                        }}>
                            <Image src={image} alt={key} className='aspect-[4/3] w-full rounded-[30px] object-cover' width={800} height={600} />
                        </div>
                        <div className={cn('mx-4 mb-[10px] mt-6 md:mx-5 md:mt-[30px] md:text-[22px]',
                            isEn ? 'text-[18px]' : 'text-[20px]'
                        )}>{title}</div>
                        <div className='mx-4 mb-6 font-euclidlight text-[15px] font-light text-[rgba(20,20,20,0.72)] md:mx-5 md:mb-[30px] md:text-[18px]'>{description}</div>
                    </div>
                )}
            </div>
        </div>
    </div>
}
