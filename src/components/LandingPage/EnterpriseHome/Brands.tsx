'use client'
import { useTranslation } from '@/app/i18n/client'
import { useRef, useEffect } from 'react'

import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import Image from 'next/image'
import { LocaleLink } from '@/components/LocalLink'
import { HoverTranslateXArrowRight } from '@/components/StyleWrapper/icon'
import usePublicUrl from '@/hooks/usePublicUrl'
import { useLanguage } from '@/providers/Language'
import { cn } from '@/utilities/cn'

export type AINativeCard = {
    key: string
    image: string
}

export default function Brands() {
    const { t } = useTranslation('brands')
    const { getUrl } = usePublicUrl('/assets/Enterprise/Brands')
    const { language } = useLanguage()
    const isEn = language === 'en-US'
    const row1Ref = useRef<HTMLDivElement>(null)
    const row2Ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = row1Ref.current
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

    useEffect(() => {
        const container = row2Ref.current
        if (!container) return
        let speed = 1 // 滚动速度
        let animationFrame: number
        function scroll() {
            if (!container) return
            const singleListWidth = container.scrollWidth / 2
            if (container.scrollLeft <= 0) {
                container.scrollLeft = singleListWidth
            } else {
                container.scrollLeft -= speed
            }
            animationFrame = requestAnimationFrame(scroll)
        }
        if (container) container.scrollLeft = container.scrollWidth / 2
        const timer = setTimeout(() => {
            animationFrame = requestAnimationFrame(scroll)
        }, 500)
        return () => {
            clearTimeout(timer)
            cancelAnimationFrame(animationFrame)
        }
    }, [])

    const row1 = ['brand1.jpeg', 'brand2.jpeg', 'brand3.jpeg', 'brand4.jpeg']
    const row2 = ['brand5.jpeg', 'brand6.jpeg', 'brand7.jpeg', 'brand8.jpeg']

    return <div className='flex w-full flex-col items-center overflow-hidden'>
        <div className='w-full px-5 py-0 md:max-w-[1440px] md:px-[80px] md:py-[60px] md:pb-[120px]'>
            <FadeInUpContainer className="mt-[30px] flex w-full flex-col items-center gap-10 md:mt-[80px] md:flex-row md:justify-between md:gap-0 ">
                <div className={cn("flex flex-col items-center gap-6 px-6 md:items-start md:gap-10", language === 'en-US' && 'md:max-w-[800px]')}>
                    <h1 className={
                        cn(
                            "text-center font-feature  font-normal leading-[41.6px]  md:text-left md:text-[64px] md:leading-[73.6px]",
                            isEn ? "text-[32px]" : "text-[40px]"
                        )
                    }>
                        {t('section.title')}
                    </h1>
                </div>
                <LocaleLink
                    href="/features"
                    className="group flex items-center gap-2 font-euclid text-[18px] tracking-[2%] text-white"
                >
                    <span className="underline-animation">{t('link.text')}</span>
                    <HoverTranslateXArrowRight />
                </LocaleLink>
            </FadeInUpContainer>
        </div>

        <div className='w-full md:mb-[120px] md:mt-[60px] mt-10 mb-[60px]'>
            <div
                ref={row1Ref}
                className='no-scrollbar flex min-w-[600px] md:min-w-[1200px] flex-nowrap gap-10 overflow-x-scroll'
                style={{ scrollBehavior: 'auto' }}
            >
                {[...row1, ...row1, ...row1].map((key, idx) =>
                    <Image src={getUrl(key)} key={key + '-' + idx} alt={key} className='h-auto w-[200px] shrink-0 object-cover md:h-[257px] md:w-[450px]' width={450} height={250} />
                )}
            </div>
            <div
                ref={row2Ref}
                className='no-scrollbar mt-10 flex min-w-[1200px] flex-nowrap gap-10 overflow-x-scroll'
                style={{ scrollBehavior: 'auto' }}
            >
                {[...row2, ...row2, ...row2].map((key, idx) =>
                    <Image src={getUrl(key)} key={key + '-' + idx} alt={key} className='h-auto w-[200px] shrink-0 object-cover  md:h-[257px] md:w-[450px]' width={900} height={500} />
                )}
            </div>
        </div>
    </div>
}
