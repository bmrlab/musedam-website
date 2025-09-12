'use client'

import { ReactNode } from 'react'
import { useTranslation } from '@/app/i18n/client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { BarChartIcon, HomeIcon, ImageIcon, StarFilledIcon, TableIcon } from '@radix-ui/react-icons'
import { LocaleLink } from '@/components/LocalLink'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/providers/Language'
import { cn } from '@/utilities/cn'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { useCountry } from '@/providers/Country'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import Link from 'next/link'

export type AINativeCard = {
    key: string
    title: string
    description: string
    icon: string
}

export default function WhyMuse() {
    const { t } = useTranslation('why-muse')
    const getUrl = (fileName: string) => `/assets/Enterprise/WhyMuse/${fileName}`
    const { language } = useLanguage()
    const { isInChina } = useCountry()
    const isEn = language === 'en-US'
    const data: AINativeCard[] = [
        {
            key: 'collect',
            title: t('collect.title'),
            description: t('collect.description'),
            icon: 'Icon-Star.svg',
        },
        {
            key: 'organize',
            title: t('organize.title'),
            description: t('organize.description'),
            icon: 'Icon-Clients.svg',
        },
        {
            key: 'collaborate',
            title: t('collaborate.title'),
            description: t('collaborate.description'),
            icon: 'Icon-data.svg',
        },
        {
            key: 'ai-generate',
            title: t('ai-generate.title'),
            description: t('ai-generate.description'),
            icon: 'Icon-Images.svg',
        },
        {
            key: 'compliance',
            title: t('compliance.title'),
            description: t('compliance.description'),
            icon: 'Icon-Dots.svg',
        },
        {
            key: 'data-driven',
            title: t('data-driven.title'),
            description: t('data-driven.description'),
            icon: 'Icon-Cube.svg',
        }
    ]

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = scrollRef.current
        if (!container) return
        let speed = 1 // 滚动速度
        let animationFrame: number
        function scroll() {
            if (!container) return
            const singleListWidth = container.scrollWidth / 2
            if (container.scrollLeft >= singleListWidth) {
                container.scrollLeft = 0
            } else {
                container.scrollLeft += speed
            }
            animationFrame = requestAnimationFrame(scroll)
        }
        const timer = setTimeout(() => {
            animationFrame = requestAnimationFrame(scroll)
        }, 500)
        return () => {
            clearTimeout(timer)
            cancelAnimationFrame(animationFrame)
        }
    }, [])

    const images = Array.from({ length: 6 }).map((_, i) => `Top-Lists-${i + 1}.png`)
    return <div className='px-6 py-[60px] md:px-[80px] md:py-[120px]'>
        <FadeInUpContainer className='flex w-full flex-col items-center overflow-x-scroll md:max-w-[1440px]'>
            <h1 className={cn(
                "w-[800px] max-w-full text-center md:text-start font-feature font-normal leading-[41.6px] text-white-72  md:text-[64px] md:leading-[1.45em]",
                isEn ? 'text-[30px] ' : 'text-[35px]'
            )}>
                {t('section.title')}
            </h1>

            <div className='mt-10 flex w-full flex-col items-center justify-between gap-10 rounded-2xl bg-[#FF2EE7] p-5 md:mt-[80px] md:flex-row md:gap-2 md:rounded-[56px] md:px-[60px] md:py-[50px]'>
                <div className={cn(
                    'flex-1 font-feature md:max-w-[910px] md:text-[54px] md:leading-[1.25em]',
                    isEn ? 'text-[40px] ' : 'text-[36px]'
                )}>
                    <span className='text-black'>{t('banner.text.1')}</span>{' '}
                    {!isEn && <br />}
                    <span className='text-white/80'>{t('banner.text.2')}</span>
                </div>
                <LocaleLink href='/book-demo' prefetch={false} className='w-full md:w-fit'>
                    <Button className={cn(
                        'h-[48px] w-full gap-[6px] rounded-lg bg-white px-0 font-euclid text-base text-black hover:bg-white/80 md:h-[56px] md:w-[226px]',
                        isEn && "md:text-[18px]"
                    )}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='!size-6'>
                            <path d="M8 5.67075C8 6.22692 7.55556 6.67186 7 6.67186C6.44444 6.67186 6 6.22692 6 5.67075V3.00111C6 2.44494 6.44444 2 7 2C7.55556 2 8 2.44494 8 3.00111V5.67075ZM17.7778 3.00111C17.7778 2.44494 17.3333 2 16.7778 2C16.2222 2 15.7778 2.44494 15.7778 3.00111V5.67075C15.7778 6.22692 16.2222 6.67186 16.7778 6.67186C17.3333 6.67186 17.7778 6.22692 17.7778 5.67075V3.00111ZM22 5.53726V20.9099C22 21.5106 21.5111 22 20.8889 22H3.11111C2.48889 22 2 21.5106 2 20.9099V5.53726C2 4.9366 2.48889 4.44716 3.11111 4.44716H5.33333V5.67075C5.33333 6.62736 6.04444 7.38376 7 7.38376C7.95556 7.38376 8.66667 6.60512 8.66667 5.67075V4.44716H15.1111V5.67075C15.1111 6.62736 15.8222 7.38376 16.7778 7.38376C17.7333 7.38376 18.4444 6.60512 18.4444 5.67075V4.44716H20.8667C21.4667 4.44716 22 4.9366 22 5.53726ZM20.2222 9.54171C20.2222 9.31924 20.0222 9.11902 19.7778 9.11902H4.22222C3.97778 9.11902 3.77778 9.297 3.77778 9.54171V19.8198C3.77778 20.0423 3.97778 20.2425 4.22222 20.2425H19.7778C20.0222 20.2425 20.2222 20.0645 20.2222 19.8198V9.54171Z" fill="#5B616D" />
                        </svg>
                        {t('button.schedule-demo')}
                    </Button>
                </LocaleLink>
            </div>
        </FadeInUpContainer>

        <div className='mt-10 flex flex-col gap-4 md:mt-20 md:flex-row'>
            <div className='flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#141414] p-5 md:flex-1 md:rounded-[28px]'>
                <div className='mb-12 flex flex-col gap-2 font-euclid md:mb-0'>
                    <span className='max-w-full overflow-hidden text-ellipsis text-nowrap text-[24px] font-medium'>
                        {t('why.title')}
                    </span>
                    <span className='text-4 max-w-full overflow-hidden text-ellipsis text-nowrap font-euclidlight font-light text-white-72'>
                        {t('why.subtitle')}
                    </span>
                </div>
                <div
                    ref={scrollRef}
                    className='no-scrollbar flex h-[150px] flex-nowrap gap-[10px] overflow-x-scroll rounded-[18px] bg-[#070707] p-[25px] shadow-[0px_2px_12px_0px_#FFFFFF12]'
                    style={{ scrollBehavior: 'auto' }}
                >
                    {[...images, ...images].map((imgPath, index) => {
                        return <Image src={getUrl(imgPath)} width={400} height={200} alt={imgPath} className="aspect-[200px] h-[100px] rounded-[8px] object-cover" key={imgPath + '-' + index} />
                    })}
                </div>
            </div>
            <div className='grid grid-cols-1 gap-4 font-euclid md:w-[696px] md:grid-cols-2 '>
                {data.map(({ key, title, description, icon }) => {
                    return <div key={key} className='flex gap-[18px] rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#141414] p-5 md:rounded-[28px]'>
                        <div className='flex size-[56px] items-center justify-center rounded-[14px] bg-[#202020]'>
                            <Image src={getUrl(icon)} alt={icon} className='size-6 object-contain' width={56} height={56} />
                        </div>
                        <div className='flex flex-col justify-between'>
                            <span className='max-w-full overflow-hidden text-ellipsis text-nowrap text-[24px] font-medium'>
                                {title}
                            </span>
                            <span className='max-w-full overflow-hidden text-ellipsis text-nowrap font-euclidlight text-[15px] md:text-[16px] font-light text-white-72'>
                                {description}
                            </span>
                        </div>
                    </div>
                })}
            </div>

        </div>
    </div>
}
