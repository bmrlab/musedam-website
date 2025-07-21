'use client'

import Image from 'next/image'
import { useTranslation } from '@/app/i18n/client'
import Banner from '@/components/LandingPage/Hero/Banner'
import { BlackButton, DarkButton } from '@/components/StyleWrapper/button'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import { ssTranslation } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/utilities/cn'
import { LocaleLink } from '@/components/LocalLink'
import { useLanguage } from '@/providers/Language'
import usePublicUrl from '@/hooks/usePublicUrl'
import { useState } from 'react'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { useCountry } from '@/providers/Country'
import Link from 'next/link'

export default function Hero() {
    const { t } = useTranslation('landing-page')
    const { language } = useLanguage()
    const { isInChina } = useCountry()
    const isEn = language === 'en-US'
    const { getUrl } = usePublicUrl('/assets/Enterprise/WhyMuse/Cover')
    const [activeIndex, setActiveIndex] = useState(0)

    const businessMap = [{
        key: "growth",
        title: t('hero.enterprise.accordion.growth.title'),
        description: t('hero.enterprise.accordion.growth.desc'),
        lines: [
            { name: t('hero.enterprise.accordion.growth.line1.title'), info: t('hero.enterprise.accordion.growth.line1.desc') },
            { name: t('hero.enterprise.accordion.growth.line2.title'), info: t('hero.enterprise.accordion.growth.line2.desc') },
            { name: t('hero.enterprise.accordion.growth.line3.title'), info: t('hero.enterprise.accordion.growth.line3.desc') },
        ],
        result: <>{isEn && <span className="font-medium">300%</span>} {t('hero.enterprise.accordion.growth.result1')}, {isEn && <span className="font-medium">60%</span>} {t('hero.enterprise.accordion.growth.result2')}</>,
        Icon: 'Icon1.svg',
        Cover: 'img1.png'
    }, {
        key: "lifecycle",
        title: t('hero.enterprise.accordion.lifecycle.title'),
        description: t('hero.enterprise.accordion.lifecycle.desc'),
        lines: [
            { name: t('hero.enterprise.accordion.lifecycle.line1.title'), info: t('hero.enterprise.accordion.lifecycle.line1.desc') },
            { name: t('hero.enterprise.accordion.lifecycle.line2.title'), info: t('hero.enterprise.accordion.lifecycle.line2.desc') },
            { name: t('hero.enterprise.accordion.lifecycle.line3.title'), info: t('hero.enterprise.accordion.lifecycle.line3.desc') },
            { name: t('hero.enterprise.accordion.lifecycle.line4.title'), info: t('hero.enterprise.accordion.lifecycle.line4.desc') },
        ],
        result: <>{isEn && <span className="font-medium">90%</span>} {t('hero.enterprise.accordion.lifecycle.result1')}, {isEn && <span className="font-medium">80%</span>} {t('hero.enterprise.accordion.lifecycle.result2')}, <span className="font-medium">35%</span> {t('hero.enterprise.accordion.lifecycle.result3')}</>,
        Icon: 'Icon2.svg',
        Cover: 'img2.png'
    }, {
        key: "assets",
        title: t('hero.enterprise.accordion.assets.title'),
        description: t('hero.enterprise.accordion.assets.desc'),
        lines: [
            { name: t('hero.enterprise.accordion.assets.line1.title'), info: t('hero.enterprise.accordion.assets.line1.desc') },
            { name: t('hero.enterprise.accordion.assets.line2.title'), info: t('hero.enterprise.accordion.assets.line2.desc') },
            { name: t('hero.enterprise.accordion.assets.line3.title'), info: t('hero.enterprise.accordion.assets.line3.desc') },
            { name: t('hero.enterprise.accordion.assets.line4.title'), info: t('hero.enterprise.accordion.assets.line4.desc') },
        ],
        result: <>{isEn && <span className="font-medium">85%</span>} {t('hero.enterprise.accordion.assets.result1')}, {isEn && <span className="font-medium">100%</span>} {t('hero.enterprise.accordion.assets.result2')}</>,
        Icon: 'Icon3.svg',
        Cover: 'img3.png'
    }
    ]
    return (
        <div className="flex flex-col items-center justify-center pb-[60px] md:pb-[120px] md:w-full md:px-[80px]">
            <h1 className={cn(
                "mt-[59px] px-6 text-center text-[40px] font-normal md:px-0 md:text-[72px] md:leading-[90px] mb-[10px]",
                isEn && 'font-feature'
            )}>
                {t('hero.enterprise.title')}
            </h1>
            <span className={cn(
                'w-[800px] max-w-full px-6 text-center md:text-[40px] text-[rgba(255,255,255,0.72)] font-light',
                isEn ? 'font-feature text-[20px] md:font-normal' : 'font-extralight text-[16px]'
            )}>{t('hero.enterprise.subtitle')}</span>

            {/* 按钮 */}
            <div className='flex flex-col md:flex-row gap-5 items-center mb-12 md:mb-[60px] mt-10 font-euclid'>

                {
                    isInChina ? <><LocaleLink href={'/pricing'} prefetch={false}>
                        <DarkButton className={
                            cn("h-[48px] w-[240px] md:w-[180px] rounded-lg  text-base font-medium",
                                isEn && 'md:text-[18px]'
                            )}>
                            {t("hero.enterprise.seePricing")}
                        </DarkButton>
                    </LocaleLink>
                        <LocaleLink href={'/bookDemo'} prefetch={false}>
                            <Button className={cn("h-[48px] w-[240px] md:w-[180px] rounded-lg bg-white text-base font-medium text-[#0e0e0e]",
                                "transition-all duration-300 ease-in-out hover:bg-white/80 hover:text-[#0E0E0E]",
                                isEn && 'md:text-[18px]'
                            )}>
                                {t('hero.enterprise.contactUs')}
                            </Button>
                        </LocaleLink></> : <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                        <Button className={cn("h-[48px] w-[240px] md:w-[180px] rounded-lg bg-white  text-base font-medium text-[#0e0e0e]",
                            "transition-all duration-300 ease-in-out hover:bg-white/80 hover:text-[#0E0E0E]",
                            isEn && 'md:text-[18px]'
                        )}>
                            {t('hero.enterprise.contactUs')}
                        </Button>
                    </Link>
                }

            </div>
            <Banner isDark />
            <FadeInUpContainer className="mt-10 flex w-full flex-col items-center gap-6 md:mt-[80px] md:flex-row md:justify-between md:gap-0">
                <div className="flex max-w-[750px] flex-col items-center gap-3 px-6 md:items-start">
                    <h1 className={cn(
                        "text-center font-normal md:text-left md:text-[64px] md:leading-[73.6px]",
                        isEn ? 'font-feature text-[40px]' : 'text-[38px]'
                    )}>
                        {t('hero.enterprise.why.title')}
                    </h1>
                    <p className="text-center md:font-euclid font-euclidlight text-base font-light text-[rgba(255,255,255,0.72)] md:text-left md:text-[22px] leading-[1.45em]">
                        {t('hero.enterprise.why.desc')}
                    </p>
                </div>
                {isInChina ? <LocaleLink href={'/bookDemo'} prefetch={false}>
                    <DarkButton className={cn(
                        "md:h-[56px] h-[48px] font-medium w-[240px] md:w-[167px] rounded-lg font-euclid text-base",
                        isEn && "md:text-[18px]"
                    )}>
                        {t('hero.enterprise.button')}
                    </DarkButton>
                </LocaleLink> :
                    <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                        <DarkButton className={cn(
                            "md:h-[56px] h-[48px] font-medium w-[240px] md:w-[167px] rounded-lg font-euclid text-base",
                            isEn && "md:text-[18px]"
                        )}>
                            {t('hero.button.start')}
                        </DarkButton>
                    </Link>}

            </FadeInUpContainer>
            <div className="mt-12 flex h-auto w-full flex-col gap-4 rounded-[6px] px-5 md:mt-[80px] md:flex-row  md:px-0">
                <div className='left-content flex w-[540px] max-w-full items-center justify-center'>
                    <Accordion type="single" defaultValue="growth" collapsible={false} className="flex w-full flex-col gap-6">
                        {businessMap.map((item, index) => {
                            return <AccordionItem value={item.key} className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#141414] p-0 font-euclid hover:bg-[#1E1E1E] transition-all ease-in-out duration-300" key={item.key} onClick={() => {
                                setActiveIndex(index)
                            }}>
                                <AccordionTrigger className="p-0 hover:no-underline" icon-hidden>
                                    <div className="flex items-center gap-4 md:p-6 p-5 pb-4">
                                        <Image src={`/assets/Enterprise/AiNatives/${item.Icon}`} alt={item.Icon} className='size-[56px]' width={56} height={56} />
                                        <span className="text-left font-euclid text-[18px] md:text-[22px] font-medium text-white">{item.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Card className="ml-5 border-none bg-transparent shadow-none md:ml-[96px]">
                                        <CardContent className="space-y-4 md:space-y-3 p-0 md:pb-6 pr-6 font-euclid text-[16px] md:text-[15px] text-[rgba(255,255,255,0.48)]">
                                            <span className={isEn ? '' : 'font-light'}>{item.description}</span>
                                            <ul className="list-disc space-y-3 pl-5 leading-[22.5px]">
                                                {item.lines.map(({ name, info }, i) => {
                                                    return <li key={`item${index}-lines${i}`}>
                                                        <span className='font-medium text-[rgba(255,255,255,0.72)]'>{name}</span>
                                                        <span className={isEn ? '' : 'font-light'}>{info}</span></li>
                                                })}
                                            </ul>
                                            <div className='my-5 h-px w-full bg-[rgba(255,255,255,0.05)]' />
                                            <div className="pt-4 text-[15px]">
                                                <span className='font-medium text-[rgba(255,255,255,0.72)]'>{t('hero.enterprise.accordion.result')}</span>
                                                <span className={isEn ? '' : 'font-light'}>{item.result}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        })}
                    </Accordion>
                </div>
                <div className='flex flex-1 shrink-0 items-center justify-center rounded-[20px] md:rounded-[28px] border border-[rgba(255,255,255,0.1)] bg-[#141414] md:p-[30px] p-4'>
                    <div className='flex size-full items-center rounded-xl md:rounded-2xl bg-[#070707] shadow-[0px_2px_12px_0px_#FFFFFF12]'>
                        <Image
                            src={getUrl(businessMap[activeIndex].Cover)}
                            width={1328}
                            height={1000}
                            priority
                            alt={businessMap[activeIndex].Cover}
                            className='size-full object-contain'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
