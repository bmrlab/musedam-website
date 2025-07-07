'use client'

import { ReactNode, useMemo } from 'react'

import useIsMobile from '@/hooks/useIsMobile'
import { useHighlightTranslation, useTranslation } from '@/app/i18n/client'

import usePublicUrl from '@/hooks/usePublicUrl'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import Link from 'next/link'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { DarkButton } from '@/components/StyleWrapper/button'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { BarChartIcon, HomeIcon, ImageIcon, StarFilledIcon, TableIcon } from '@radix-ui/react-icons'

export type AINativeCard = {
    key: string
    title: string
    description: string
    icon: ReactNode
}

export default function WhyMuse() {
    const { t } = useTranslation('why-muse')
    const getUrl = (fileName: string) => `/assets/Enterprise/WhyMuse/${fileName}`

    const data: AINativeCard[] = [
        {
            key: 'collect',
            title: t('collect.title'),
            description: t('collect.description'),
            icon: <StarFilledIcon />,
        },
        {
            key: 'organize',
            title: t('organize.title'),
            description: t('organize.description'),
            icon: <HomeIcon />,
        },
        {
            key: 'collaborate',
            title: t('collaborate.title'),
            description: t('collaborate.description'),
            icon: <TableIcon />,
        },
        {
            key: 'ai-generate',
            title: t('ai-generate.title'),
            description: t('ai-generate.description'),
            icon: <ImageIcon />,
        },
        {
            key: 'compliance',
            title: t('compliance.title'),
            description: t('compliance.description'),
            icon: <TableIcon />,
        },
        {
            key: 'data-driven',
            title: t('data-driven.title'),
            description: t('data-driven.description'),
            icon: <BarChartIcon />,
        }
    ]

    return <div className='p-5 md:px-[80px] md:py-[60px] md:pb-[120px]'>
        <div className='flex w-full flex-col items-center overflow-x-scroll md:max-w-[1440px]'>
            <h1 className="w-[800px] max-w-full text-start text-[32px] font-normal leading-[41.6px] text-[rgba(255,255,255,0.72)]  md:text-[64px] md:leading-[73.6px]">
                {t('section.title')}
            </h1>

            <div className='mt-[80px] flex w-full flex-col items-center justify-between gap-2 rounded-[34px] bg-[#FF2EE7] p-5 md:flex-row md:rounded-[56px] md:px-[60px] md:py-[50px]'>
                <div className='flex-1 text-3xl md:max-w-[910px] md:text-[54px] md:leading-[60px]'>
                    <span className='text-black'>{t('banner.text.1')} <span className='text-white'>{t('banner.text.2')}</span></span>
                </div>
                <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                    <Button className='rounded-lg bg-white text-black'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5.67075C8 6.22692 7.55556 6.67186 7 6.67186C6.44444 6.67186 6 6.22692 6 5.67075V3.00111C6 2.44494 6.44444 2 7 2C7.55556 2 8 2.44494 8 3.00111V5.67075ZM17.7778 3.00111C17.7778 2.44494 17.3333 2 16.7778 2C16.2222 2 15.7778 2.44494 15.7778 3.00111V5.67075C15.7778 6.22692 16.2222 6.67186 16.7778 6.67186C17.3333 6.67186 17.7778 6.22692 17.7778 5.67075V3.00111ZM22 5.53726V20.9099C22 21.5106 21.5111 22 20.8889 22H3.11111C2.48889 22 2 21.5106 2 20.9099V5.53726C2 4.9366 2.48889 4.44716 3.11111 4.44716H5.33333V5.67075C5.33333 6.62736 6.04444 7.38376 7 7.38376C7.95556 7.38376 8.66667 6.60512 8.66667 5.67075V4.44716H15.1111V5.67075C15.1111 6.62736 15.8222 7.38376 16.7778 7.38376C17.7333 7.38376 18.4444 6.60512 18.4444 5.67075V4.44716H20.8667C21.4667 4.44716 22 4.9366 22 5.53726ZM20.2222 9.54171C20.2222 9.31924 20.0222 9.11902 19.7778 9.11902H4.22222C3.97778 9.11902 3.77778 9.297 3.77778 9.54171V19.8198C3.77778 20.0423 3.97778 20.2425 4.22222 20.2425H19.7778C20.0222 20.2425 20.2222 20.0645 20.2222 19.8198V9.54171Z" fill="#5B616D" />
                        </svg>
                        {t('button.schedule-demo')}
                    </Button>
                </Link>
            </div>
        </div>

        <div className='mt-20 flex flex-col gap-4 md:flex-row'>
            <div className='flex w-full flex-col justify-between rounded-[28px] border border-[rgba(255,255,255,0.1)] bg-[#141414] p-5 md:flex-1'>
                <div className='flex flex-col gap-2'>
                    <span className='text-6 max-w-full overflow-hidden text-ellipsis text-nowrap font-medium'>
                        {t('why.title')}
                    </span>
                    <span className='text-4 max-w-full overflow-hidden text-ellipsis text-nowrap font-light text-[rgba(255,255,255,0.72)]'>
                        {t('why.subtitle')}
                    </span>
                </div>
                <div className='no-scrollbar flex h-1/2 w-full gap-[10px] overflow-scroll rounded-[18px] bg-[#070707] p-[25px] shadow-[0px_2px_12px_0px_#FFFFFF12]'>
                    {[getUrl('Top-Lists-1.png'), getUrl('Top-Lists-2.png'), getUrl('Top-Lists-3.png')].map((v) => {
                        return <Image src={v} width={200} height={100} alt={v} className="aspect-[2/1] h-full rounded-[8px] object-cover" key={v} />
                    })}
                </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:w-[696px] md:grid-cols-2'>
                {data.map(({ key, title, description, icon }) => {
                    return <div key={key} className='flex gap-[18px] rounded-[28px] border border-[rgba(255,255,255,0.1)] bg-[#141414] p-5'>
                        <div className='flex size-[56px] items-center justify-center rounded-[14px] bg-[#202020]'>
                            {icon}
                        </div>
                        <div className='flex flex-col justify-between'>
                            <span className='text-6 max-w-full overflow-hidden text-ellipsis text-nowrap font-medium'>
                                {title}
                            </span>
                            <span className='text-4 max-w-full overflow-hidden text-ellipsis text-nowrap font-light text-[rgba(255,255,255,0.72)]'>
                                {description}
                            </span>
                        </div>
                    </div>
                })}
            </div>

        </div>
    </div>
}
