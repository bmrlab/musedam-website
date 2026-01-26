'use client'

import { FC, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { editQuotation, saveQuotation } from '@/endpoints/quotation'
import { useLanguage } from '@/providers/Language'
import { useQuotationStore } from '@/providers/QuotationStore'
import { cn, twx } from '@/utilities/cn'
import { formatWithToLocaleString } from '@/utilities/formatPrice'
import { encodeNumber } from '@/utilities/numberCodec'
import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Switch from '@radix-ui/react-switch'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Loader2, Minus, Plus, ArrowDown, MergeIcon, Layers, ArrowDownToLine } from 'lucide-react'

import { SessionUser } from '@/types/user'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/app/i18n/client'

import { LocaleSwitch } from '../Header/LocalSwitch'
import { LocaleLink } from '../LocalLink'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  EAdvancedModules,
  EPrivateModules,
  useAdvancedConfigs,
  useBasicConfigs,
  usePricing,
} from './config'
import { useQuoteDetailData } from './QuoteDetailData'
import { EFeatureView, IAdvancedModules, ICustomerInfo, IPrivateModules, TabEnum } from './types'
import { useCountry } from '@/providers/Country'

interface NumControlProps {
  value: number
  step?: number
  max?: number
  min?: number
  onChange: (val: number) => void
  disabled?: boolean
}

const NumControl = ({ value, step, max, min, onChange, disabled }: NumControlProps) => {
  const minDisabled = Boolean(disabled || value === min)
  const maxDisabled = Boolean(disabled || value === max)

  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="outline"
        disabled={minDisabled}
        onClick={() => {
          if (minDisabled) return
          onChange(value - (step ?? 1))
        }}
        className={cn(
          'size-6 rounded-full bg-white text-[#262626] disabled:cursor-not-allowed',
          minDisabled && 'border border-[rgba(197,206,224,0.2)] bg-[#414141]',
        )}
      >
        <Minus className="size-4" />
      </Button>
      <span className="min-w-[50px] text-center text-white">{value}</span>
      <Button
        size="sm"
        variant="outline"
        disabled={maxDisabled}
        onClick={() => {
          if (maxDisabled) return
          onChange(value + (step ?? 1))
        }}
        className={cn(
          'size-6 rounded-full bg-white text-[#262626] disabled:cursor-not-allowed',
          maxDisabled && 'border border-[rgba(197,206,224,0.2)] bg-[#414141]',
        )}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}

const TitleDiv = twx.h3`text-lg font-medium text-white-72`

const BlockBox = twx.div`rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#141414] px-5 py-6 space-y-6`

const Label = twx.div`text-base leading-none text-white`

const HintParagraph = twx.p`text-xs text-white-50 font-light font-euclidlight`

const DesParagraph = twx.p`text-sm text-white-72 font-light font-euclidlight`

const MergeToBasicIcon: FC<{ moduleKey: EAdvancedModules; isMerged: boolean; onToggle: () => void }> = ({ moduleKey, isMerged, onToggle }) => {
  const { t } = useTranslation('quotation')
  const [isHovered, setIsHovered] = useState(false)

  // 根据状态确定 SVG 颜色
  const svgColor = isMerged || isHovered ? 'white' : '#BFBFBF'

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              'flex items-center justify-center transition-colors',
              'size-[22px] rounded ',
              isMerged
                ? 'bg-[#3366FF]'
                : isHovered
                  ? 'bg-[#3A3A3A]'
                  : 'text-[#BFBFBF]'
            )}
          >
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px]">
              <path d="M4.46219 3.41343H10.8339V1.1576C10.8339 0.514488 10.3095 0 9.67633 0H1.1576C0.524382 0 0 0.524382 0 1.1576V9.67633C0 10.3194 0.524382 10.8339 1.1576 10.8339H3.75972V4.10601C3.75972 3.73004 4.07632 3.41343 4.46219 3.41343Z" fill={svgColor} />
              <path d="M13.1887 3.41309H10.834V10.141C10.834 10.5269 10.5174 10.8435 10.1315 10.8435H3.75977V12.8421C3.75977 13.4852 4.28415 13.9997 4.91736 13.9997H13.1788C13.822 13.9997 14.3364 13.4753 14.3364 12.8421V4.57068C14.3463 3.93747 13.822 3.41309 13.1887 3.41309Z" fill={svgColor} />
              <path d="M9.61668 6.31245H7.86545V4.55132C7.86545 4.40291 7.74672 4.28418 7.59831 4.28418H6.75732C6.60891 4.28418 6.49018 4.40291 6.49018 4.55132V6.31245H4.72905C4.58064 6.31245 4.46191 6.43118 4.46191 6.57959V7.42058C4.46191 7.56899 4.58064 7.68771 4.72905 7.68771H6.48029V9.44884C6.48029 9.59725 6.59902 9.71598 6.74743 9.71598H7.58842C7.73683 9.71598 7.85555 9.59725 7.85555 9.44884V7.68771H9.61668C9.76509 7.68771 9.88382 7.56899 9.88382 7.42058V6.57959C9.88382 6.43118 9.76509 6.31245 9.61668 6.31245Z" fill={svgColor} />
            </svg>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 rounded bg-[#333] px-3 py-2 text-xs text-white shadow-lg"
            sideOffset={4}
          >
            {isMerged ? t('merge.cancel.to.basic') : t('merge.to.basic')}
            <Tooltip.Arrow className="fill-[#333]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

const Cost = ({ cost, costTitle }: { cost: number; costTitle?: string }) => {
  const { t } = useTranslation('quotation')
  const { prefix } = usePricing()
  return (
    <div className="border-t border-[rgba(255,255,255,0.1)] pt-4 ">
      <div className="flex items-center justify-between text-white ">
        <Label className=" text-lg font-normal">{costTitle ?? t('base.cost')}</Label>
        <span className="flex items-center text-xl font-medium">
          {prefix}
          {formatWithToLocaleString(cost)}
          <span className="text-sm">{t('per.year')}</span>
        </span>
      </div>
    </div>
  )
}
export const LeftContent: FC<{ user?: SessionUser }> = ({ user }) => {
  const { t } = useTranslation('quotation')
  const basicConfigs = useBasicConfigs()
  const advancedConfigs = useAdvancedConfigs()
  const { pricing, prefix } = usePricing()
  const { isInChina } = useCountry()
  const isGlobal = !isInChina
  const { toast } = useToast()
  const router = useRouter()
  const { language } = useLanguage()

  const { totalNumPerYear, years, basicCostPerYear } = useQuoteDetailData()
  const advancedPricing = pricing.advanced.modules
  const [openDiscount, setOpenDiscount] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    customerInfo,
    setCustomerInfo,
    activeTab,
    setActiveTab,
    advancedConfig,
    setAdvancedConfig,
    advancedModules,
    setAdvancedModules,
    privateConfig,
    setPrivateConfig,
    privateModules,
    setPrivateModules,
    basicConfig,
    setBasicConfig,
    subscriptionYears,
    setSubscriptionYears,
    featureView,
    setFeatureView,
    discount,
    setDiscount,
    showNoBuyFeature,
    setShowNoBuyFeature,
    editInfo,
    museAITagOption,
    setMuseAITagOption,
    museCutTagOption,
    setMuseCutTagOption,
    gaTagOption,
    setGaTagOption,
    cdnTagOption,
    setCdnTagOption,
    mergedToBasicModules,
    toggleMergeToBasic,
  } = useQuotationStore()
  const editId = editInfo?.id

  useEffect(() => {
    if (editInfo) {
      setOpenDiscount(editInfo.discount !== undefined)
    }
  }, [editInfo])

  const tabs = [
    // {
    //     key: TabEnum.BASIC,
    //     label: t('tab.basic')
    // },
    {
      key: TabEnum.ADVANCED,
      label: t('tab.advanced'),
    },
    // {
    //     key: TabEnum.PRIVATE,
    //     label:t('tab.private')
    // }
  ]

  useEffect(() => {
    if (activeTab === TabEnum.BASIC) {
      setDiscount(undefined)
    }
  }, [activeTab, setDiscount])

  // 更新數量
  const updateQuantity = (tab: TabEnum, field: string, value: number) => {
    if (tab === TabEnum.BASIC) {
      setBasicConfig({
        ...basicConfig,
        [field]: Math.max(0, value),
      })
    } else if (tab === TabEnum.ADVANCED) {
      setAdvancedConfig({
        ...advancedConfig,
        [field]: Math.max(0, value),
      })
    } else if (tab === TabEnum.PRIVATE) {
      setPrivateConfig({
        ...privateConfig,
        [field]: Math.max(0, value),
      })
    }
  }

  // 處理輸入變化
  const handleInputChange = (field: keyof ICustomerInfo, value: string) => {
    setCustomerInfo({
      ...customerInfo,
      [field]: value,
    })
  }

  // 處理模組勾選
  const handleModuleChange = (
    tab: TabEnum,
    module: keyof IAdvancedModules | keyof IPrivateModules,
    checked: boolean | number,
  ) => {
    if (tab === TabEnum.ADVANCED) {
      setAdvancedModules((st) => {
        const newState = {
          ...st,
          [module]: checked,
        }

        // 检查是否有父级项目需要更新
        const parentModule = advancedConfigs.find(
          (config) => config.noCheckBox && config.subModules?.some((sub) => sub.key === module),
        )

        if (parentModule) {
          const parentKey = parentModule.key
          const hasCheckedChild =
            parentModule.subModules?.some((sub) => newState[sub.key] && newState[sub.key] !== 0) ??
            false

          // 如果有子项目被勾选，则勾选父级项目；否则取消勾选父级项目
          newState[parentKey] = hasCheckedChild
        }

        return newState
      })
    } else if (tab === TabEnum.PRIVATE) {
      setPrivateModules((st) => ({
        ...st,
        [module]: checked,
      }))
    }
  }

  const formInfo = [
    {
      id: 'company',
      label: t('customer.company'),
      required: true,
    },
    {
      id: 'contact',
      label: t('customer.contact'),
    },
    {
      id: 'email',
      label: t('customer.email'),
    },
    {
      id: 'yourEmail',
      label: t('your.email'),
      required: true,
    },
  ]

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!user?.orgId || !user.token) {
      toast({
        duration: 2000,
        description: '您当前所在的团队无生成报价单权限',
      })
      return
    }
    setLoading(true)
    let content = {
      advancedModules,
      advancedConfig,
      prefix,
      featureView,
      showNoBuyFeature,
      lang: language,
      mergedToBasicModules: Array.from(mergedToBasicModules),
    }
    try {
      const userInfo = {
        userId: user.userId,
        orgId: user.orgId,
        token: user.token,
      }
      const params = {
        customerContact: customerInfo.contact,
        contactEmail: customerInfo.yourEmail,
        customerEmail: customerInfo.email,
        customerCompany: customerInfo.company,
        annualPrice: Math.round(totalNumPerYear * 100),
        content: JSON.stringify(content),
        discount: discount ? Math.round(discount * 100) : null,
        subscriptionYears: years,
      }
      if (editId) {
        const id = await editQuotation(isGlobal ? 'global' : 'mainland', userInfo, {
          ...params,
          quotationId: editId,
        })
        router.push(`${window.location.pathname}/${encodeNumber(id)}`)
      } else {
        const id = await saveQuotation(isGlobal ? 'global' : 'mainland', userInfo, params)
        router.push(`${window.location.pathname}/${encodeNumber(id)}`)
      }
    } catch (err) {
      toast({
        description: err.message ?? '报价单保存失败',
        duration: 2000,
      })
    }
  }, [
    user,
    advancedModules,
    advancedConfig,
    prefix,
    featureView,
    showNoBuyFeature,
    language,
    toast,
    customerInfo,
    totalNumPerYear,
    discount,
    years,
    editId,
    isGlobal,
    router,
    mergedToBasicModules,
  ])

  const renderBasics = () => {
    const planName = {
      [TabEnum.BASIC]: t('basic.plan'),
      [TabEnum.ADVANCED]: t('advanced.plan'),
      [TabEnum.PRIVATE]: t('private.plan'),
    }
    return (
      <BlockBox>
        <div className="flex w-full items-center justify-between space-x-2">
          <div className="space-y-[6px]">
            <Label className="text-white">{planName[activeTab]}</Label>
            <DesParagraph>{t('by.year')}</DesParagraph>
          </div>
          <NumControl value={subscriptionYears} onChange={setSubscriptionYears} min={1} />
        </div>
        {basicConfigs.map(({ title, hint, des, key, min, tag }) => {
          return (
            <div className="flex w-full items-center justify-between space-x-2" key={key}>
              <div className="space-y-[6px]">
                <Label className="flex items-center gap-3 text-[16px] text-white">
                  {title}
                  {tag && (
                    <div className="flex items-center justify-center rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px] font-euclidlight text-sm font-light">
                      {tag}
                    </div>
                  )}
                </Label>
                <div className="space-y-0">
                  {hint.map((item, i) => (
                    <HintParagraph key={`hint${i}`}>{item}</HintParagraph>
                  ))}
                </div>
                <DesParagraph>{des}</DesParagraph>
              </div>
              <NumControl
                value={activeTab === TabEnum.BASIC ? basicConfig[key] : advancedConfig[key]}
                onChange={(val) => {
                  updateQuantity(activeTab, key, val)
                }}
                min={min}
              />
            </div>
          )
        })}

        {/* Base Cost */}
        <Cost cost={basicCostPerYear} />
      </BlockBox>
    )
  }

  const renderModuleItem = (module: (typeof advancedConfigs)[number], isSubModule = false) => {
    const { key, min, unit, noCheckBox } = module
    const isMuseAI = key === EAdvancedModules.MUSE_AI
    const isMuseCut = key === EAdvancedModules.MUSE_CUT
    const isGA = key === EAdvancedModules.GA
    const isCDN = key === EAdvancedModules.CDN_TRAFFIC
    const currentTagOption = isMuseAI ? museAITagOption : isMuseCut ? museCutTagOption : isGA ? gaTagOption : isCDN ? cdnTagOption : null
    const selectedTagOption = (isMuseAI || isMuseCut || isGA || isCDN) && module.tagOptions
      ? module.tagOptions.find(opt => opt.value === currentTagOption) || module.tagOptions[0]
      : null
    const displayPrice = (isMuseAI || isMuseCut || isGA || isCDN) && selectedTagOption && selectedTagOption.priceMultiplier
      ? module.price * selectedTagOption.priceMultiplier
      : module.price
    const isMergedToBasic = mergedToBasicModules.has(key)

    return (
      <div key={key} className="flex flex-col justify-between md:flex-row md:items-center">
        <div className="flex items-start space-x-2">
          <div className='flex h-[22px] items-center'>
            {noCheckBox ? (
              <div className="size-4" />
            ) : (
              <Checkbox
                disabled={module.disabled}
                id={key}
                checked={!!advancedModules[key]}
                onCheckedChange={(checked: boolean) => {
                  handleModuleChange(
                    TabEnum.ADVANCED,
                    module.key,
                    min !== undefined ? (checked ? min : 0) : checked,
                  )
                  if (module.subModules?.length) {
                    module.subModules.map((v) => {
                      if (v.disabled) {
                        handleModuleChange(
                          TabEnum.ADVANCED,
                          v.key,
                          v.min !== undefined ? (checked ? v.min : 0) : checked,
                        )
                      }
                    })
                  }
                }}
                className={cn(
                  'size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 ',
                  (module.tag || module.tagOptions) && 'mt-[4px]',
                )}
              />
            )}
          </div>
          <div className="space-y-[6px]">
            <Label className="flex items-center gap-1 md:gap-3">
              <span>{module.label}</span>
              {module.tag && (
                <div className="min-w-[40px] font-euclidlight text-[14px] font-light  leading-[22px]">
                  <div className="flex items-center justify-center rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px]">
                    {module.tag}
                  </div>
                </div>
              )}
              {module.tagOptions && (
                <div className="min-w-[80px] font-euclidlight text-[14px] font-light leading-[16px]">
                  <Select
                    value={isMuseAI ? museAITagOption : isMuseCut ? museCutTagOption : isGA ? gaTagOption : isCDN ? cdnTagOption : ''}
                    onValueChange={(value) => {
                      if (isMuseAI) {
                        setMuseAITagOption(value)
                      } else if (isMuseCut) {
                        setMuseCutTagOption(value)
                      } else if (isGA) {
                        setGaTagOption(value)
                      } else if (isCDN) {
                        setCdnTagOption(value)
                      }
                    }}
                  >
                    <SelectTrigger className="h-auto rounded-sm border border-[rgba(255,255,255,0.2)] bg-transparent px-[6px] py-[2px] text-white hover:bg-[rgba(255,255,255,0.1)] focus:ring-0 focus:ring-offset-0">
                      <SelectValue className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="border-[rgba(255,255,255,0.2)] bg-[#141414] text-white">
                      {module.tagOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="cursor-pointer text-white focus:bg-[rgba(255,255,255,0.1)] focus:text-white"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {!isSubModule && key !== EAdvancedModules.ADVANCED_FEATURES && (
                <MergeToBasicIcon
                  moduleKey={key}
                  isMerged={isMergedToBasic}
                  onToggle={() => toggleMergeToBasic(key)}
                />
              )}
            </Label>
            {module.hint && <HintParagraph>{module.hint}</HintParagraph>}
            {!module.noPrice && (
              <DesParagraph>
                {displayPrice === 0
                  ? t('free')
                  : `${prefix} ${formatWithToLocaleString(displayPrice ?? 0)} ${unit ?? t('per.year')}`}
              </DesParagraph>
            )}
          </div>
        </div>

        {typeof advancedModules[key] === 'number' && (
          <div className="flex w-full justify-end md:ml-5 md:w-auto">
            <NumControl
              key={advancedModules[key]}
              value={advancedModules[key] as number}
              onChange={(val) => {
                handleModuleChange(TabEnum.ADVANCED, key, val)
              }}
              disabled={!advancedModules[key]}
              min={min}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="no-scrollbar h-full overflow-scroll bg-black pb-20 font-euclid text-white">
      <div className="sticky top-0 flex items-center justify-between p-5 md:pr-[60px]">
        <div className="shrink-0 md:px-4">
          <LocaleLink href="/">
            <div className="relative size-9">
              <Image src="/assets/logo-dark.svg" fill alt="muse logo" />
            </div>
          </LocaleLink>
        </div>
        {!isGlobal && <LocaleSwitch />}
      </div>

      <div className="quote-form px-5 md:px-[60px]">
        <h1 className="font-feature text-[40px] md:text-[64px]">{t('title')}</h1>
        <div className="mt-2 font-euclidlight text-[18px] font-light text-white-72">
          {t('subtitle')}
        </div>
      </div>

      <div className="mt-10 space-y-10 px-5 text-white-72 md:px-[60px]">
        {/* 客戶資訊 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {formInfo.map(({ id, label, required }) => {
            return (
              <div className="col-span-1 space-y-3" key={id}>
                <Label className={cn('text-sm font-medium', required && '')}>
                  {required && <span className="mr-1 ">*</span>}
                  {label}
                </Label>
                <Input
                  id={id}
                  placeholder={t('input.placeholder')}
                  value={customerInfo[id as keyof ICustomerInfo]}
                  onChange={(e) => handleInputChange(id as keyof ICustomerInfo, e.target.value)}
                  className=" h-[44px] rounded-none  border-2 border-[rgba(255,255,255,0.2)] text-white focus:border-white"
                />
              </div>
            )
          })}
        </div>

        {/* 套餐类型选择 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-[46px] w-fit rounded-[26px] border border-[rgba(255,255,255,0.2)] bg-[#141414] p-1">
            {tabs.map(({ key, label }) => {
              const isActive = activeTab === key
              return (
                <TabsTrigger
                  value={key}
                  className={cn(
                    'h-full rounded-[26px] border border-transparent px-[14px]',
                    isActive && 'border-white text-white',
                  )}
                  key={key}
                >
                  {label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="mt-6 space-y-4">
            {renderBasics()}
          </TabsContent>

          {/* 高级版 */}
          <TabsContent value="advanced" className="mt-6 space-y-4">
            {/* 基础模块 */}
            {renderBasics()}

            {/* 高级版 - 高级模块  */}
            <div className="space-y-4">
              <TitleDiv>{t('advanced.modules')}</TitleDiv>
              <BlockBox>
                {advancedConfigs.map((module) => (
                  <div key={module.key} className="">
                    {renderModuleItem(module)}
                    {!!module.subModules?.length && (
                      <div
                        className={cn(
                          'ml-[26px]',
                          module.subFlex === 'row'
                            ? 'mt-3 flex flex-wrap items-center gap-2 md:gap-[40px]'
                            : 'mt-[6px] space-y-[6px]',
                        )}
                      >
                        {module.subModules?.map((v) => {
                          return renderModuleItem(v, true)
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Advanced Cost */}
                <Cost
                  cost={Object.keys(advancedModules)
                    .filter((v) => !!advancedModules[v])
                    .reduce((total, key) => {
                      const value = advancedModules[key]
                      let price = advancedPricing[key]
                      if (!price) return total
                      // 如果是 MUSE_AI 或 MUSE_CUT，根据选择的 tagOption 调整价格
                      if (key === EAdvancedModules.MUSE_AI || key === EAdvancedModules.MUSE_CUT) {
                        const moduleConfig = advancedConfigs.find(m => m.key === key)
                        if (moduleConfig?.tagOptions) {
                          const currentTagOption = key === EAdvancedModules.MUSE_AI ? museAITagOption : museCutTagOption
                          const selectedOption = moduleConfig.tagOptions.find(opt => opt.value === currentTagOption)
                          if (selectedOption?.priceMultiplier) {
                            price = price * selectedOption.priceMultiplier
                          }
                        }
                      }
                      // 如果是 GA 或 CDN_TRAFFIC，根据选择的 tagOption 调整价格
                      if (key === EAdvancedModules.GA || key === EAdvancedModules.CDN_TRAFFIC) {
                        const moduleConfig = advancedConfigs.find(m => m.key === key)
                        if (moduleConfig?.tagOptions) {
                          const currentTagOption = key === EAdvancedModules.GA ? gaTagOption : cdnTagOption
                          const selectedOption = moduleConfig.tagOptions.find(opt => opt.value === currentTagOption)
                          if (selectedOption?.priceMultiplier) {
                            price = price * selectedOption.priceMultiplier
                          }
                        }
                      }
                      return total + price * (typeof value === 'number' ? value : 1)
                    }, 0)}
                  costTitle={t('advanced.cost')}
                />
              </BlockBox>
            </div>
          </TabsContent>

          {/* 私有化版-暂时没有 */}
          <TabsContent value="private" className="mt-6 space-y-4">
            {/* License Type Selection */}
            <div className="space-y-4">
              <TitleDiv>{t('museDAM.software')}</TitleDiv>
              <RadioGroup.Root value={privateConfig.licenseType} className="space-y-3">
                {['saas', 'perpetual'].map((type) => {
                  return (
                    <BlockBox className="flex w-full items-center space-x-2 space-y-0" key={type}>
                      <RadioGroup.Item
                        className={cn(
                          'mr-2 flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-300',
                          'transition-all duration-300 ease-in-out hover:border-[#3366FF]',
                          type === privateConfig.licenseType && 'border-[#3366FF]',
                        )}
                        value={type}
                        id={type}
                        onClick={() => {
                          setPrivateConfig({
                            ...privateConfig,
                            licenseType: type as 'saas' | 'perpetual',
                          })
                        }}
                      >
                        <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                      </RadioGroup.Item>
                      <Label className="font-normal text-white">
                        {type === 'saas'
                          ? t('saas.standard.enterprise')
                          : t('perpetual.license.standard')}
                      </Label>
                    </BlockBox>
                  )
                })}
              </RadioGroup.Root>

              {/* Member Seats */}
              <BlockBox>
                <div className="flex w-full items-center justify-between space-x-2 space-y-0">
                  <div>
                    <Label>{t('member.seat')}</Label>
                    <HintParagraph>{t('admin.contributor.member')}</HintParagraph>
                    <DesParagraph>{t('member.seat.price')}</DesParagraph>
                  </div>
                  <NumControl
                    value={privateConfig.memberSeats}
                    onChange={(val) => {
                      updateQuantity(TabEnum.PRIVATE, 'memberSeats', val)
                    }}
                  />
                </div>
                {/* Base Cost */}
                <Cost
                  cost={
                    (privateConfig.licenseType === 'saas'
                      ? pricing.private.saasBaseCost
                      : pricing.private.perpetualBaseCost) +
                    privateConfig.memberSeats * pricing.private.memberSeatPrice
                  }
                />
              </BlockBox>
            </div>
            {/* Advanced Modules */}
            <div className="space-y-4">
              <TitleDiv>{t('advanced.modules')}</TitleDiv>
              <BlockBox>
                {advancedConfigs.map((module) => (
                  <div key={module.key} className="flex items-center justify-between">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id={`private-${module.key}`}
                        checked={!!privateModules[module.key]}
                        onCheckedChange={(checked) =>
                          handleModuleChange(
                            TabEnum.PRIVATE,
                            module.key as keyof IPrivateModules,
                            checked as boolean,
                          )
                        }
                        className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                      />
                      <div className="space-y-[6px]">
                        <div>{module.label}</div>
                        <HintParagraph>
                          {prefix}
                          {formatWithToLocaleString(module.price)}
                          {t('per.year')}
                        </HintParagraph>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Advanced Cost */}
                <Cost
                  cost={Object.keys(privateModules)
                    .filter(
                      (key) =>
                        key !== EPrivateModules.PRIVATE_IMPLEMENTATION &&
                        key !== EPrivateModules.OPERATION_MAINTENANCE &&
                        key !== 'maintenanceYears',
                    )
                    .reduce((total, key) => {
                      return total + (privateModules[key] ? pricing.private.modules[key] : 0)
                    }, 0)}
                  costTitle={t('advanced.cost')}
                />
              </BlockBox>
            </div>
            {/* Implementation */}
            <div className="space-y-4">
              <TitleDiv>{t('implementation')}</TitleDiv>
              <BlockBox>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privateImplementation"
                    checked={!!privateModules.privateImplementation}
                    onCheckedChange={(checked) =>
                      handleModuleChange(
                        TabEnum.PRIVATE,
                        EPrivateModules.PRIVATE_IMPLEMENTATION,
                        checked as boolean,
                      )
                    }
                    className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                  />
                  <div className="space-y-[6px]">
                    <Label>{t('privateDeploymentImplementation')}</Label>
                    <HintParagraph>
                      {t('privateDeploymentImplementationDescription')}
                      <br />
                      {prefix}
                      {pricing.private.modules.privateImplementation}/{t('implementation')}
                    </HintParagraph>
                  </div>
                </div>

                {/* Implementation Cost */}
                <Cost
                  costTitle={t('implementationCost')}
                  cost={
                    privateModules.privateImplementation
                      ? pricing.private.modules.privateImplementation
                      : 0
                  }
                />
              </BlockBox>
            </div>

            {/* Operation and Maintenance */}
            <div className="space-y-4">
              <TitleDiv>{t('operation.maintenance')}</TitleDiv>
              <BlockBox>
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="operationMaintenance"
                      checked={!!privateModules.operationMaintenance}
                      onCheckedChange={(checked) =>
                        handleModuleChange(
                          TabEnum.PRIVATE,
                          EPrivateModules.OPERATION_MAINTENANCE,
                          checked as boolean,
                        )
                      }
                      className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <div className="space-y-[6px]">
                      <Label>{t('productOperationAndMaintenanceServices')}</Label>
                      <HintParagraph>
                        {t('productOperationAndMaintenanceServicesDescription')}
                      </HintParagraph>
                    </div>
                  </div>
                </div>

                {privateModules.operationMaintenance && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-base text-white">
                      {t('privateEditionMajorIterations')}
                    </Label>
                    <HintParagraph>{t('privateEditionMajorIterationsDescription')}</HintParagraph>
                    <DesParagraph>{t('privateEditionMajorIterationsPrice')}</DesParagraph>
                    <RadioGroup.Root
                      value={privateModules.maintenanceYears.toString()}
                      onValueChange={(value) =>
                        setPrivateModules({ ...privateModules, maintenanceYears: parseInt(value) })
                      }
                      className="mt-3 flex space-x-4"
                    >
                      {['2', '4', '6'].map((timeNum) => {
                        const isActive = timeNum === privateModules.maintenanceYears.toString()
                        return (
                          <div className="flex h-[20px] flex-1 items-center gap-3 " key={timeNum}>
                            <RadioGroup.Item
                              className={cn(
                                'mr-2 flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-300',
                                'transition-all duration-300 ease-in-out hover:border-[#3366FF]',
                                isActive && 'border-[#3366FF]',
                              )}
                              value={timeNum}
                              id={timeNum}
                              onClick={() => {
                                setPrivateModules({
                                  ...privateModules,
                                  maintenanceYears: parseInt(timeNum),
                                })
                              }}
                            >
                              <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                            </RadioGroup.Item>
                            <Label className="text-white">
                              {timeNum + ' ' + t('timesPerYear')}
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup.Root>
                  </div>
                )}
                {/* Service Cost */}
                <Cost
                  cost={
                    privateModules.operationMaintenance
                      ? pricing.private.modules.operationMaintenance *
                      privateModules.maintenanceYears
                      : 0
                  }
                  costTitle={t('serviceCost')}
                />
              </BlockBox>
            </div>
          </TabsContent>
        </Tabs>

        {/* 优惠设置 */}
        {!isGlobal && activeTab !== TabEnum.BASIC && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <TitleDiv>{t('discount.settings')}</TitleDiv>
              <Switch.Root
                checked={openDiscount}
                onCheckedChange={(open) => {
                  if (open) {
                    setDiscount(9.5)
                  } else {
                    setDiscount(undefined)
                  }
                  setOpenDiscount(open)
                }}
                className={cn(
                  'relative h-[22px] w-[44px] cursor-pointer rounded-full border  outline-none disabled:cursor-not-allowed',
                  'group transition-all duration-300 ease-in-out',
                  !openDiscount
                    ? ' border-[rgba(255,255,255,0.2)] hover:border-white/40'
                    : 'data-[state=checked]:border-transparent data-[state=checked]:bg-[#3366FF]',
                )}
              >
                <Switch.Thumb className="block size-[18px] translate-x-0.5 rounded-full bg-white-72 transition-all duration-300 ease-in-out group-hover:bg-white data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-white" />
              </Switch.Root>
            </div>

            {openDiscount && (
              <BlockBox className="flex items-center justify-between space-y-0">
                <div className="space-y-[6px]">
                  <Label>{t('discount.input.label')}</Label>
                  <DesParagraph>{t('discount.input.hint')}</DesParagraph>
                </div>
                <div className="flex items-center gap-[10px]">
                  <Input
                    // 确保值始终为数字或空字符串，避免受控组件警告
                    value={
                      discount !== undefined
                        ? language === 'zh-CN'
                          ? discount
                          : Math.round((10 - discount) * 10)
                        : ''
                    }
                    // 增加onChange实时处理输入，提升响应性
                    onChange={(e) => {
                      if (e.target.value === '') {
                        setDiscount(undefined)
                        return
                      }
                      setDiscount(e.target.value as unknown as number)
                    }}
                    onBlur={(e) => {
                      let val = e.target.value ? Number(e.target.value) : 9.5
                      if (language === 'zh-CN') {
                        // 中文环境：严格限制在8-10之间
                        const validVal = Math.max(8, Math.min(10, Math.round(val * 100) / 100))
                        setDiscount(validVal)
                      } else {
                        // 其他语言环境：输入值限制在0-20
                        const validInputVal = Math.max(0, Math.min(20, Math.floor(val)))
                        const realVal = (100 - validInputVal) / 10
                        // 确保折扣不低于8
                        setDiscount(Math.max(8, realVal))
                      }
                    }}
                    className="h-[44px] max-w-[115px] rounded-none border-[rgba(255,255,255,0.2)] font-medium text-white"
                    // 允许为空，提升用户体验
                    placeholder={language === 'zh-CN' ? '8-10' : '0-20'}
                  />
                  <span className="text-base">{t('discount.unit')}</span>
                </div>
              </BlockBox>
            )}
          </div>
        )}

        {/* 功能明细展示 */}
        <div className="space-y-5">
          <TitleDiv>{t('feature.display.options')}</TitleDiv>
          <RadioGroup.Root
            className="flex flex-col gap-3 md:flex-row md:gap-6"
            defaultValue={featureView}
          >
            {[EFeatureView.OVERVIEW, EFeatureView.DETAIL].map((listType) => {
              return (
                <BlockBox
                  className="flex h-full flex-1 items-center space-x-2 space-y-0"
                  key={listType}
                >
                  <RadioGroup.Item
                    className={cn(
                      'mr-2 flex size-4 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)]',
                      'transition-all duration-300 ease-in-out ',
                      listType === featureView ? 'border-[#3366FF]' : 'hover:border-white/40',
                    )}
                    value={listType}
                    id={listType}
                    onClick={() => {
                      setFeatureView(listType)
                    }}
                  >
                    <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                  </RadioGroup.Item>
                  <Label className="text-[14px] leading-[1.3em] text-white">
                    {listType === EFeatureView.OVERVIEW
                      ? t('feature.overview')
                      : t('feature.details')}
                  </Label>
                </BlockBox>
              )
            })}
          </RadioGroup.Root>
        </div>

        {/* 未选模块报价 */}
        <div className="space-y-5">
          <TitleDiv>{t('unselected.modules.pricing')}</TitleDiv>
          <RadioGroup.Root
            className="flex flex-col gap-3 md:flex-row md:gap-6"
            defaultValue={showNoBuyFeature.toString()}
          >
            {[false, true].map((radio) => {
              return (
                <BlockBox
                  className="flex h-full flex-1 items-center space-x-2 space-y-0"
                  key={radio + 'feature--all'}
                >
                  <RadioGroup.Item
                    className={cn(
                      'mr-2 flex size-4 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)]',
                      'transition-all duration-300 ease-in-out ',
                      showNoBuyFeature === radio ? 'border-[#3366FF]' : 'hover:border-white/40',
                    )}
                    value={radio.toString()}
                    id={radio.toString()}
                    onClick={() => {
                      setShowNoBuyFeature(radio)
                    }}
                  >
                    <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                  </RadioGroup.Item>
                  <Label className="text-[14px] leading-[1.3em] text-white">
                    {radio ? t('show.unselected.modules') : t('hide.unselected.modules')}
                  </Label>
                </BlockBox>
              )
            })}
          </RadioGroup.Root>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        disabled={loading}
        className="ml-5 mt-10 h-[48px] min-w-[calc(100%-40px)] rounded-lg bg-white text-lg font-medium text-[#0e0e0e] transition-all duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.6)] md:ml-[60px] md:w-fit md:min-w-[160px] md:rounded-2xl"
        onClick={() => {
          if (loading) return
          if (!customerInfo['company']?.length || !customerInfo['yourEmail']?.length) {
            toast({
              duration: 800,
              description: t('form.required'),
            })
            return
          }
          handleGenerate()
        }}
      >
        {loading && <Loader2 className="animate-spin" />}
        {loading
          ? editId
            ? t('saving')
            : t('generating')
          : editId
            ? t('save.and.preview')
            : t('generate.now')}
      </Button>
    </div>
  )
}
