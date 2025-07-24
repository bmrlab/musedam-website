'use client'

import { useCallback, useState } from 'react'
import {
    MUSE_GLOBAL_AUTH_URL,
    MUSE_MAINLAND_AUTH_URL,
    MUSEDAM_LOGIN_URL,
} from '@/constant/url'
import { useCountry } from '@/providers/Country'
import { cn } from '@/utilities/cn'
import { CheckIcon } from '@radix-ui/react-icons'

import { SessionUser } from '@/types/user'
import { FlexColContainer, FlexRowContainer } from '@/components/StyleWrapper/Container'
import { useTranslation } from '@/app/i18n/client'

import { Button } from '../../ui/button'
import { useBillingMenu } from '../billingMenu'
import ContactUsDialog from '../ContactUsDialog'
import { PlanType } from '../types/plan'
import { LocaleLink } from '@/components/LocalLink'
import { useLanguage } from '@/providers/Language'

export default function Buy({
    isMuseAI,
    user,
}: {
    isMuseAI?: boolean
    user: SessionUser | null
}) {

    const { enterpriseBillingMenu } = useBillingMenu({ isMuseAI: false }) // 在组件内
    const currentPlan = PlanType.team
    const { country, isInChina } = useCountry()
    const { language } = useLanguage()
    const isEn = language === 'en-US'
    const { t } = useTranslation('pricing')
    const [open, setOpen] = useState(false)

    const getPriceRender = useCallback(
        (price?: string) => {
            if (price) {
                if (
                    isInChina
                ) {
                    return <>
                        {t('pricing.from')} <span className='font-medium'>¥</span><span className='text-[40px] font-medium font-euclid'>{price}</span> {t('pricing.perMonth.new')}
                    </>
                }
                return <>
                    {t('pricing.from')} <span className='font-medium'>$</span><span className='text-[40px] font-medium font-euclid'>{price}</span> {t('pricing.perMonth.new')}
                </>
            } else {
                return <span className='text-[32px] font-medium font-euclid'>{t('pricing.contact.sales')}</span>
            }
        },
        [isInChina, currentPlan, t],
    )
    const backgroundLinear = [
        'linear-gradient(180deg, #1A1529 -3.95%, #491DBA 96.05%)',
        'linear-gradient(180deg, #261625 -3.95%, #9A0E83 96.05%)',
        'linear-gradient(180deg, #1A1D0E -3.95%, #DCFF58 96.05%)'
    ]

    return (
        <>
            <FlexColContainer className="w-full items-center pb-[120px] pt-5 font-euclid md:pt-[60px]">
                <FlexRowContainer className="w-full justify-between px-5 md:px-[80px] mb-10 md:mb-[60px] ">
                    <h1 className='w-full text-center text-[40px] leading-[51px] md:text-[78px] md:leading-[87px] text-white font-feature'>{t('pricing.title.new')}</h1>
                </FlexRowContainer>

                {/* Pricing Cards */}
                <div className="w-full overflow-x-scroll px-5 md:px-[80px] no-scrollbar">
                    <div className='flex md:flex-row flex-col w-fit min-w-full items-end justify-center md:gap-10 gap-[30px]'>
                        {enterpriseBillingMenu.map((plan, index) => {
                            const {
                                key,
                                buttonType,
                                summary,
                                // uncheckSummary,
                            } = plan;
                            const renderPrice = getPriceRender(isInChina ? plan.price : plan.priceGlobal)
                            return <div key={key} className="relative h-fit w-full max-w-sm flex-1 shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] px-6 pb-6 pt-[30px]"> {/* Add relative positioning and hide overflow */}
                                {/* Tag */}
                                <div className=' border border-white/10 rounded-[10px]  overflow-hidden w-fit h-[36px] mb-3'>
                                    <div
                                        className=" w-fit rounded-[10px] px-[10px] text-base font-medium h-full flex items-center"
                                        style={{
                                            background: backgroundLinear[index], // Yellow-green gradient from design
                                            color: plan.color
                                        }}

                                    >
                                        {plan.title} {/* Use the plan title for the tag text */}
                                    </div>
                                </div>
                                <div className="text-base font-euclid text-[rgba(255,255,255,0.48)]">{plan.description}</div> {/* Adjust text size/style */}
                                <div className='mt-[22px] flex items-center gap-1 font-euclidlight text-xs min-h-[32px] text-white'>
                                    {renderPrice}
                                </div>
                                <div className='h-[48px] w-full' />

                                {buttonType === 'bookDemo' &&
                                    <LocaleLink href={'/bookDemo'} prefetch={false}>
                                        <Button
                                            className={cn(
                                                'border border-[rgba(255,255,255,0.48)]',
                                                'mb-4 h-[48px] rounded-xl w-full border-white/10 bg-[#FF2EE7]  text-white',
                                                'transition-all duration-300 ease-in-out hover:bg-[rgba(255,46,231,0.8)]',
                                                // 阴影样式
                                                'shadow-[0_0_8px_-2px_rgba(255,255,255,0.48),0_0_6px_0_rgba(255,255,255,0.16),0_0_8px_-2px_rgba(255,255,255,0.48)_inset]',
                                                isEn ? 'text-lg' : ' text-base'
                                            )}
                                        >
                                            {t('pricing.bookDemo')}
                                        </Button>
                                    </LocaleLink>
                                }

                                {buttonType === 'bookDemo' || buttonType === 'contact' ?
                                    <LocaleLink href={'/bookDemo'} prefetch={false}>
                                        <Button className={
                                            cn(
                                                "h-[48px] bg-[#141414] w-full rounded-xl border border-white/10 text-lg text-[rgba(255,255,255,0.72)]",
                                                "transition-all duration-300 ease-in-out hover:bg-[#262626] hover:text-white",
                                                isEn ? 'text-lg' : ' text-base'
                                            )}
                                        >
                                            {t('pricing.contact.now')}
                                        </Button>
                                    </LocaleLink> :
                                    <Button
                                        className={
                                            cn(
                                                "h-[48px] bg-[#141414] w-full rounded-xl border border-white/10 text-lg text-[rgba(255,255,255,0.72)]",
                                                "transition-all duration-300 ease-in-out hover:bg-[#262626] hover:text-white",
                                                isEn ? 'text-lg' : ' text-base'
                                            )}
                                        onClick={() => {
                                            // 如果是已登录用户，且要体验团队（说明还没创建过），则进入团队onboarding流程
                                            if (!!user && currentPlan === PlanType.team && !user.hasOrg) {
                                                window.open(
                                                    `${country === 'global' ? MUSE_GLOBAL_AUTH_URL : MUSE_MAINLAND_AUTH_URL}/onboarding/team`,
                                                )
                                            } else {
                                                window.open(MUSEDAM_LOGIN_URL, '_blank')
                                            }
                                        }}
                                    >
                                        {!user || (!!user && currentPlan === PlanType.team && !user.hasOrg)
                                            ? t('pricing.plan.actions.try')
                                            : t('pricing.plan.button.buy')}
                                    </Button>}

                                <ul className="mt-[30px] space-y-3 text-[rgba(255,255,255,0.72)]">
                                    {summary
                                        .filter((v) => !!v)
                                        .map((feature) => (
                                            <li className="flex items-center gap-2 " key={feature}>
                                                <CheckIcon className="shrink-0 text-[#20C997]" width={16} height={16} />
                                                <span className="text-[13px] font-light leading-[18px] font-euclidlight">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    {/* {uncheckSummary?.map((feature) => (
                                    <li className="flex items-center gap-2 " key={feature}>
                                        <Cross2Icon className="shrink-0 text-[#FF3535]" width={16} height={16} />
                                        <span className="font-mono text-[13px] font-light leading-[18px]">
                                            {feature}
                                        </span>
                                    </li>
                                ))} */}
                                </ul>
                            </div>
                        })}
                    </div>
                </div>
            </FlexColContainer>

            <ContactUsDialog open={open} setOpen={setOpen} />
        </>
    )
}
