'use client'

import { use, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    MUSE_CONTACT_EMAIL,
    MUSE_GLOBAL_AUTH_URL,
    MUSE_GLOBAL_CHECKOUT_URL,
    MUSE_MAINLAND_AUTH_URL,
    MUSE_MAINLAND_CHECKOUT_URL,
    MUSEDAM_LOGIN_URL,
} from '@/constant/url'
import { ProductItem } from '@/endpoints/pricing'
import { useCountry } from '@/providers/Country'
import { cn } from '@/utilities/cn'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import * as RadioGroup from '@radix-ui/react-radio-group'

import { SessionUser } from '@/types/user'
import { FlexColContainer, FlexRowContainer } from '@/components/StyleWrapper/Container'
import { useTranslation } from '@/app/i18n/client'

import { Button } from '../../ui/button'
import { useBillingMenu } from '../billingMenu'
import ContactUsDialog from '../ContactUsDialog'
import { BillingType, PlanType } from '../types/plan'
import { EMuseProductType } from '../types/products'

export default function Buy({
    isMuseAI,
    user,
    pricingData: pricingDataPromise,
}: {
    isMuseAI?: boolean
    user: SessionUser | null
    pricingData: Promise<[EMuseProductType, ProductItem][]>
}) {
    const pricingData = use(pricingDataPromise)

    const { enterpriseBillingMenu } = useBillingMenu({ isMuseAI: false }) // 在组件内
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPlan = PlanType.team
    const { country, isInChina } = useCountry()
    // const [pricingData, setPricingData] = useState<[EMuseProductType, ProductItem][]>(cache)

    // 后端限制的两个值，注意大小写
    const source = useMemo(() => (isMuseAI ? 'museAI' : 'museDAM'), [isMuseAI])

    const pricingMap = useMemo(() => {
        if (!pricingData || !Array.isArray(pricingData)) return new Map()

        return new Map(pricingData)
    }, [pricingData])

    const updatePlan = (newPlan: PlanType) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('plan', newPlan)
        router.push(`?${params.toString()}`)
    }
    const { t } = useTranslation('pricing')
    const [open, setOpen] = useState(false)

    // console.log('pricingMap', pricingMap)
    const tabs = [
        {
            type: PlanType.personal,
            label: t('pricing.plan.tab.personal'),
        },
        {
            type: PlanType.team,
            label: t('pricing.plan.tab.team'),
        },
    ]
    const billingTypes = [
        {
            type: BillingType.monthly,
            label: t('pricing.plan.pay-by.month'),
        },
        {
            type: BillingType.yearly,
            label: t('pricing.plan.pay-by.year'),
        },
    ]
    const [currentBillingType, setCurrentBillingType] = useState<BillingType>(BillingType.yearly)

    const getPriceRender = useCallback(
        (price: string | EMuseProductType) => {
            // TODO 新套餐？？
            if (pricingMap && typeof price !== 'string') {
                let productInfo = pricingMap.get(price)
                let res = productInfo?.price
                // if (!res) return '-'
                if (
                    (isInChina && currentPlan === PlanType.team) ||
                    (!isInChina && currentBillingType === BillingType.yearly)
                ) {
                    res = res / 12
                }
                return <>
                    FROM <span className='font-medium'>$</span><span className='text-[40px] font-medium'>{price}</span> /MONTH
                </>
            } else {
                return <span className='text-[32px] font-medium'>{price}</span>
            }
        },
        [isInChina, currentBillingType, pricingMap, currentPlan],
    )
    const backgroundLinear = [
        'linear-gradient(180deg, #1A1529 -3.95%, #491DBA 96.05%)',
        'linear-gradient(180deg, #261625 -3.95%, #9A0E83 96.05%)',
        'linear-gradient(180deg, #1A1D0E -3.95%, #DCFF58 96.05%)'
    ]

    return (
        <>
            <FlexColContainer className="w-full items-center pb-[120px] pt-5 font-euclid md:pt-[80px]">
                <FlexRowContainer className="mb-6 w-full justify-between  px-5 md:px-[80px]">
                    <h1 className='my-10 w-full text-center text-[76px] leading-[87px] text-white md:my-[60px]'>Pricing</h1>
                    {/* TODO 购买算力点数，需确认企业版是否需要  */}
                    {user &&
                        (user.isOrg && currentPlan === PlanType.team) && (
                            <div
                                className={cn(
                                    'text-default cursor-pointer items-center space-x-2 text-white duration-200 hover:opacity-80',
                                    'hidden md:flex',
                                )}
                                onClick={() => {
                                    window.open(
                                        `${country === 'global' ? MUSE_GLOBAL_CHECKOUT_URL : MUSE_MAINLAND_CHECKOUT_URL}/checkout/points?source=${source}`,
                                    )
                                }}
                            >
                                <span className="text-[15px] font-medium leading-5 underline underline-offset-4">
                                    {t('pricing.buyPoints')}
                                </span>
                                <span className="block size-2.5 border-[5px] border-transparent border-l-[#262626]"></span>
                            </div>
                        )}
                </FlexRowContainer>

                {/* Pricing Cards */}
                <div className="w-full overflow-x-scroll px-5 md:px-[80px]">
                    <div className='flex w-fit min-w-full items-end justify-center gap-10'>
                        {enterpriseBillingMenu.map((plan, index) => {
                            const {
                                key,
                                buttonType,
                                summary,
                                // uncheckSummary,
                            } = plan
                            const renderPrice = getPriceRender(plan[BillingType.monthly])
                            return <div key={key} className="relative h-fit min-w-[300px] max-w-sm flex-1 shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] px-6 pb-6 pt-[30px]"> {/* Add relative positioning and hide overflow */}
                                {/* Tag */}
                                <div
                                    className="mb-3 w-fit rounded-[10px] px-[10px] py-[9px] text-base font-medium text-white"
                                    style={{
                                        background: backgroundLinear[index], // Yellow-green gradient from design
                                    }}

                                >
                                    {plan.title} {/* Use the plan title for the tag text */}
                                </div>
                                <p className="text-sm text-[rgba(255,255,255,0.48)]">{plan.description}</p> {/* Adjust text size/style */}
                                <div className='mt-[22px] flex items-center gap-1 text-sm leading-4 text-white'>
                                    {renderPrice}
                                </div>
                                <div className='h-[40px] w-full' />
                                {index === 1 && <Button className='mb-4 h-[40px] w-full border-white/10 bg-[#FF2EE7] text-[14px] font-normal  text-white transition-all duration-300 ease-in-out hover:bg-[rgba(255,46,231,0.8)]'>
                                    Book a demo
                                </Button>}
                                <Button
                                    className="h-[40px] w-full rounded border border-white/10 text-[14px] font-normal text-white transition-all duration-300 ease-in-out hover:bg-[#262626] hover:text-white"
                                    onClick={() => {
                                        if (buttonType === 'contact') {
                                            if (isInChina) {
                                                setOpen(true)
                                            } else {
                                                window.open(`mailto:${MUSE_CONTACT_EMAIL}`)
                                            }
                                        } else if (
                                            (buttonType === 'try' &&
                                                (!user || (!!user && currentPlan === PlanType.team && !user.hasOrg)))
                                        ) {
                                            // 如果是已登录用户，且要体验团队（说明还没创建过），则进入团队onboarding流程
                                            if (!!user && currentPlan === PlanType.team && !user.hasOrg) {
                                                window.open(
                                                    `${country === 'global' ? MUSE_GLOBAL_AUTH_URL : MUSE_MAINLAND_AUTH_URL}/onboarding/team`,
                                                )
                                            } else {
                                                window.open(MUSEDAM_LOGIN_URL, '_blank')
                                            }
                                        } else {
                                            window.open(
                                                `${country === 'global' ? MUSE_GLOBAL_CHECKOUT_URL : MUSE_MAINLAND_CHECKOUT_URL}/checkout/plan?product=${pricingMap.get(priceKey)?.id}&source=${source}`,
                                                '_blank',
                                            )
                                        }
                                    }}
                                >
                                    {buttonType === 'contact'
                                        ? t('pricing.contact.now')
                                        : (buttonType === 'try' &&
                                            (!user || (!!user && currentPlan === PlanType.team && !user.hasOrg)))
                                            ? t('pricing.plan.actions.try')
                                            : t('pricing.plan.button.buy')}
                                </Button>

                                <ul className="mt-[30px] space-y-3 text-[rgba(255,255,255,0.72)]">
                                    {summary
                                        .filter((v) => !!v)
                                        .map((feature) => (
                                            <li className="flex items-center gap-2 " key={feature}>
                                                <CheckIcon className="shrink-0 text-[#20C997]" width={16} height={16} />
                                                <span className="font-mono text-[13px] font-light leading-[18px]">
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
