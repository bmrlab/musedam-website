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

import { Button } from '../ui/button'
import { useBillingMenu } from './billingMenu'
import ContactUsDialog from './ContactUsDialog'
import { BillingType, PlanType } from './types/plan'
import { EMuseProductType } from './types/products'

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

  const { billingMenu } = useBillingMenu({ isMuseAI: isMuseAI ?? false }) // 在组件内
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPlan = useMemo(
    () => searchParams?.get('plan') ?? (PlanType.team as PlanType),
    [searchParams],
  )
  const { country, isInChina } = useCountry()
  // const [pricingData, setPricingData] = useState<[EMuseProductType, ProductItem][]>(cache)

  // 后端限制的两个值，注意大小写
  const source = useMemo(() => (isMuseAI ? 'museAI' : 'museDAM'), [isMuseAI])

  const pricingMap = useMemo(() => {
    if (!pricingData || !Array.isArray(pricingData)) return new Map()

    return new Map(pricingData)
  }, [pricingData])

  const updatePlan = (newPlan: PlanType) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '')
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
      if (pricingMap && typeof price !== 'string') {
        let productInfo = pricingMap.get(price)
        let res = productInfo?.price
        if (!res) return '-'
        // 国内团队版 和 海外按年支付，显示月价格
        if (
          (isInChina && currentPlan === PlanType.team) ||
          (!isInChina && currentBillingType === BillingType.yearly)
        ) {
          res = res / 12
        }
        return Math.ceil(res / 100)
      } else {
        return price
      }
    },
    [isInChina, currentBillingType, pricingMap, currentPlan],
  )

  return (
    <>
      <FlexColContainer className="mt-[30px] w-full items-center px-5 font-euclid md:px-[74px]">
        <FlexRowContainer className="mb-6 w-full justify-between">
          <h1 className="text-[20px] leading-6">{t('pricing.title')}</h1>
          {user &&
            ((user.isOrg && currentPlan === PlanType.team) ||
              (user.isPro && currentPlan === PlanType.personal)) && (
              <div
                className={cn(
                  'text-default cursor-pointer items-center space-x-2 duration-200 hover:opacity-80',
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
        {/* Plan Type Toggle */}
        <FlexRowContainer className="relative h-[42px] rounded-full bg-[#F4F5F6] p-[4px]">
          {/* 滑动的白色背景 */}
          <div
            className="absolute h-[34px] rounded-full bg-white transition-all duration-300 ease-in-out"
            style={{
              width: '125px',
              left: currentPlan === PlanType.personal ? '4px' : '50%',
            }}
          />

          {/* 标签文字 */}
          {tabs.map((tab) => {
            const isActive = currentPlan === tab.type
            return (
              <FlexColContainer
                onClick={() => updatePlan(tab.type)}
                className={cn(
                  'z-10 h-full w-[125px] cursor-pointer justify-center text-center text-[14px] font-medium transition-colors duration-300',
                  'hover:text-[#141414]',
                  isActive ? 'text-[#141414]' : 'text-[#95989F]',
                )}
                key={tab.type}
              >
                {tab.label}
              </FlexColContainer>
            )
          })}
        </FlexRowContainer>

        {!isInChina && !isMuseAI ? (
          <div className="w-full">
            {/* Billing Frequency */}
            <RadioGroup.Root
              className="relative my-[30px] flex w-fit items-center justify-start gap-6"
              defaultValue={currentBillingType}
            >
              {billingTypes.map((item) => {
                const { type, label } = item
                return (
                  <div className="flex items-center" key={type}>
                    <RadioGroup.Item
                      className={cn(
                        'mr-2 flex size-4 items-center justify-center rounded-full border border-gray-300 ',
                        'transition-all duration-300 ease-in-out hover:border-[#141414]',
                        type === currentBillingType && 'border-[#141414]',
                      )}
                      value={type}
                      id={type}
                      onClick={() => {
                        setCurrentBillingType(type)
                      }}
                    >
                      <RadioGroup.Indicator className="size-2 rounded-full bg-[#141414]" />
                    </RadioGroup.Item>
                    <label className="whitespace-nowrap text-sm text-gray-700">{label}</label>
                  </div>
                )
              })}
              <FlexColContainer className="absolute bottom-2 left-full ml-1">
                <div className="whitespace-nowrap font-euclid text-[13px] font-medium leading-[18px]">
                  {t('pricing.plan.total-saved', { val: '20%' })}
                </div>
                <Image src="/assets/Pricing/line.svg" alt="line" width={23} height={20} />
              </FlexColContainer>
            </RadioGroup.Root>
          </div>
        ) : (
          <div className="h-[50px] w-full" />
        )}
        {/* Pricing Cards */}
        <div className="grid w-full gap-6 lg:grid-cols-4">
          {billingMenu[currentPlan].map((plan) => {
            const {
              key,
              isHighlight,
              linkText,
              buttonType,
              summary,
              period,
              uncheckSummary,
              price,
              des,
              desFn,
            } = plan
            const priceKey = isInChina ? price : plan[currentBillingType]
            const renderPrice = getPriceRender(priceKey)
            const priceDes =
              desFn?.(
                currentPlan === PlanType.personal
                  ? renderPrice
                  : (pricingMap?.get(priceKey)?.price || 0) / 100,
              ) ?? des
            return (
              <div
                className={cn(
                  'relative border px-6 pb-6 pt-[30px]',
                  isHighlight && 'border-none shadow-[0px_10px_30px_0px_#7E6CE81F]',
                )}
                key={key}
              >
                {isHighlight && (
                  <div
                    className="absolute left-0 top-0 h-[3px] w-full"
                    style={{
                      background: 'linear-gradient(257.16deg, #7E6CE8 10.55%, #CF6CE8 89.44%)',
                    }}
                  />
                )}
                <div>
                  <h3 className="text-5 flex items-center gap-1 font-medium leading-6">
                    {plan.title}
                    {plan.icon && <Image src={plan.icon} width={16} height={16} alt="icon" />}
                  </h3>
                  <p className="mt-1 font-mono text-[13px] leading-[18px] text-[#95989F]">
                    {plan.description}
                  </p>
                </div>
                <div className="mt-[10px] flex items-center gap-[6px]">
                  {period && (
                    <span className="text-[12px] font-medium ">{isInChina ? '￥' : '$'}</span>
                  )}
                  <span
                    className={cn(
                      ' font-medium leading-[32px]',
                      !period ? 'text-[28px]' : 'text-[32px]',
                    )}
                  >
                    {renderPrice}
                  </span>
                  {period && (
                    <span className="font-mono text-[12px] leading-4 text-[#262626] ">
                      {period}
                    </span>
                  )}
                </div>
                {priceDes && (
                  <span className="mt-[6px] font-mono text-[14px] leading-[20px] text-[#95989F]">
                    {priceDes}
                  </span>
                )}

                {/**
                  按钮显示规则
                  > 登录、onboarding 等逻辑都在结算页面实现，这里不管了，显示正确的入口即可

                  【个人套餐 - 未登录】
                  - 显示免费体验和立即购买的小字
                  - 点击免费体验则登录
                  - 点击立即购买则先登录（首次注册则包括 onboarding）再进入结算页面

                  【个人套餐 - 已登录】
                  - 不显示免费体验，按钮上显示立即购买，没有小字
                  - 点击立即购买则进入结算页面

                  【团队套餐 - 未登录】
                  - 显示免费体验和立即购买的小字
                  - 点击免费体验，则登录，如果没有创建过团队体验版，则进入团队 onboarding，并创建体验版
                  - 点击立即购买，则登录，如果没有创建过团队体验版，则进入团队 onboarding，并创建体验版，然后进入结算页面
                  - 点击立即购买，则登录，如果已有团队，只有一个团队则直接结算，如果多个团队则进行团队选择

                  【团队套餐 - 已登录】
                  - 如果没有团队，则显示免费体验和立即购买的小字，然后类似于上一种情况的 2
                  - 如果有团队，则类似于上一种情况的 4
                  */}
                <Button
                  className="mt-[30px] h-[40px] w-full rounded border-[#262626] bg-transparent text-[14px] font-normal transition-all duration-300 ease-in-out hover:bg-[#262626] hover:text-white"
                  variant="outline"
                  onClick={() => {
                    // 注意这里的判断条件和下面按钮文字的
                    // 保持完全一致
                    if (buttonType === 'contact') {
                      if (isInChina) {
                        setOpen(true)
                      } else {
                        window.open(`mailto:${MUSE_CONTACT_EMAIL}`)
                      }
                    } else if (
                      (buttonType === 'try' &&
                        (!user || (!!user && currentPlan === PlanType.team && !user.hasOrg))) ||
                      (pricingMap?.get(priceKey)?.price || 0) === 0
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
                      (!user || (!!user && currentPlan === PlanType.team && !user.hasOrg))) ||
                      (pricingMap?.get(priceKey)?.price || 0) === 0
                      ? t('pricing.plan.actions.try')
                      : t('pricing.plan.button.buy')}
                </Button>
                {linkText &&
                  (!user || (!!user && currentPlan === PlanType.team && !user.hasOrg)) && (
                    <a
                      href={`${country === 'global' ? MUSE_GLOBAL_CHECKOUT_URL : MUSE_MAINLAND_CHECKOUT_URL}/checkout/plan?product=${pricingMap.get(priceKey)?.id}&source=${source}`}
                      target="_blank"
                      className="mt-4 block font-mono text-sm"
                    >
                      <span className="underline underline-offset-4">{linkText}</span> →
                    </a>
                  )}
                <ul className="mt-[30px] space-y-3">
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
                  {uncheckSummary?.map((feature) => (
                    <li className="flex items-center gap-2 " key={feature}>
                      <Cross2Icon className="shrink-0 text-[#FF3535]" width={16} height={16} />
                      <span className="font-mono text-[13px] font-light leading-[18px]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </FlexColContainer>

      <ContactUsDialog open={open} setOpen={setOpen} />
    </>
  )
}
