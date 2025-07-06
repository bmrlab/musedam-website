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
                {'Muse AI-Native DAM '}
            </h1>
            <span className='w-[800px] max-w-full text-center text-[40px] text-[rgba(255,255,255,0.72)]'>for brands that drive growth, streamline content, and protect assets</span>
            <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
                <Button className="mb-12 mt-6 h-[48px] w-[151px] rounded-lg bg-white font-medium leading-[20px] text-[#0e0e0e] transition-all duration-300 ease-in-out hover:text-[rgba(0,0,0,0.6)] md:mb-[60px] md:mt-10">
                    Book a demo
                </Button>
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
            <div className="mt-12 flex h-auto w-full flex-col gap-4 rounded-[6px] px-5 md:mt-[80px] md:flex-row  md:px-0">
                <div className='left-content flex w-[540px] max-w-full items-center justify-center'>
                    <Accordion type="single" defaultValue="growth" collapsible={false} className="flex w-full flex-col gap-6">
                        {[{
                            key: "growth",
                            title: "Drive Business Growth",
                            description: "Transform static assets into growth engines",
                            lines: [
                                { name: 'AskMuse AI Engine:', info: ' Generate professional marketing copy in 3 minutes, eliminating content creation struggles' },
                                { name: 'Smart Content Insights:', info: ' AI analyzes high-performing content patterns to guide data-driven creative decisions' },
                                { name: 'Value Discovery:', info: ' Automatically uncover hidden commercial potential in dormant digital assets' },
                            ],
                            result: <><span className="font-medium">300%</span> faster content production, <span className="font-medium">60%</span> higher asset reuse rates</>,
                            Icon: 'icon1.png'
                        }, {
                            key: "lifecycle",
                            title: "Streamline Content Lifecycle",
                            description: "AI-native technology simplifies every stage from creation to archive",
                            lines: [
                                { name: 'Natural Language Search:', info: ' Simply say "find a red product background" and AI delivers instant results' },
                                { name: 'Auto-Classification:', info: ' Upload and instantly categorize content, scenes, and colors without manual effort' },
                                { name: 'Efficient Version Control:', info: ' One-click rollback—never lose important edits again' },
                                { name: 'Seamless Team Collaboration:', info: ' @mentions, comments, and permission settings make teamwork effortless' },
                            ],
                            result: <><span className="font-medium">90%</span> faster asset discovery, <span className="font-medium">80%</span> improved team efficiency, <span className="font-medium">35%</span> shorter delivery cycles</>,
                            Icon: 'icon2.png'
                        }, {
                            key: "assets",
                            title: "Protect Digital Assets",
                            description: "Enterprise-grade security with intelligent controls ensure brand asset safety",
                            lines: [
                                { name: 'Granular Permission Control:', info: ' Three-tier access management across departments, projects, and individual files' },
                                { name: 'Smart Watermark Protection:', info: ' Dynamic visitor information display prevents unauthorized usage' },
                                { name: 'Complete Operation Logs:', info: ' 60+ core actions tracked for full asset usage transparency' },
                                { name: 'Secure Sharing:', info: ' Whitelist controls, expiration dates, and password protection for multi-layer security' },
                            ],
                            result: <><span className="font-medium">85%</span> reduced data breach risk, <span className="font-medium">100%</span> operation traceability</>,
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
                                                <b>Results:</b> {item.result}
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
