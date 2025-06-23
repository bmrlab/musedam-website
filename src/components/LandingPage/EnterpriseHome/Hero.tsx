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
        <div className="flex flex-col items-center justify-center md:w-full md:px-[80px]">
            <h1 className="mt-[59px] px-6 text-center text-[32px] font-normal leading-[41.6px]  md:px-0 md:text-[72px] md:leading-[90px]">
                {'Muse AI-Native DAM '}
            </h1>
            <span className='w-[800px] max-w-full text-center text-[40px] text-[rgba(255,255,255,0.72)]'>for brands that drive growth, streamline content. and protect assets</span>
            <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                <button className="mb-12 mt-6 h-[48px] w-[151px] rounded-lg bg-white font-medium leading-[20px] text-[#0e0e0e] transition-all duration-300 ease-in-out hover:text-[rgba(0,0,0,0.6)] md:mb-[60px] md:mt-10">
                    Book a demo
                </button>
            </Link>
            <Banner />
            <FadeInUpContainer className="mt-10 flex w-full flex-col items-center gap-4 md:mt-[80px] md:flex-row md:justify-between md:gap-0">
                <div className="flex max-w-[750px] flex-col items-center gap-6 px-6 md:items-start md:gap-10">
                    <h1 className="text-center text-[32px] font-normal leading-[41.6px]  md:text-left md:text-[64px] md:leading-[73.6px]">
                        Why AI-Native Digital Asset Management?
                    </h1>
                    <p className="text-center font-mono text-[14px] font-light text-[rgba(255,255,255,0.72)] md:text-left md:text-[22px]">
                        MuseDAM leverages AI to revolutionize digital asset management, delivering three core values
                    </p>
                </div>

                <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                    <DarkButton className="h-[56px] w-[143px] rounded-[8px]">
                        Book a demo
                    </DarkButton>
                </Link>
            </FadeInUpContainer>
            <div className="mt-12 flex h-auto w-full gap-4 rounded-[6px] px-[5px] md:mt-[80px] md:px-0">
                <div className='left-content flex w-[540px] items-center justify-center'>
                    <Accordion type="single" defaultValue="growth" collapsible={false} className="flex w-full max-w-[480px] flex-col gap-6">
                        {[{
                            key: "growth",
                            title: "Drive Business Growth",
                            Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="4" width="8" height="8" rx="2" fill="white" />
                                <rect x="4" y="20" width="8" height="8" rx="2" fill="white" />
                                <rect x="20" y="4" width="8" height="8" rx="2" fill="white" />
                                <rect x="20" y="20" width="8" height="8" rx="2" fill="white" />
                            </svg>
                        }, {
                            key: "lifecycle",
                            title: "Streamline Content Lifecycle",
                            Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="12" fill="white" />
                                <rect x="14" y="8" width="4" height="16" rx="2" fill="#1B8A3A" />
                            </svg>
                        }, {
                            key: "assets",
                            title: "Protect Digital Assets",
                            Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="8" y="8" width="16" height="16" rx="8" fill="white" />
                                <rect x="14" y="14" width="4" height="4" rx="2" fill="#4B3AFF" />
                            </svg>
                        }
                        ].map((item, index) => {
                            return <AccordionItem value={item.key} className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#141414] p-0" key={item.key}>
                                <AccordionTrigger className="p-0" icon-hidden>
                                    <div className="flex items-center gap-4 p-6">
                                        <div className="flex size-[56px] items-center justify-center rounded-full">
                                            {item.Icon}
                                        </div>
                                        <span className="text-left font-euclid text-[22px] font-medium text-white">{item.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Card className="ml-[96px] border-none bg-[#141414] shadow-none">
                                        <CardContent className="space-y-3 p-0 pb-6 pr-6 text-[rgba(255,255,255,0.48)]">
                                            <span className="text-[16px] ">Transform static assets into growth engines</span>
                                            <ul className="list-disc space-y-3 pl-5 text-[15px] leading-[22.5px]">
                                                <li><b>AskMuse AI Engine:</b> Generate professional marketing copy in 3 minutes, eliminating content creation struggles</li>
                                                <li><b>Smart Content Insights:</b> AI analyzes high-performing content patterns to guide data-driven creative decisions</li>
                                                <li><b>Value Discovery:</b> Automatically uncover hidden commercial potential in dormant digital assets</li>
                                            </ul>
                                            <div className='my-5 h-px w-full bg-[rgba(255,255,255,0.05)]' />
                                            <div className=" pt-4 text-[15px]">
                                                <b>Results:</b> <span className="font-medium">300%</span> faster content production, <span className="font-medium">60%</span> higher asset reuse rates
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
                        src="/assets/Hero/MuseDAM-Asset-Car-V2.png"
                        width={725}
                        height={648}
                        priority
                        alt="MuseDAM-Asset-Car-V2"
                        className='size-full'
                    />
                </div>
            </div>
        </div>
    )
}
