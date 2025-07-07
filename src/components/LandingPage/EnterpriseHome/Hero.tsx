import Link from 'next/link'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import Image from 'next/image'

import Banner from '@/components/LandingPage/Hero/Banner'
import { BlackButton, DarkButton } from '@/components/StyleWrapper/button'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import { ssTranslation } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default async function Hero({ lng }: { lng: string }) {
    const { t } = await ssTranslation(lng, 'landing-page')
    return (
        <div className="flex flex-col items-center justify-center pb-[120px] md:w-full md:px-[80px]">
            <h1 className="mt-[59px] px-6 text-center text-[32px] font-normal leading-[41.6px]  md:px-0 md:text-[72px] md:leading-[90px]">
                {t('hero.enterprise.title')}
            </h1>
            <span className='w-[800px] max-w-full text-center text-[40px] text-[rgba(255,255,255,0.72)]'>{t('hero.enterprise.subtitle')}</span>
            <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                <Button className="mb-12 mt-6 h-[48px] w-[151px] rounded-lg bg-white font-medium leading-[20px] text-[#0e0e0e] transition-all duration-300 ease-in-out hover:text-[rgba(0,0,0,0.6)] md:mb-[60px] md:mt-10">
                    {t('hero.enterprise.button')}
                </Button>
            </Link>
            <Banner isDark />
            <FadeInUpContainer className="mt-10 flex w-full flex-col items-center gap-4 md:mt-[80px] md:flex-row md:justify-between md:gap-0">
                <div className="flex max-w-[750px] flex-col items-center gap-6 px-6 md:items-start md:gap-10">
                    <h1 className="text-center text-[32px] font-normal leading-[41.6px]  md:text-left md:text-[64px] md:leading-[73.6px]">
                        {t('hero.enterprise.why.title')}
                    </h1>
                    <p className="text-center font-mono text-[14px] font-light text-[rgba(255,255,255,0.72)] md:text-left md:text-[22px]">
                        {t('hero.enterprise.why.desc')}
                    </p>
                </div>

                <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                    <DarkButton className="h-[56px] w-[143px] rounded-[8px]">
                        {t('hero.enterprise.button')}
                    </DarkButton>
                </Link>
            </FadeInUpContainer>
            <div className="mt-12 flex h-auto w-full flex-col gap-4 rounded-[6px] px-5 md:mt-[80px] md:flex-row  md:px-0">
                <div className='left-content flex w-[540px] max-w-full items-center justify-center'>
                    <Accordion type="single" defaultValue="growth" collapsible={false} className="flex w-full flex-col gap-6">
                        {[{
                            key: "growth",
                            title: t('hero.enterprise.accordion.growth.title'),
                            description: t('hero.enterprise.accordion.growth.desc'),
                            lines: [
                                { name: t('hero.enterprise.accordion.growth.line1.title'), info: t('hero.enterprise.accordion.growth.line1.desc') },
                                { name: t('hero.enterprise.accordion.growth.line2.title'), info: t('hero.enterprise.accordion.growth.line2.desc') },
                                { name: t('hero.enterprise.accordion.growth.line3.title'), info: t('hero.enterprise.accordion.growth.line3.desc') },
                            ],
                            result: <><span className="font-medium">300%</span> {t('hero.enterprise.accordion.growth.result1')}, <span className="font-medium">60%</span> {t('hero.enterprise.accordion.growth.result2')}</>,
                            Icon: 'icon1.png'
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
                            result: <><span className="font-medium">90%</span> {t('hero.enterprise.accordion.lifecycle.result1')}, <span className="font-medium">80%</span> {t('hero.enterprise.accordion.lifecycle.result2')}, <span className="font-medium">35%</span> {t('hero.enterprise.accordion.lifecycle.result3')}</>,
                            Icon: 'icon2.png'
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
                            result: <><span className="font-medium">85%</span> {t('hero.enterprise.accordion.assets.result1')}, <span className="font-medium">100%</span> {t('hero.enterprise.accordion.assets.result2')}</>,
                            Icon: 'icon3.png'
                        }
                        ].map((item, index) => {
                            return <AccordionItem value={item.key} className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#141414] p-0" key={item.key}>
                                <AccordionTrigger className="p-0" icon-hidden>
                                    <div className="flex items-center gap-4 p-6">
                                        <Image src={`/assets/Enterprise/AiNatives/${item.Icon}`} alt={item.Icon} className='size-9 rounded-[30px] object-cover md:size-[56px]' width={56} height={56} />
                                        <span className="text-left font-euclid text-[22px] font-medium text-white">{item.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Card className="ml-[76px] border-none bg-[#141414] shadow-none md:ml-[96px]">
                                        <CardContent className="space-y-3 p-0 pb-6 pr-6 text-[rgba(255,255,255,0.48)]">
                                            <span className="text-[16px] ">{item.description}</span>
                                            <ul className="list-disc space-y-3 pl-5 text-[15px] leading-[22.5px]">
                                                {item.lines.map(({ name, info }, i) => {
                                                    return <li key={`item${index}-lines${i}`}><b>{name}</b>{info}</li>
                                                })}
                                            </ul>
                                            <div className='my-5 h-px w-full bg-[rgba(255,255,255,0.05)]' />
                                            <div className=" pt-4 text-[15px]">
                                                <b>{t('hero.enterprise.accordion.result')}</b> {item.result}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        })}
                    </Accordion>
                </div>
                <div className='flex flex-1 shrink-0 items-center justify-center rounded-[28px] border border-[rgba(255,255,255,0.1)] bg-[#141414] p-[30px]'>
                    <Image
                        src="/assets/Enterprise/Multimodal_Asset_Library.png"
                        width={665}
                        height={588}
                        priority
                        alt="Multimodal_Asset_Library"
                        className='size-full object-contain'
                    />
                </div>
            </div>
        </div>
    )
}
