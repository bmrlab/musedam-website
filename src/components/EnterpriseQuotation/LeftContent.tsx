'use client'

import { FC, useCallback, useEffect, useMemo, useState } from 'react'
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
import { ChevronDown, ChevronRight, Info, Loader2, Minus, Plus } from 'lucide-react'
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
  EAdvancedModules,
  EGeaBaseModules,
  EPrivateImplProducts,
  IModules,
  PRIVATE_IMPL_SAAS_MAP,
  calcPrivateBasicMaintenance,
  calcPrivateLicenseFee,
  isSaasProductSelected,
  useAdvancedModuleGroups,
  useBasicConfigs,
  usePricing,
} from './config'
import {
  AI_POINTS_DEFAULT_OPTION,
  CLIPO_REMIX_VARIANT_KEYS,
  getPrivateImplPrice,
  MUSE_AI_VARIANT_KEYS,
} from './enums'
import { ModuleInfoIcon } from './ModuleInfoIcon'
import { NoBuyModulesDialog } from './NoBuyModulesDialog'
import {
  BusinessRole,
  EFeatureView,
  ExtensionBaseProduct,
  IAdvancedModules,
  ICustomerInfo,
  IPrivateConfig,
  PrivateCloudProvider,
  PrivateIterationFrequency,
  PrivateLicenseType,
  QUOTATION_CONTENT_VERSION,
  SeatPricingMode,
  SeatTier,
  TabEnum,
} from './types'
import {
  AI_GIFT_POINTS,
  AI_POINT_UNIT_PRICE,
  AI_POINTS_OPTIONS,
  AI_POINTS_PER_PACK,
  EBasicConfigKey,
  PRIVATE_DEFAULT_AI_POINTS,
  type BillingMode,
} from './enums'
import { SEAT_TIERS } from './seatStorage'
import { useCountry } from '@/providers/Country'
import { CustomServiceContent } from './CustomServiceContent'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SEAT_UNMERGE_KEY, useNotBuyRows, useQuoteDetailData } from './QuoteDetailData'

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
  const [inputValue, setInputValue] = useState<string>(String(value))

  useEffect(() => {
    setInputValue(String(value))
  }, [value])

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
      <Input
        type="number"
        value={inputValue}
        disabled={disabled}
        onChange={(e) => {
          if (disabled) return
          const raw = e.target.value
          setInputValue(raw)
          if (raw === '') return
          const next = Number(raw)
          if (Number.isNaN(next)) return
          onChange(next < 0 ? 0 : next)
        }}
        onBlur={() => {
          if (disabled) return
          if (inputValue === '') {
            const fallback = typeof min === 'number' ? min : 0
            onChange(fallback)
            setInputValue(String(fallback))
            return
          }
          const parsed = Number(inputValue)
          if (Number.isNaN(parsed)) {
            const fallback = typeof min === 'number' ? min : 0
            onChange(fallback)
            setInputValue(String(fallback))
            return
          }
          let finalVal = parsed
          if (typeof min === 'number') finalVal = Math.max(min, finalVal)
          if (typeof max === 'number') finalVal = Math.min(max, finalVal)
          onChange(finalVal)
          setInputValue(String(finalVal))
        }}
        className={cn(
          'h-7 w-[70px] rounded-full bg-transparent px-2 text-center text-sm text-white',
          'appearance-none border-none [-moz-appearance:textfield]',
          '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
        )}
      />
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
const Label = twx.div`text-base font-normal leading-none text-white`
const HintParagraph = twx.p`text-xs text-white-50 font-light font-euclidlight`
const DesParagraph = twx.p`text-sm text-white-72 font-light font-euclidlight`

const LaunchBadge = ({ text }: { text: string }) => (
  <span className="rounded bg-[#112C25] px-[6px] py-[2px] text-[11px] leading-[16px] text-[#00E096]">
    🚩{text}
  </span>
)

const OrangeBadge = ({ text }: { text: string }) => (
  <span className="rounded bg-[#612500] px-[6px] py-[2px] text-[11px] leading-[16px] text-[#FA8C16]">
    {text}
  </span>
)

const PurpleBadge = ({ text }: { text: string }) => (
  <span className="rounded bg-[#520339] px-[6px] py-[2px] text-[11px] leading-[16px] text-[#EB2F96]">
    {text}
  </span>
)

const clampModuleDiscount = (val: number) =>
  Math.min(10, Math.max(1, Math.round(val * 10) / 10))

const BillingToggle: FC<{
  value: BillingMode
  onChange: (mode: BillingMode) => void
  discountValue?: number
  onDiscountChange?: (val: number | undefined) => void
}> = ({ value, onChange, discountValue, onDiscountChange }) => {
  const { t } = useTranslation('quotation')
  const items: BillingMode[] = ['paid', 'discount', 'gift']
  const [discountInput, setDiscountInput] = useState(
    discountValue !== undefined ? String(discountValue) : '',
  )

  useEffect(() => {
    setDiscountInput(discountValue !== undefined ? String(discountValue) : '')
  }, [discountValue])

  return (
    <div className="flex flex-col items-end gap-[11px]">
      <div className="flex h-6 w-[118px] items-center gap-0.5 rounded border border-white/20 bg-[#141414] p-[3px] text-xs">
        {items.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={cn(
              'flex h-[18px] w-9 items-center justify-center rounded text-white transition-colors',
              value === mode ? 'bg-[#444444]' : 'bg-transparent hover:bg-white/10',
            )}
          >
            {t(`billing.${mode}`)}
          </button>
        ))}
      </div>
      {value === 'discount' && onDiscountChange && (
        <div className="flex w-[118px] items-center gap-1.5">
          <Input
            type="number"
            min={1}
            max={10}
            step={0.1}
            value={discountInput}
            onChange={(e) => {
              const raw = e.target.value
              setDiscountInput(raw)
              if (raw === '') {
                onDiscountChange(undefined)
                return
              }
              const parsed = Number(raw)
              if (Number.isNaN(parsed)) return
              onDiscountChange(parsed)
            }}
            onBlur={() => {
              if (discountInput === '') {
                onDiscountChange(undefined)
                setDiscountInput('')
                return
              }
              const parsed = Number(discountInput)
              if (Number.isNaN(parsed)) {
                onDiscountChange(undefined)
                setDiscountInput('')
                return
              }
              const next = clampModuleDiscount(parsed)
              onDiscountChange(next)
              setDiscountInput(String(next))
            }}
            className={cn(
              'h-[30px] w-[93px] rounded-none border-2 border-white/20 bg-transparent px-2 text-center text-sm font-medium text-white',
              'appearance-none [-moz-appearance:textfield]',
              '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
            )}
            placeholder="1-10"
          />
          <span className="shrink-0 text-sm text-white">{t('discount.unit')}</span>
        </div>
      )}
    </div>
  )
}

/** 合并到主报价：模块价格并入 DAM（未选则 GEA）行，模块本身只列名称 */
const MergeToBasicIcon: FC<{ isMerged: boolean; onToggle: () => void }> = ({
  isMerged,
  onToggle,
}) => {
  const { t } = useTranslation('quotation')
  const [isHovered, setIsHovered] = useState(false)
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
              'flex size-[22px] shrink-0 items-center justify-center rounded transition-colors',
              isMerged ? 'bg-[#3366FF]' : isHovered ? 'bg-[#3A3A3A]' : 'text-[#BFBFBF]',
            )}
          >
            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-[14px]"
            >
              <path
                d="M4.46219 3.41343H10.8339V1.1576C10.8339 0.514488 10.3095 0 9.67633 0H1.1576C0.524382 0 0 0.524382 0 1.1576V9.67633C0 10.3194 0.524382 10.8339 1.1576 10.8339H3.75972V4.10601C3.75972 3.73004 4.07632 3.41343 4.46219 3.41343Z"
                fill={svgColor}
              />
              <path
                d="M13.1887 3.41309H10.834V10.141C10.834 10.5269 10.5174 10.8435 10.1315 10.8435H3.75977V12.8421C3.75977 13.4852 4.28415 13.9997 4.91736 13.9997H13.1788C13.822 13.9997 14.3364 13.4753 14.3364 12.8421V4.57068C14.3463 3.93747 13.822 3.41309 13.1887 3.41309Z"
                fill={svgColor}
              />
              <path
                d="M9.61668 6.31245H7.86545V4.55132C7.86545 4.40291 7.74672 4.28418 7.59831 4.28418H6.75732C6.60891 4.28418 6.49018 4.40291 6.49018 4.55132V6.31245H4.72905C4.58064 6.31245 4.46191 6.43118 4.46191 6.57959V7.42058C4.46191 7.56899 4.58064 7.68771 4.72905 7.68771H6.48029V9.44884C6.48029 9.59725 6.59902 9.71598 6.74743 9.71598H7.58842C7.73683 9.71598 7.85555 9.59725 7.85555 9.44884V7.68771H9.61668C9.76509 7.68771 9.88382 7.56899 9.88382 7.42058V6.57959C9.88382 6.43118 9.76509 6.31245 9.61668 6.31245Z"
                fill={svgColor}
              />
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

const Cost = ({
  cost,
  costTitle,
  oneTimeCost,
}: {
  cost: number
  costTitle?: string
  /** 一次性费用（如私有化实施费）：单独成行，不带 /年 后缀 */
  oneTimeCost?: number
}) => {
  const { t } = useTranslation('quotation')
  const { prefix } = usePricing()
  return (
    <div className="space-y-3 border-t border-[rgba(255,255,255,0.1)] pt-4">
      <div className="flex items-center justify-between text-white">
        <Label className="text-lg font-normal">{costTitle ?? t('base.cost')}</Label>
        <span className="flex items-center text-xl font-medium">
          {prefix}
          {formatWithToLocaleString(cost)}
          <span className="text-sm">{t('per.year')}</span>
        </span>
      </div>
      {!!oneTimeCost && (
        <div className="flex items-center justify-between text-white">
          <Label className="text-lg font-normal">{t('price.oneTime')}</Label>
          <span className="flex items-center text-xl font-medium">
            {prefix}
            {formatWithToLocaleString(oneTimeCost)}
          </span>
        </div>
      )}
    </div>
  )
}

export const LeftContent: FC<{ user?: SessionUser }> = ({ user }) => {
  const { t } = useTranslation('quotation')
  const basicConfigs = useBasicConfigs()
  const moduleGroups = useAdvancedModuleGroups()
  const {
    pricing,
    currentPricing,
    prefix,
    giftThreshold: aiPointsGiftThreshold,
  } = usePricing()
  const { isInChina } = useCountry()
  const isGlobal = !isInChina
  const { toast } = useToast()
  const router = useRouter()
  const { language } = useLanguage()
  const {
    rows: quoteRows,
    subtotal,
    discountTotal,
    noTaxTotalNum,
    discountTotalNum,
    totalNumPerYear,
    years,
    basicCostPerYear,
    extensionCostPerYear,
    saasPaidTotalPerYear,
    saasLicenseBasePerYear,
  } = useQuoteDetailData()

  const [openDiscount, setOpenDiscount] = useState(false)
  /** 「展示未选模块报价」的模块勾选弹窗 */
  const [noBuyDialogOpen, setNoBuyDialogOpen] = useState(false)
  const noBuyCandidates = useNotBuyRows(quoteRows)
  const [openCustomDiscount, setOpenCustomDiscount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  const {
    customerInfo,
    setCustomerInfo,
    activeTab,
    setActiveTab,
    businessRole,
    setBusinessRole,
    advancedConfig,
    setAdvancedConfig,
    advancedModules,
    setAdvancedModules,
    basicConfig,
    setBasicConfig,
    subscriptionYears,
    setSubscriptionYears,
    featureView,
    setFeatureView,
    discount,
    setDiscount,
    customDiscount,
    setCustomDiscount,
    rowDiscounts,
    setRowDiscounts,
    showNoBuyFeature,
    setShowNoBuyFeature,
    noBuyModuleKeys,
    setNoBuyModuleKeys,
    pricingSnapshot,
    editInfo,
    advancedModulePriceOverrides,
    setAdvancedModulePriceOverride,
    moduleBillingModes,
    setModuleBillingMode,
    setModuleBillingModes,
    moduleVariants,
    setModuleVariant,
    moduleMultiSelections,
    setModuleMultiSelection,
    setModuleMultiSelections,
    mergedToBasicModules,
    setMergedToBasicModules,
    toggleMergeToBasic,
    privateConfig,
    setPrivateConfig,
    privateImplProducts,
    setPrivateImplProducts,
    customServices,
  } = useQuotationStore()
  const editId = editInfo?.id

  const visibleModuleGroups = useMemo(
    () =>
      moduleGroups.filter((group) => {
        const base = group.baseProduct ?? 'dam'
        if (base === 'dam') return advancedConfig.geaDam
        if (base === 'gea') return advancedConfig.geaContext
        return true
      }),
    [moduleGroups, advancedConfig.geaDam, advancedConfig.geaContext],
  )

  const damModuleGroups = useMemo(
    () => visibleModuleGroups.filter((g) => (g.baseProduct ?? 'dam') === 'dam'),
    [visibleModuleGroups],
  )
  const geaModuleGroups = useMemo(
    () => visibleModuleGroups.filter((g) => g.baseProduct === 'gea'),
    [visibleModuleGroups],
  )
  const damAllCollapsed =
    damModuleGroups.length > 0 && damModuleGroups.every((g) => collapsedGroups[g.id])
  const geaAllCollapsed =
    geaModuleGroups.length > 0 && geaModuleGroups.every((g) => collapsedGroups[g.id])

  const setProductGroupsCollapsed = (base: 'dam' | 'gea', collapsed: boolean) => {
    const groups = base === 'dam' ? damModuleGroups : geaModuleGroups
    setCollapsedGroups((prev) => {
      const next = { ...prev }
      groups.forEach((g) => {
        next[g.id] = collapsed
      })
      return next
    })
  }

  const showDamExtensions = advancedConfig.geaDam
  const showGeaExtensions = advancedConfig.geaContext && moduleGroups.some((g) => g.baseProduct === 'gea')
  const aiPointsPackMode = (moduleBillingModes[EGeaBaseModules.AI_POINTS_PACK] ?? 'paid') as BillingMode
  /** AI 点数包固定 5 万点，规格选择在「AI 点数订阅」行 */
  const aiPointsSelected = AI_GIFT_POINTS
  const aiPointsValue = aiPointsSelected * AI_POINT_UNIT_PRICE
  /** AI 点数订阅规格（单价由 useBasicConfigs 按规格换算） */
  const aiPointsOption = advancedConfig.aiPointsOption ?? AI_POINTS_DEFAULT_OPTION
  const userBusinessRoles = useMemo<BusinessRole[]>(() => {
    return user?.businessRoles ?? []
  }, [user])
  const loginBusinessRole = useMemo<BusinessRole | undefined>(() => {
    if (userBusinessRoles.length === 1) return userBusinessRoles[0]
    return undefined
  }, [userBusinessRoles])
  // const canSwitchBusinessRole = true
  const canSwitchBusinessRole = userBusinessRoles.includes('muse') && userBusinessRoles.includes('pod')

  useEffect(() => {
    if (editInfo) setOpenDiscount(editInfo.discount !== undefined)
  }, [editInfo])

  useEffect(() => {
    setOpenCustomDiscount(customDiscount !== undefined)
  }, [customDiscount])

  // 【优惠设置】/【定制服务折扣】变更后，报价单「优惠折扣」列回到新的默认值
  useEffect(() => {
    setRowDiscounts({})
  }, [discount, customDiscount, setRowDiscounts])

  useEffect(() => {
    if (activeTab === TabEnum.BASIC) setDiscount(undefined)
  }, [activeTab, setDiscount])

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!user) return
    if (loginBusinessRole && businessRole !== loginBusinessRole) {
      setBusinessRole(loginBusinessRole)
      // 席位计价方式与起售量跟随角色：Pod 按档位 / 10 席起，Muse 按席位 / 5 席起
      setAdvancedConfig({
        ...advancedConfig,
        seatPricingMode: loginBusinessRole === 'pod' ? 'byTier' : 'bySeat',
        memberSeats: Math.max(loginBusinessRole === 'pod' ? 10 : 5, advancedConfig.memberSeats),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loginBusinessRole, userBusinessRoles, businessRole, setBusinessRole])

  const tabs = [
    { key: TabEnum.ADVANCED, label: t('tab.saas'), enabled: true },
    { key: TabEnum.PRIVATE, label: t('tab.private'), enabled: true },
    { key: TabEnum.CUSTOM, label: t('tab.custom'), enabled: true },
  ]

  const updatePrivateConfig = (patch: Partial<IPrivateConfig>) => {
    setPrivateConfig({ ...privateConfig, ...patch })
  }

  const updateQuantity = (field: string, value: number) => {
    if (activeTab === TabEnum.BASIC) {
      setBasicConfig({ ...basicConfig, [field]: Math.max(0, value) })
    } else {
      setAdvancedConfig({ ...advancedConfig, [field]: Math.max(0, value) })
    }
  }

  const handleInputChange = (field: keyof ICustomerInfo, value: string) => {
    setCustomerInfo({ ...customerInfo, [field]: value })
  }

  const clearExtensionModulesForBase = useCallback(
    (base: ExtensionBaseProduct) => {
      const keys: EAdvancedModules[] = []
      const collect = (modules: IModules[]) => {
        modules.forEach((m) => {
          keys.push(m.key)
          if (m.subModules?.length) collect(m.subModules)
        })
      }
      moduleGroups
        .filter((g) => (g.baseProduct ?? 'dam') === base)
        .forEach((g) => collect(g.modules))

      if (!keys.length) return

      setAdvancedModules((st) => {
        const next = { ...st }
        keys.forEach((key) => {
          if (typeof next[key] === 'number') next[key] = 0
          else next[key] = false
        })
        return next
      })
      setModuleBillingModes((prev) => {
        const next = { ...prev }
        keys.forEach((key) => {
          delete next[key]
        })
        return next
      })
      setModuleMultiSelections((prev) => {
        const next = { ...prev }
        keys.forEach((key) => {
          delete next[key]
        })
        return next
      })
    },
    [moduleGroups, setAdvancedModules, setModuleBillingModes, setModuleMultiSelections],
  )

  /** DAM / GEA 至少选一个；取消某基础模块时清空其拓展模块 */
  const handleGeaBaseChange = (field: 'geaDam' | 'geaContext', checked: boolean) => {
    if (!checked) {
      const otherSelected =
        field === 'geaDam' ? advancedConfig.geaContext : advancedConfig.geaDam
      if (!otherSelected) return
      clearExtensionModulesForBase(field === 'geaDam' ? 'dam' : 'gea')
    }
    setAdvancedConfig({ ...advancedConfig, [field]: checked })
  }

  const handleBusinessRoleChange = (role: BusinessRole) => {
    setBusinessRole(role)
    // 起售席位：Pod 10 席、Muse 5 席；切换角色时把低于起售量的席位补齐
    const seatMin = role === 'pod' ? 10 : 5
    const nextSeats = Math.max(seatMin, advancedConfig.memberSeats)
    setAdvancedConfig({
      ...advancedConfig,
      memberSeats: nextSeats,
      // Pod 默认按档位计价，Muse 默认按席位
      seatPricingMode: role === 'pod' ? 'byTier' : 'bySeat',
      ...(aiPointsPackMode === 'gift'
        ? { geaAiPointsPack: aiPointsSelected / AI_POINTS_PER_PACK }
        : {}),
    })
  }

  const handleAiPointsPackBillingChange = (mode: BillingMode) => {
    setModuleBillingMode(EGeaBaseModules.AI_POINTS_PACK, mode)
    if (mode === 'gift') {
      setAdvancedConfig({
        ...advancedConfig,
        geaAiPointsPack: aiPointsSelected / AI_POINTS_PER_PACK,
      })
    }
  }

  const syncSaasFromPrivateProduct = (product: EPrivateImplProducts, checked: boolean) => {
    const map = PRIVATE_IMPL_SAAS_MAP[product]
    if (map.configKey) {
      // 与 SaaS 基础模块共用「至少选一个」约束
      handleGeaBaseChange(map.configKey, checked)
      return
    }
    if (map.moduleKey) {
      setAdvancedModules((st) => ({ ...st, [map.moduleKey!]: checked }))
      return
    }
    if (map.anyModuleKeys?.length) {
      if (product === EPrivateImplProducts.MUSE_AI) {
        setAdvancedModules((st) => {
          const next = { ...st }
          MUSE_AI_VARIANT_KEYS.forEach((k) => {
            next[k] = false
          })
          if (checked) next[EAdvancedModules.MUSE_AI_BASIC] = true
          return next
        })
        return
      }
      if (product === EPrivateImplProducts.CLIPO_REMIX) {
        setAdvancedModules((st) => {
          const next = { ...st }
          CLIPO_REMIX_VARIANT_KEYS.forEach((k) => {
            next[k] = false
          })
          next[EAdvancedModules.CLIPO_REMIX] = false
          if (checked) next[EAdvancedModules.CLIPO_REMIX_BEE] = true
          return next
        })
        return
      }
      // IngenOps：至少勾选「批量套版」
      setAdvancedModules((st) => ({
        ...st,
        [EAdvancedModules.BATCH_TEMPLATING]: checked,
      }))
    }
  }

  const handlePrivateImplChange = (product: EPrivateImplProducts, checked: boolean) => {
    const saasForced = isSaasProductSelected(product, advancedConfig, advancedModules)
    // 仅 SaaS 带过来、私有化未主动勾选的项锁定，不可取消
    if (!checked && saasForced && !privateImplProducts[product]) return

    const map = PRIVATE_IMPL_SAAS_MAP[product]
    // DAM / GEA 不能全部取消
    if (!checked && map.configKey) {
      const otherSelected =
        map.configKey === 'geaDam' ? advancedConfig.geaContext : advancedConfig.geaDam
      if (!otherSelected) return
    }

    setPrivateImplProducts((st) => ({ ...st, [product]: checked }))
    // 私有化侧勾选 / 取消时，同步 SaaS 对应产品
    syncSaasFromPrivateProduct(product, checked)
  }

  const handleModuleChange = (
    module: keyof IAdvancedModules,
    checked: boolean | number,
  ) => {
    setAdvancedModules((st) => ({ ...st, [module]: checked }))
    // 取消勾选后不再参与合并到主报价
    if (!checked) {
      setMergedToBasicModules((prev) => {
        if (!prev.has(module as EAdvancedModules)) return prev
        const next = new Set(prev)
        next.delete(module as EAdvancedModules)
        return next
      })
    }
  }

  /** 取消父模块时递归清空其子模块的勾选、多选与计费方式 */
  const clearDescendants = useCallback(
    (module: IModules) => {
      const keys: EAdvancedModules[] = []
      const collect = (list: IModules[]) => {
        list.forEach((m) => {
          keys.push(m.key)
          if (m.subModules?.length) collect(m.subModules)
        })
      }
      if (module.subModules?.length) collect(module.subModules)
      if (!keys.length) return

      setAdvancedModules((st) => {
        const next = { ...st }
        keys.forEach((k) => {
          next[k] = typeof next[k] === 'number' ? 0 : false
        })
        return next
      })
      setModuleMultiSelections((prev) => {
        const next = { ...prev }
        keys.forEach((k) => delete next[k])
        return next
      })
      setModuleBillingModes((prev) => {
        const next = { ...prev }
        keys.forEach((k) => delete next[k])
        return next
      })
    },
    [setAdvancedModules, setModuleMultiSelections, setModuleBillingModes],
  )

  const formInfo = [
    { id: 'company' as const, label: t('customer.company'), required: true },
    { id: 'contact' as const, label: t('customer.contact') },
    { id: 'email' as const, label: t('customer.email') },
    { id: 'yourEmail' as const, label: t('your.email'), required: true },
  ]

  const privateLicenseFee = useMemo(
    () =>
      calcPrivateLicenseFee(privateConfig.licenseType, saasLicenseBasePerYear, {
        perpetualBuyout: pricing.private.perpetualBuyout,
        sourceMultiplier: pricing.private.sourceMultiplier,
      }),
    [privateConfig.licenseType, saasLicenseBasePerYear, pricing.private],
  )

  const privateBasicMaintenanceFee = useMemo(() => {
    const base =
      privateConfig.licenseEnabled && privateConfig.licenseType !== 'perpetual'
        ? privateLicenseFee
        : saasLicenseBasePerYear
    return calcPrivateBasicMaintenance(base, pricing.private.basicMaintenanceRate)
  }, [
    privateConfig.licenseEnabled,
    privateConfig.licenseType,
    privateLicenseFee,
    saasLicenseBasePerYear,
    pricing.private.basicMaintenanceRate,
  ])

  /** 基础配置项的「合并到主报价」按钮；无主报价行（DAM / GEA 均未选）时不展示 */
  const renderBasicMergeIcon = (mergeKey: string) => {
    if (!advancedConfig.geaDam && !advancedConfig.geaContext) return null
    // 席位存的是「取消合并」标记，默认合并
    const inverted = mergeKey === SEAT_UNMERGE_KEY
    const flagged = mergedToBasicModules.has(mergeKey as EAdvancedModules)
    return (
      <MergeToBasicIcon
        isMerged={inverted ? !flagged : flagged}
        onToggle={() => toggleMergeToBasic(mergeKey as EAdvancedModules)}
      />
    )
  }

  // 私有化开启时「部署实施」「产品运营及维护」「基础维护」恒为必选（兼容历史报价里未勾选的情况）
  useEffect(() => {
    if (!privateConfig.enabled) return
    const patch: Partial<IPrivateConfig> = {}
    if (!privateConfig.implementationEnabled) patch.implementationEnabled = true
    if (!privateConfig.opsEnabled) patch.opsEnabled = true
    if (!privateConfig.basicMaintenance) patch.basicMaintenance = true
    if (Object.keys(patch).length) updatePrivateConfig(patch)
  }, [
    privateConfig.enabled,
    privateConfig.implementationEnabled,
    privateConfig.opsEnabled,
    privateConfig.basicMaintenance,
  ])

  /** 切换「展示未选模块报价」：选「展示」时弹窗勾选要列出的模块 */
  const handleShowNoBuyChange = (next: boolean) => {
    setShowNoBuyFeature(next)
    if (next) setNoBuyDialogOpen(true)
    else setNoBuyModuleKeys(undefined)
  }

  /** 私有化开启时 SaaS 侧的付费点数项禁用（赠送不受限，仍可勾选） */
  const saasAiPointsLocked = privateConfig.enabled && aiPointsPackMode !== 'gift'

  // 私有化部署的 AI 点数包独立配置，开启后 SaaS 侧的付费点数项置 0（UI 同时禁用）
  useEffect(() => {
    if (!privateConfig.enabled) return
    const patch: Partial<typeof advancedConfig> = {}
    if (aiPointsPackMode !== 'gift' && advancedConfig.geaAiPointsPack > 0) {
      patch.geaAiPointsPack = 0
    }
    if ((advancedConfig.aiPoints ?? 0) > 0) patch.aiPoints = 0
    // 私有化不含存储空间
    if (advancedConfig.storageSpace > 0) patch.storageSpace = 0
    if (advancedConfig.enableColdHotStorage) patch.enableColdHotStorage = false
    if (advancedConfig.enableMultiRegionStorage) patch.enableMultiRegionStorage = false
    if (Object.keys(patch).length) setAdvancedConfig({ ...advancedConfig, ...patch })
  }, [privateConfig.enabled, aiPointsPackMode, advancedConfig, setAdvancedConfig])

  const privateOpsAnnual = useMemo(() => {
    if (!privateConfig.enabled || !privateConfig.opsEnabled) return 0
    let total = 0
    if (privateConfig.basicMaintenance) total += privateBasicMaintenanceFee
    if (privateConfig.versionIteration) {
      total += pricing.private.iterationPrices[privateConfig.iterationFrequency] ?? 0
    }
    return total
  }, [privateConfig, pricing.private, privateBasicMaintenanceFee])

  const privateImplProductList: {
    key: EPrivateImplProducts
    label: string
    price: number
  }[] = [
      {
        key: EPrivateImplProducts.DAM,
        label: t('gea.dam'),
        // 阿里云 / AWS 之外的云平台，DAM 实施费单独定价
        price: getPrivateImplPrice(
          EPrivateImplProducts.DAM,
          pricing.private.implProducts,
          privateConfig.cloudProvider,
        ),
      },
      {
        key: EPrivateImplProducts.GEA_CONTEXT,
        label: t('gea.context'),
        price: pricing.private.implProducts[EPrivateImplProducts.GEA_CONTEXT],
      },
      {
        key: EPrivateImplProducts.MUSE_AI,
        label: t('module.museAI'),
        price: pricing.private.implProducts[EPrivateImplProducts.MUSE_AI],
      },
      {
        key: EPrivateImplProducts.INGEN_OPS,
        label: t('module.ingenOps'),
        price: pricing.private.implProducts[EPrivateImplProducts.INGEN_OPS],
      },
      {
        key: EPrivateImplProducts.CLIPO_REMIX,
        label: t('module.clipoRemix'),
        price: pricing.private.implProducts[EPrivateImplProducts.CLIPO_REMIX],
      },
    ]

  const licenseTypeOptions: { value: PrivateLicenseType; label: string }[] = [
    { value: 'encrypted', label: t('private.license.encrypted') },
    { value: 'source', label: t('private.license.source') },
    { value: 'perpetual', label: t('private.license.perpetual') },
  ]

  const cloudProviderOptions: { value: PrivateCloudProvider; label: string }[] = [
    { value: 'aliyun', label: t('private.cloud.aliyun') },
    { value: 'aws', label: t('private.cloud.aws') },
    { value: 'tencent', label: t('private.cloud.tencent') },
    { value: 'huawei', label: t('private.cloud.huawei') },
  ]

  const privateImplTotal =
    privateConfig.enabled && privateConfig.implementationEnabled
      ? privateImplProductList.reduce((sum, item) => {
        const checked =
          isSaasProductSelected(item.key, advancedConfig, advancedModules) ||
          !!privateImplProducts[item.key]
        return checked ? sum + item.price : sum
      }, 0)
      : 0

  /** 私有化 API 点数：规格 × 份数 × 单价（点数包按 1 万点/份计价） */
  const privateAiPoints = privateConfig.aiPointsOption ?? PRIVATE_DEFAULT_AI_POINTS
  const privateAiPointsQty = privateConfig.aiPointsQty ?? 1
  const privateAiPointsFee = privateConfig.aiPointsEnabled
    ? (privateAiPoints / AI_POINTS_PER_PACK) * pricing.advanced.geaAiPackPrice * privateAiPointsQty
    : 0

  /** 永久买断为一次性；其余授权方式按年 */
  const privateLicenseIsOneTime = privateConfig.licenseType === 'perpetual'
  /** 私有化年费：软件授权费（非买断）+ 运维 + AI 点数包 */
  const privateAnnualTotal =
    (privateConfig.licenseEnabled && !privateLicenseIsOneTime ? privateLicenseFee : 0) +
    privateOpsAnnual +
    privateAiPointsFee
  /** 私有化一次性费用：部署实施费（+ 永久买断授权费） */
  const privateOneTimeDisplayTotal =
    privateImplTotal +
    (privateConfig.licenseEnabled && privateLicenseIsOneTime ? privateLicenseFee : 0)

  const handleGenerate = useCallback(async () => {
    if (!user?.orgId || !user.token) {
      toast({
        duration: 2000,
        description: '您当前所在的团队无生成报价单权限',
      })
      return
    }
    setLoading(true)
    const content = {
      activeTab,
      businessRole,
      advancedModules,
      advancedConfig,
      advancedModulePriceOverrides,
      moduleBillingModes,
      moduleVariants,
      moduleMultiSelections,
      privateConfig,
      privateImplProducts,
      customServices,
      customDiscount,
      rowDiscounts,
      mergedToBasicModules: Array.from(mergedToBasicModules),
      prefix,
      featureView,
      showNoBuyFeature,
      noBuyModuleKeys,
      lang: language,
      // 冻结刊例价：新报价单存当前价；编辑历史报价单时保留其原有快照
      pricingSnapshot: pricingSnapshot ?? currentPricing,
      contentVersion: QUOTATION_CONTENT_VERSION,
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
    } catch (err: any) {
      toast({
        description: err.message ?? '报价单保存失败',
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }, [
    user,
    activeTab,
    businessRole,
    advancedModules,
    advancedConfig,
    advancedModulePriceOverrides,
    moduleBillingModes,
    moduleVariants,
    moduleMultiSelections,
    privateConfig,
    privateImplProducts,
    customServices,
    customDiscount,
    rowDiscounts,
    mergedToBasicModules,
    prefix,
    featureView,
    showNoBuyFeature,
    noBuyModuleKeys,
    pricingSnapshot,
    currentPricing,
    language,
    toast,
    customerInfo,
    totalNumPerYear,
    discount,
    years,
    editId,
    isGlobal,
    router,
  ])

  const displayPrice = (key: string, listPrice: number) => {
    const mode = moduleBillingModes[key as EAdvancedModules] ?? 'paid'
    if (mode === 'gift') return 0
    if (mode === 'discount') {
      const rate = advancedModulePriceOverrides[key as EAdvancedModules]
      if (typeof rate === 'number') return listPrice * (clampModuleDiscount(rate) / 10)
      return listPrice
    }
    return listPrice
  }

  /** 整单刊例：整体折后价 ÷ 折前价（中文显示折扣数，其余语言显示 % OFF），最多保留 2 位小数 */
  const overallDiscountText = useMemo(() => {
    const ratio = noTaxTotalNum ? discountTotalNum / noTaxTotalNum : 1
    const val = language === 'zh-CN' ? ratio * 10 : (1 - ratio) * 100
    // 去掉多余的 0：8 → 「8」，9.4 → 「9.4」，9.412 → 「9.41」
    return String(Math.round(val * 100) / 100)
  }, [noTaxTotalNum, discountTotalNum, language])

  /** SaaS 折后年总价：仅作赠送门槛判断，不在 UI 展示 */
  const saasDiscountedTotalPerYear = useMemo(
    () => saasPaidTotalPerYear * ((discount ?? 10) / 10),
    [saasPaidTotalPerYear, discount],
  )

  /**
   * 该模块当前对 SaaS 折后年价的贡献；判断赠送门槛时需要先扣掉自身价格
   * （走查：「不算它本身的价格 > 20w 才显示可选赠送」）
   */
  const ownDiscountedContribution = useCallback(
    (key: EAdvancedModules | EGeaBaseModules, listPrice: number) => {
      const mode = (moduleBillingModes[key] ?? 'paid') as BillingMode
      if (mode === 'gift') return 0
      const raw = advancedModules[key as EAdvancedModules]
      const qty = typeof raw === 'number' ? raw : raw ? 1 : 0
      if (qty <= 0) return 0
      const rate = advancedModulePriceOverrides[key]
      const unit =
        mode === 'discount' && typeof rate === 'number'
          ? listPrice * (clampModuleDiscount(rate) / 10)
          : listPrice
      return unit * qty * ((discount ?? 10) / 10)
    },
    [moduleBillingModes, advancedModules, advancedModulePriceOverrides, discount],
  )

  const isGiftAllowed = (
    threshold?: number,
    key?: EAdvancedModules | EGeaBaseModules,
    listPrice?: number,
  ) => {
    if (!threshold) return true
    const own =
      key !== undefined && typeof listPrice === 'number'
        ? ownDiscountedContribution(key, listPrice)
        : 0
    return saasDiscountedTotalPerYear - own >= threshold
  }

  // 门槛不满足时，隐藏切换控件并回退为付费，避免残留折扣/赠送价
  useEffect(() => {
    const resetIfNeeded = (
      key: EAdvancedModules | EGeaBaseModules,
      threshold?: number,
      listPrice?: number,
    ) => {
      if (!threshold) return
      const own = typeof listPrice === 'number' ? ownDiscountedContribution(key, listPrice) : 0
      if (saasDiscountedTotalPerYear - own >= threshold) return
      const mode = moduleBillingModes[key]
      if (mode && mode !== 'paid') setModuleBillingMode(key, 'paid')
    }

    resetIfNeeded(
      EGeaBaseModules.AI_POINTS_PACK,
      aiPointsGiftThreshold,
      pricing.advanced.geaAiPackPrice,
    )

    const walk = (modules: IModules[]) => {
      modules.forEach((m) => {
        if (m.giftEligible) resetIfNeeded(m.key, m.giftThreshold, m.price)
        if (m.subModules?.length) walk(m.subModules)
      })
    }
    moduleGroups.forEach((g) => walk(g.modules))
  }, [
    saasDiscountedTotalPerYear,
    moduleBillingModes,
    moduleGroups,
    setModuleBillingMode,
    ownDiscountedContribution,
    pricing.advanced.geaAiPackPrice,
    aiPointsGiftThreshold,
  ])

  /** 扁平化后的模块配置，便于按 key 查找依赖的父模块 */
  const moduleByKey = useMemo(() => {
    const map = new Map<EAdvancedModules, IModules>()
    const walk = (modules: IModules[]) => {
      modules.forEach((m) => {
        map.set(m.key, m)
        if (m.subModules?.length) walk(m.subModules)
      })
    }
    moduleGroups.forEach((g) => walk(g.modules))
    return map
  }, [moduleGroups])

  /** 模块是否算「已选」：多选型模块（如电商分发）需至少选中一个渠道 */
  const isModuleSelected = useCallback(
    (key: EAdvancedModules) => {
      const raw = advancedModules[key]
      const qty = typeof raw === 'number' ? raw : raw ? 1 : 0
      if (qty <= 0) return false
      if (moduleByKey.get(key)?.multiOptions?.length) {
        return (moduleMultiSelections[key] ?? []).length > 0
      }
      return true
    },
    [advancedModules, moduleMultiSelections, moduleByKey],
  )

  // 依赖的父模块未选时（如「电商分发」一个渠道都没选），自动取消勾选依赖模块
  useEffect(() => {
    moduleByKey.forEach((m, key) => {
      if (!m.requires || isModuleSelected(m.requires)) return
      const raw = advancedModules[key]
      if (raw) handleModuleChange(key, typeof raw === 'number' ? 0 : false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleByKey, isModuleSelected, advancedModules])

  /** 渲染分组内的模块：`groupWithPrev` 的模块与上一个模块同处一块，中间不画分割线 */
  const renderGroupModules = (modules: IModules[]) => {
    const blocks: IModules[][] = []
    modules.forEach((m) => {
      if (m.groupWithPrev && blocks.length) blocks[blocks.length - 1].push(m)
      else blocks.push([m])
    })
    return blocks.map((block) => (
      <div key={block[0].key} className="space-y-5 py-5 first:pt-0 last:pb-0">
        {block.map((m) => renderModuleItem(m))}
      </div>
    ))
  }

  const countSelectedInGroup = (modules: IModules[]) => {
    let selected = 0
    let total = 0
    const walk = (list: IModules[]) => {
      list.forEach((m) => {
        // 分组容器（社媒分发 / IngenOps 等）：只统计子项
        if (m.noCheckBox && m.noPrice && m.subModules?.length) {
          walk(m.subModules)
          return
        }
        if (m.noCheckBox && m.subModules?.length) {
          m.subModules.forEach((sub) => {
            total += 1
            if (advancedModules[sub.key]) selected += 1
          })
          return
        }
        total += 1
        if (advancedModules[m.key]) selected += 1
      })
    }
    walk(modules)
    return { selected, total }
  }

  const renderModuleItem = (module: IModules, isSub = false) => {
    const {
      key,
      min,
      unit,
      noCheckBox,
      giftEligible,
      giftBadge,
      giftThreshold,
      launchTag,
      variantOptions,
      multiOptions,
      oneTime,
      requires,
      tag,
      boxed,
      multiCols,
      indent,
    } = module
    const mode = (moduleBillingModes[key] ?? 'paid') as BillingMode
    const price = displayPrice(key, module.price)
    const giftOk = isGiftAllowed(giftThreshold, key, module.price)
    const parentOk = !requires || isModuleSelected(requires)
    const checked = !!advancedModules[key]
    /**
     * 「合并到主报价」仅对可勾选、且已勾选的独立模块开放；
     * 容器类（SSO / 海外加速）与子模块不参与。
     */
    const canMergeToBasic =
      !isSub &&
      !noCheckBox &&
      !module.noPrice &&
      checked &&
      key !== EAdvancedModules.ENTERPRISE_SSO &&
      key !== EAdvancedModules.GA_CONTAINER

    if (noCheckBox && module.subModules?.length && module.noPrice) {
      const isGrid = module.subFlex === 'row'
      return (
        <div key={key} className="space-y-4">
          <div className="flex items-start space-x-2">
            <div className="flex h-[22px] shrink-0 items-center">
              <div className="size-4" />
            </div>
            <div className="space-y-[6px]">
              <Label className="flex flex-wrap items-center gap-2 font-normal text-white">
                {module.label}
                {module.description && (
                  <ModuleInfoIcon description={module.description} skuKey={key} />
                )}
              </Label>
              {module.hint && <HintParagraph>{module.hint}</HintParagraph>}
            </div>
          </div>
          <div className={cn(isGrid ? 'grid gap-3 md:grid-cols-2' : 'space-y-4')}>
            {module.subModules.map((sub) => renderModuleItem(sub, true))}
          </div>
        </div>
      )
    }

    const body = (
      <div className="space-y-3">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div
            className={cn(
              'flex items-start',
              !boxed && !(noCheckBox && multiOptions) && 'space-x-2',
              // 无 checkbox 的多选容器（分发渠道 / 电商分发）与同级模块对齐
              indent && 'ml-6',
            )}
          >
            {!boxed && !(noCheckBox && multiOptions) && (
              <div className="flex h-[22px] shrink-0 items-center">
                {noCheckBox ? (
                  <div className="size-4" />
                ) : (
                  <Checkbox
                    disabled={module.disabled || !parentOk}
                    id={key}
                    checked={checked}
                    onCheckedChange={(c: boolean) => {
                      const nextVal = min !== undefined ? (c ? Math.max(min, 1) : 0) : c
                      // MuseAI / Clipo 版本互斥
                      const museAiExclusive = (MUSE_AI_VARIANT_KEYS as readonly string[]).includes(
                        key,
                      )
                      const clipoExclusive = (CLIPO_REMIX_VARIANT_KEYS as readonly string[]).includes(
                        key,
                      )
                      if (c && (museAiExclusive || clipoExclusive)) {
                        const group = museAiExclusive
                          ? MUSE_AI_VARIANT_KEYS
                          : CLIPO_REMIX_VARIANT_KEYS
                        setAdvancedModules((st) => {
                          const next = { ...st, [key]: nextVal }
                          group.forEach((k) => {
                            if (k !== key) next[k] = false
                          })
                          if (clipoExclusive) next[EAdvancedModules.CLIPO_REMIX] = false
                          return next
                        })
                      } else {
                        handleModuleChange(key, nextVal)
                      }
                      // 取消整体模块时，其子项（特征库 / 区域合规拓展等）也一并取消
                      if (!c) clearDescendants(module)
                      if (c && variantOptions?.length && !moduleVariants[key]) {
                        setModuleVariant(key, variantOptions[0].value)
                      }
                    }}
                    className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                  />
                )}
              </div>
            )}
            <div className="space-y-[6px]">
              <Label className="flex min-h-[22px] flex-wrap items-center gap-2 font-normal">
                <span>{module.label}</span>
                {module.description && (
                  // 有版本档位时 SKU 挂在各档位上（如飞书云盘导入-基础版/高阶版），父级不再展示
                  <ModuleInfoIcon
                    description={module.description}
                    skuKey={variantOptions?.length ? undefined : key}
                  />
                )}
                {canMergeToBasic && (
                  <MergeToBasicIcon
                    isMerged={mergedToBasicModules.has(key)}
                    onToggle={() => toggleMergeToBasic(key)}
                  />
                )}
                {tag && (
                  <span className="rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px] text-sm">
                    {tag}
                  </span>
                )}
                {giftEligible && giftOk && giftBadge && <OrangeBadge text={giftBadge} />}
                {launchTag && <LaunchBadge text={launchTag} />}
                {key === EAdvancedModules.ENTERPRISE_SSO && <PurpleBadge text={t('badge.noTrial')} />}
              </Label>
              {module.hint && <HintParagraph>{module.hint}</HintParagraph>}
              {/* 有版本档位时价格展示在档位卡片内，主行不再重复 */}
              {!module.noPrice && !variantOptions?.length && (
                <DesParagraph>
                  {mode === 'gift' || price === 0
                    ? t('free')
                    : module.priceText ??
                    `${prefix} ${formatWithToLocaleString(price)} ${unit ?? (oneTime ? '' : t('per.year'))}`}
                </DesParagraph>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {giftEligible && giftOk && (
              <BillingToggle
                value={mode}
                onChange={(next) => {
                  setModuleBillingMode(key, next)
                  if (next !== 'discount') setAdvancedModulePriceOverride(key, undefined)
                }}
                discountValue={advancedModulePriceOverrides[key]}
                onDiscountChange={(val) => setAdvancedModulePriceOverride(key, val)}
              />
            )}
            {typeof advancedModules[key] === 'number' && (
              <NumControl
                // 未勾选时展示 min 作为占位，实际计价仍以 0 为准
                value={
                  !(advancedModules[key] as number) && min
                    ? min
                    : (advancedModules[key] as number)
                }
                onChange={(val) => handleModuleChange(key, val)}
                disabled={!parentOk || (!advancedModules[key] && min !== 0)}
                min={min}
              />
            )}
          </div>
        </div>

        {variantOptions && (
          <div className="ml-6 grid gap-3 md:grid-cols-2">
            {variantOptions.map((opt) => {
              const active =
                checked && (moduleVariants[key] ?? variantOptions[0].value) === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setModuleVariant(key, opt.value)
                    if (!checked) handleModuleChange(key, true)
                  }}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-4 py-3 text-left transition-colors',
                    active
                      ? 'border-[#3366FF] bg-[#3366FF]/10'
                      : 'border-[rgba(255,255,255,0.15)] bg-transparent',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-full border',
                      active ? 'border-[#3366FF]' : 'border-white/40',
                    )}
                  >
                    {active && <span className="size-2 rounded-full bg-[#3366FF]" />}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white">
                      {opt.label}
                      {opt.description && (
                        <ModuleInfoIcon description={opt.description} sku={opt.sku} />
                      )}
                      {opt.launchTag && <LaunchBadge text={opt.launchTag} />}
                    </div>
                    <div className="mt-1 text-sm text-white-72">
                      {prefix} {formatWithToLocaleString(opt.price)} {t('per.year')}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {multiOptions &&
          (checked ||
            noCheckBox ||
            key === EAdvancedModules.FEATURE_LIBRARY ||
            key === EAdvancedModules.REGIONAL_COMPLIANCE ||
            key === EAdvancedModules.SOCIAL_CHANNELS ||
            key === EAdvancedModules.ECOM_CHANNELS) && (
            <div
              className={cn(
                'grid gap-x-2 gap-y-3',
                // 无 checkbox 的渠道容器：勾选框悬挂在左侧，渠道名与标题文字对齐
                noCheckBox && multiOptions ? 'ml-0' : 'ml-6',
                multiCols === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3',
              )}
            >
              {multiOptions.map((opt) => {
                const selected = (moduleMultiSelections[key] ?? []).includes(opt.value)
                return (
                  <label
                    key={opt.value}
                    className={cn(
                      'flex items-center gap-2 text-sm text-white',
                      opt.fullRow && 'col-span-2',
                      !parentOk && 'opacity-50',
                    )}
                  >
                    <Checkbox
                      checked={selected}
                      disabled={!parentOk}
                      onCheckedChange={(c) => {
                        const prev = moduleMultiSelections[key] ?? []
                        const next = c
                          ? [...prev, opt.value]
                          : prev.filter((v) => v !== opt.value)
                        setModuleMultiSelection(key, next)
                        if (next.length > 0 && !advancedModules[key]) {
                          handleModuleChange(key, true)
                        }
                        if (next.length === 0 && typeof advancedModules[key] !== 'number') {
                          handleModuleChange(key, false)
                        }
                      }}
                      className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <span className="flex items-center gap-1">
                      {opt.label}
                      {opt.description && (
                        <ModuleInfoIcon description={opt.description} sku={opt.sku} />
                      )}
                      {opt.launchTag && <LaunchBadge text={opt.launchTag} />}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

        {!!module.subModules?.length &&
          key !== EAdvancedModules.BATCH_TEMPLATING &&
          key !== EAdvancedModules.SOCIAL_DISTRIBUTION &&
          (checked || noCheckBox || module.alwaysShowSubs) && (
            <div
              className={cn(
                module.subFlex === 'row'
                  ? // 两列、行间距 12px；勾选框悬挂在左侧，子项文字与标题文字对齐
                    'mt-3 grid grid-cols-2 gap-x-2 gap-y-3'
                  : 'ml-[26px] mt-2 space-y-5',
              )}
            >
              {module.subModules.map((sub) => {
                if (noCheckBox && key === EAdvancedModules.ENTERPRISE_SSO) {
                  return (
                    <label key={sub.key} className="flex items-center gap-2 text-sm text-white">
                      <Checkbox
                        checked={!!advancedModules[sub.key]}
                        onCheckedChange={(c: boolean) => handleModuleChange(sub.key, c)}
                        className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                      />
                      <span className="flex items-center gap-1">
                        {sub.label}
                        {sub.description && (
                          <ModuleInfoIcon description={sub.description} skuKey={sub.key} />
                        )}
                        {sub.launchTag && <LaunchBadge text={sub.launchTag} />}
                      </span>
                    </label>
                  )
                }
                return renderModuleItem(sub, true)
              })}
            </div>
          )}
      </div>
    )

    if (boxed) {
      return (
        <div
          key={key}
          // p-6：卡片内文字与外部标题文字（ml-6）左对齐
          className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#141414] p-6"
        >
          {body}
        </div>
      )
    }

    return (
      <div key={key}>
        {body}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-black font-euclid text-white">
      <div className="no-scrollbar min-h-0 flex-1 overflow-scroll pb-20">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-black/90 p-5 backdrop-blur md:pr-[60px]">
          <div className="shrink-0 md:px-4">
            <LocaleLink href="/">
              <div className="relative size-9">
                <Image src="/assets/logo-dark.svg" fill alt="muse logo" />
              </div>
            </LocaleLink>
          </div>
          <div className="flex items-center gap-4">
            {canSwitchBusinessRole && (
              <Select
                value={businessRole}
                onValueChange={(v) => handleBusinessRoleChange(v as BusinessRole)}
              >
                <SelectTrigger className="h-8 w-auto min-w-[88px] gap-1 border-none bg-transparent px-2 text-base text-white shadow-none focus:ring-0 [&>svg]:hidden">
                  <SelectValue />
                  <ChevronDown className="size-4 opacity-70" />
                </SelectTrigger>
                <SelectContent className="border-[rgba(255,255,255,0.2)] bg-[#141414] text-white">
                  <SelectItem value="muse">Muse</SelectItem>
                  <SelectItem value="pod">Pod</SelectItem>
                </SelectContent>
              </Select>
            )}
            <LocaleSwitch />
          </div>
        </div>

        <div className="quote-form px-5 md:px-[60px]">
          <h1 className="font-feature text-[40px] md:text-[64px]">{t('title')}</h1>
          <div className="mt-2 font-euclidlight text-[18px] font-light text-white-72">
            {t('subtitle')}
          </div>
        </div>

        <div className="mt-10 space-y-10 px-5 text-white-72 md:px-[60px]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {formInfo.map(({ id, label, required }) => (
              <div className="col-span-1 space-y-3" key={id}>
                <Label className="text-sm font-medium">
                  {required && <span className="mr-1">*</span>}
                  {label}
                </Label>
                <Input
                  id={id}
                  placeholder={t('input.placeholder')}
                  value={customerInfo[id]}
                  onChange={(e) => handleInputChange(id, e.target.value)}
                  className="h-[44px] rounded-none border-2 border-[rgba(255,255,255,0.2)] text-white focus:border-white"
                />
              </div>
            ))}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              const tab = tabs.find((x) => x.key === v)
              if (tab && !tab.enabled) {
                toast({ duration: 1500, description: t('tab.comingSoon') })
                return
              }
              setActiveTab(v as TabEnum)
            }}
            className="w-full"
          >
            <TabsList className="h-[46px] w-fit rounded-[26px] border border-[rgba(255,255,255,0.2)] bg-[#141414] p-1">
              {tabs.map(({ key, label, enabled }) => {
                const isActive = activeTab === key
                return (
                  <TabsTrigger
                    value={key}
                    className={cn(
                      'h-full rounded-[26px] border border-transparent px-[14px]',
                      isActive && 'border-white text-white',
                      !enabled && 'opacity-50',
                    )}
                    key={key}
                  >
                    {label}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value={TabEnum.ADVANCED} className="mt-6 space-y-4">
              <BlockBox className="overflow-hidden">
                {/* 套餐头部：整块背景 + 下边框，与卡片左右出血对齐 */}
                <div className="-mx-5 -mt-6 flex w-auto items-center justify-between space-x-2 border-b border-[rgba(255,255,255,0.1)] bg-[#191919] p-5">
                  <div className="space-y-[6px]">
                    <Label className="text-white">{t('gea.plan')}</Label>
                    <DesParagraph>{t('gea.plan.hint')}</DesParagraph>
                  </div>
                  <NumControl value={subscriptionYears} onChange={setSubscriptionYears} min={1} />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      checked={advancedConfig.geaDam}
                      onCheckedChange={(c: boolean) => handleGeaBaseChange('geaDam', c)}
                      className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <div className="space-y-[6px]">
                      <Label className="flex flex-wrap items-center gap-2">
                        {t('gea.dam')}
                        <ModuleInfoIcon
                          description={t('moduleDesc.geaDam')}
                          skuKey={EGeaBaseModules.DAM}
                        />
                      </Label>
                      <DesParagraph>
                        {prefix} {formatWithToLocaleString(pricing.advanced.damPrice)}
                        {t('per.year')}
                      </DesParagraph>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      checked={advancedConfig.geaContext}
                      onCheckedChange={(c: boolean) => handleGeaBaseChange('geaContext', c)}
                      className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <div className="space-y-[6px]">
                      <Label className="flex flex-wrap items-center gap-2">
                        {t('gea.context')}
                        <ModuleInfoIcon
                          description={t('moduleDesc.geaContext')}
                          skuKey={EGeaBaseModules.GEA_CONTEXT}
                        />
                      </Label>
                      <DesParagraph>
                        {prefix} {formatWithToLocaleString(pricing.advanced.geaContextPrice)}
                        {t('per.year')}
                      </DesParagraph>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    'flex items-start justify-between gap-3',
                    // 私有化部署的 AI 点数包独立配置，此处仅保留赠送
                    saasAiPointsLocked && 'opacity-50',
                  )}
                >
                  <div
                    className={cn('flex items-start space-x-2', saasAiPointsLocked && 'cursor-not-allowed')}
                    title={saasAiPointsLocked ? t('aiPoints.privateHint') : undefined}
                  >
                    <Checkbox
                      disabled={saasAiPointsLocked}
                      checked={advancedConfig.geaAiPointsPack > 0}
                      onCheckedChange={(checked) =>
                        setAdvancedConfig({
                          ...advancedConfig,
                          geaAiPointsPack: checked ? aiPointsSelected / AI_POINTS_PER_PACK : 0,
                        })
                      }
                      className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <div className="space-y-[6px]">
                      <Label className="flex flex-wrap items-center gap-2">
                        {t('gea.aiPointsPack')}
                        <ModuleInfoIcon
                          description={t('moduleDesc.geaAiPointsPack')}
                          skuKey={EGeaBaseModules.AI_POINTS_PACK}
                        />
                        <div className="rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px] font-euclidlight text-sm font-light">
                          {t('gea.aiPointsPack.tag', { points: String(aiPointsSelected / 10000) })}
                        </div>
                        {isGiftAllowed(
                          aiPointsGiftThreshold,
                          EGeaBaseModules.AI_POINTS_PACK,
                          pricing.advanced.geaAiPackPrice,
                        ) && <OrangeBadge text={t('badge.optionalGift')} />}
                        {advancedConfig.geaAiPointsPack > 0 &&
                          renderBasicMergeIcon(EGeaBaseModules.AI_POINTS_PACK)}
                      </Label>
                      <HintParagraph>{t('gea.aiPointsPack.cycleHint')}</HintParagraph>
                      <DesParagraph>
                        {t('gea.aiPointsPack.valueHint', {
                          points: String(aiPointsSelected / 10000),
                          price: formatWithToLocaleString(aiPointsValue),
                        })}
                      </DesParagraph>
                    </div>
                  </div>
                  {isGiftAllowed(
                    aiPointsGiftThreshold,
                    EGeaBaseModules.AI_POINTS_PACK,
                    pricing.advanced.geaAiPackPrice,
                  ) && (
                      <BillingToggle
                        value={aiPointsPackMode}
                        onChange={(mode) => {
                          handleAiPointsPackBillingChange(mode)
                          if (mode !== 'discount') {
                            setAdvancedModulePriceOverride(EGeaBaseModules.AI_POINTS_PACK, undefined)
                          }
                        }}
                        discountValue={advancedModulePriceOverrides[EGeaBaseModules.AI_POINTS_PACK]}
                        onDiscountChange={(val) =>
                          setAdvancedModulePriceOverride(EGeaBaseModules.AI_POINTS_PACK, val)
                        }
                      />
                    )}
                </div>

                {basicConfigs.map(({ title, hint, des, key, min, tag }) => {
                  if (key === EBasicConfigKey.MEMBER_SEATS) {
                    const seatMode = advancedConfig.seatPricingMode ?? 'bySeat'
                    const seatTier = advancedConfig.seatTier ?? 'lte200'
                    return (
                      <div className="w-full space-y-3" key={key}>
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label className="flex items-center gap-3 text-[16px] text-white">
                            {title}
                            {renderBasicMergeIcon(SEAT_UNMERGE_KEY)}
                            <Select
                              value={seatMode}
                              onValueChange={(v) =>
                                setAdvancedConfig({
                                  ...advancedConfig,
                                  seatPricingMode: v as SeatPricingMode,
                                })
                              }
                            >
                              <SelectTrigger className="h-8 w-auto min-w-[88px] rounded-full border-[rgba(255,255,255,0.2)] bg-[#141414] px-3 text-sm text-white focus:ring-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="border-[rgba(255,255,255,0.2)] bg-[#141414] text-white">
                                <SelectItem value="bySeat">{t('seat.mode.bySeat')}</SelectItem>
                                <SelectItem value="byTier">{t('seat.mode.byTier')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </Label>
                          {seatMode === 'bySeat' && (
                            <NumControl
                              value={advancedConfig.memberSeats}
                              onChange={(val) => updateQuantity(key, val)}
                              min={min}
                            />
                          )}
                        </div>
                        <div className="space-y-0">
                          {hint.map((item, i) => (
                            <HintParagraph key={`hint${i}`}>{item}</HintParagraph>
                          ))}
                        </div>
                        {seatMode === 'bySeat' ? (
                          <DesParagraph>{des}</DesParagraph>
                        ) : (
                          <div className="grid gap-3 md:grid-cols-2">
                            {SEAT_TIERS.map((tier) => {
                              const active = seatTier === tier
                              const price = pricing.advanced.seatTierPrices[tier]
                              return (
                                <button
                                  key={tier}
                                  type="button"
                                  onClick={() =>
                                    setAdvancedConfig({
                                      ...advancedConfig,
                                      seatPricingMode: 'byTier',
                                      seatTier: tier as SeatTier,
                                    })
                                  }
                                  className={cn(
                                    'rounded-lg border px-4 py-3 text-left transition-colors',
                                    active
                                      ? 'border-[#3366FF] bg-[#3366FF]/10'
                                      : 'border-[rgba(255,255,255,0.15)]',
                                  )}
                                >
                                  <div className="flex items-center gap-2 text-sm text-white">
                                    <span
                                      className={cn(
                                        'flex size-4 items-center justify-center rounded-full border',
                                        active
                                          ? 'border-[#3366FF] bg-[#141414]'
                                          : 'border-white/40',
                                      )}
                                    >
                                      {active && (
                                        <span className="size-2 rounded-full bg-[#3366FF]" />
                                      )}
                                    </span>
                                    {t(`seat.tier.${tier}`)}
                                  </div>
                                  <div className="mt-1 pl-6 text-sm text-white-72">
                                    {prefix} {formatWithToLocaleString(price)}
                                    {t('per.year')}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  }

                  if (key === EBasicConfigKey.STORAGE_SPACE) {
                    const coldHot = Boolean(advancedConfig.enableColdHotStorage)
                    const multiRegion = Boolean(advancedConfig.enableMultiRegionStorage)
                    const showDefaultStepper = !coldHot && !multiRegion
                    const unitTag = '1TB'

                    const renderStorageQtyRow = ({
                      label,
                      hintText,
                      unitPrice,
                      value,
                      min = 0,
                      onChange,
                      showUnitTag = true,
                    }: {
                      label: string
                      hintText?: string
                      unitPrice: number
                      value: number
                      min?: number
                      onChange: (val: number) => void
                      showUnitTag?: boolean
                    }) => (
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="space-y-[6px]">
                          <Label className="flex items-center gap-2 text-[16px] text-white">
                            {label}
                            {showUnitTag && (
                              <div className="rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px] font-euclidlight text-sm font-light">
                                {unitTag}
                              </div>
                            )}
                          </Label>
                          {hintText && <HintParagraph>{hintText}</HintParagraph>}
                          <DesParagraph>
                            {prefix} {formatWithToLocaleString(unitPrice)}
                            {t('storage.perTbYear')}
                          </DesParagraph>
                        </div>
                        <NumControl value={value} min={min} onChange={onChange} />
                      </div>
                    )

                    return (
                      <div
                        className={cn(
                          'w-full space-y-4',
                          // 私有化部署不含存储空间：置 0 且不可编辑
                          privateConfig.enabled && 'pointer-events-none opacity-50',
                        )}
                        key={key}
                        title={privateConfig.enabled ? t('storage.privateHint') : undefined}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <div className="space-y-[6px]">
                            <Label className="flex items-center gap-3 text-[16px] text-white">
                              {title}
                              <div className="rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px] font-euclidlight text-sm font-light">
                                {unitTag}
                              </div>
                              {renderBasicMergeIcon(EBasicConfigKey.STORAGE_SPACE)}
                            </Label>
                            <div className="space-y-0">
                              {hint.map((item, i) => (
                                <HintParagraph key={`hint${i}`}>{item}</HintParagraph>
                              ))}
                            </div>
                            {showDefaultStepper && <DesParagraph>{des}</DesParagraph>}
                          </div>
                          {showDefaultStepper && (
                            <NumControl
                              value={advancedConfig.storageSpace}
                              onChange={(val) => updateQuantity(key, val)}
                              min={min}
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex items-start gap-2">
                            <Checkbox
                              checked={coldHot}
                              onCheckedChange={(c: boolean) =>
                                setAdvancedConfig({
                                  ...advancedConfig,
                                  enableColdHotStorage: c,
                                  ...(c
                                    ? {
                                      chinaHotStorage:
                                        advancedConfig.chinaHotStorage ??
                                        advancedConfig.storageSpace,
                                    }
                                    : {}),
                                })
                              }
                              className="mt-0.5 size-4 shrink-0 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                            />
                            <div className="space-y-0.5">
                              <Label className="flex items-center gap-1.5 text-white">
                                {t('storage.coldHot')}
                                <ModuleInfoIcon
                                  description={t('moduleDesc.coldHotStorage')}
                                  skuKey="coldHotStorage"
                                />
                              </Label>
                              <HintParagraph>
                                {prefix}{' '}
                                {formatWithToLocaleString(pricing.advanced.coldHotStorageFee)}
                                {t('per.year')}
                              </HintParagraph>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Checkbox
                              checked={multiRegion}
                              onCheckedChange={(c: boolean) =>
                                setAdvancedConfig({
                                  ...advancedConfig,
                                  enableMultiRegionStorage: c,
                                  ...(c && !advancedConfig.enableColdHotStorage
                                    ? {
                                      chinaHotStorage:
                                        advancedConfig.chinaHotStorage ??
                                        advancedConfig.storageSpace,
                                      overseasHotStorage:
                                        advancedConfig.overseasHotStorage ?? 1,
                                    }
                                    : {}),
                                })
                              }
                              className="mt-0.5 size-4 shrink-0 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                            />
                            <div className="space-y-0.5">
                              <Label className="flex items-center gap-1.5 text-white">
                                {t('storage.multiRegion')}
                                <ModuleInfoIcon
                                  description={t('moduleDesc.multiRegionStorage')}
                                  skuKey="overseasStorage"
                                />
                              </Label>
                              <HintParagraph>{t('storage.multiRegion.hint')}</HintParagraph>
                            </div>
                          </div>
                        </div>

                        {/* 仅冷热库：热库 / 冷库 */}
                        {coldHot && !multiRegion && (
                          <div className="space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-4">
                            {renderStorageQtyRow({
                              label: t('storage.hot.full'),
                              hintText: t('storage.hot.hint'),
                              unitPrice: pricing.advanced.chinaHotStoragePrice,
                              value: advancedConfig.chinaHotStorage ?? 1,
                              min: 1,
                              onChange: (val) =>
                                setAdvancedConfig({
                                  ...advancedConfig,
                                  chinaHotStorage: Math.max(1, val),
                                }),
                            })}
                            {renderStorageQtyRow({
                              label: t('storage.cold.full'),
                              hintText: t('storage.cold.hint'),
                              unitPrice: pricing.advanced.chinaColdStoragePrice,
                              value: advancedConfig.chinaColdStorage ?? 0,
                              min: 0,
                              onChange: (val) =>
                                setAdvancedConfig({
                                  ...advancedConfig,
                                  chinaColdStorage: Math.max(0, val),
                                }),
                            })}
                          </div>
                        )}

                        {/* 仅多区域：中国 / 海外 存储空间 */}
                        {!coldHot && multiRegion && (
                          <div className="space-y-4">
                            <div className="space-y-3 border-t border-[rgba(255,255,255,0.1)] pt-4">
                              <Label className="flex items-center gap-2 text-white">
                                🇨🇳 {t('storage.china')}
                              </Label>
                              {renderStorageQtyRow({
                                label: t('storage.space'),
                                unitPrice: pricing.advanced.chinaHotStoragePrice,
                                value: advancedConfig.chinaHotStorage ?? 1,
                                min: 1,
                                onChange: (val) =>
                                  setAdvancedConfig({
                                    ...advancedConfig,
                                    chinaHotStorage: Math.max(1, val),
                                    storageSpace: Math.max(1, val),
                                  }),
                              })}
                            </div>
                            <div className="space-y-3 border-t border-[rgba(255,255,255,0.1)] pt-4">
                              <div className="space-y-1">
                                <Label className="flex items-center gap-2 text-white">
                                  🌐 {t('storage.overseas')}
                                </Label>
                                <HintParagraph>{t('storage.overseas.hint')}</HintParagraph>
                              </div>
                              {renderStorageQtyRow({
                                label: t('storage.space'),
                                unitPrice: pricing.advanced.overseasHotStoragePrice,
                                value: advancedConfig.overseasHotStorage ?? 1,
                                min: 1,
                                onChange: (val) =>
                                  setAdvancedConfig({
                                    ...advancedConfig,
                                    overseasHotStorage: Math.max(1, val),
                                  }),
                              })}
                            </div>
                          </div>
                        )}

                        {/* 冷热库 + 多区域：中国热/冷 + 海外热/冷 */}
                        {coldHot && multiRegion && (
                          <div className="space-y-4">
                            <div className="space-y-3 border-t border-[rgba(255,255,255,0.1)] pt-4">
                              <Label className="flex items-center gap-2 text-white">
                                🇨🇳 {t('storage.china')}
                              </Label>
                              {renderStorageQtyRow({
                                label: t('storage.hot.full'),
                                hintText: t('storage.hot.hint'),
                                unitPrice: pricing.advanced.chinaHotStoragePrice,
                                value: advancedConfig.chinaHotStorage ?? 1,
                                min: 1,
                                onChange: (val) =>
                                  setAdvancedConfig({
                                    ...advancedConfig,
                                    chinaHotStorage: Math.max(1, val),
                                  }),
                              })}
                              {renderStorageQtyRow({
                                label: t('storage.cold.full'),
                                hintText: t('storage.cold.hint'),
                                unitPrice: pricing.advanced.chinaColdStoragePrice,
                                value: advancedConfig.chinaColdStorage ?? 0,
                                min: 0,
                                onChange: (val) =>
                                  setAdvancedConfig({
                                    ...advancedConfig,
                                    chinaColdStorage: Math.max(0, val),
                                  }),
                              })}
                            </div>
                            <div className="space-y-3 border-t border-[rgba(255,255,255,0.1)] pt-4">
                              <div className="space-y-1">
                                <Label className="flex items-center gap-2 text-white">
                                  🌐 {t('storage.overseas')}
                                </Label>
                                <HintParagraph>{t('storage.overseas.hint')}</HintParagraph>
                              </div>
                              {renderStorageQtyRow({
                                label: t('storage.hot.full'),
                                hintText: t('storage.hot.hint'),
                                unitPrice: pricing.advanced.overseasHotStoragePrice,
                                value: advancedConfig.overseasHotStorage ?? 1,
                                min: 1,
                                onChange: (val) =>
                                  setAdvancedConfig({
                                    ...advancedConfig,
                                    overseasHotStorage: Math.max(1, val),
                                  }),
                              })}
                              {renderStorageQtyRow({
                                label: t('storage.cold.full'),
                                hintText: t('storage.cold.hint'),
                                unitPrice: pricing.advanced.overseasColdStoragePrice,
                                value: advancedConfig.overseasColdStorage ?? 0,
                                min: 0,
                                onChange: (val) =>
                                  setAdvancedConfig({
                                    ...advancedConfig,
                                    overseasColdStorage: Math.max(0, val),
                                  }),
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  }

                  if (key === EBasicConfigKey.AI_POINTS) {
                    return (
                      <div
                        className={cn(
                          'flex w-full items-center justify-between space-x-2 border-t border-[rgba(255,255,255,0.1)] pt-4',
                          // 私有化部署单独配置 AI 点数包，此处置 0 且不可编辑
                          privateConfig.enabled && 'cursor-not-allowed opacity-50',
                        )}
                        key={key}
                        title={privateConfig.enabled ? t('aiPoints.privateHint') : undefined}
                      >
                        <div className="space-y-[6px]">
                          <Label className="flex min-h-[22px] flex-wrap items-center gap-3 text-[16px] text-white">
                            {title}
                            <Select
                              disabled={privateConfig.enabled}
                              value={String(aiPointsOption)}
                              onValueChange={(v) =>
                                setAdvancedConfig({
                                  ...advancedConfig,
                                  aiPointsOption: Number(v),
                                })
                              }
                            >
                              <SelectTrigger className="h-7 w-auto min-w-[86px] gap-1 rounded-sm border-[rgba(255,255,255,0.2)] bg-transparent px-[6px] py-[2px] text-sm text-white focus:ring-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="border-[rgba(255,255,255,0.2)] bg-[#141414] text-white">
                                {AI_POINTS_OPTIONS.map((points) => (
                                  <SelectItem key={points} value={String(points)}>
                                    {t('gea.aiPointsPack.tag', { points: String(points / 10000) })}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {(advancedConfig.aiPoints ?? 0) > 0 &&
                              renderBasicMergeIcon(EBasicConfigKey.AI_POINTS)}
                          </Label>
                          <div className="space-y-0">
                            {hint.map((item, i) => (
                              <HintParagraph key={`hint${i}`}>{item}</HintParagraph>
                            ))}
                          </div>
                          <DesParagraph>{des}</DesParagraph>
                        </div>
                        <NumControl
                          value={advancedConfig[key as keyof typeof advancedConfig] as number}
                          onChange={(val) => updateQuantity(key, val)}
                          disabled={privateConfig.enabled}
                          min={min}
                        />
                      </div>
                    )
                  }

                  return (
                    <div className="flex w-full items-center justify-between space-x-2" key={key}>
                      <div className="space-y-[6px]">
                        <Label className="flex items-center gap-3 text-[16px] text-white">
                          {title}
                          {tag && (
                            <div className="rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px] font-euclidlight text-sm font-light">
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
                        value={advancedConfig[key as keyof typeof advancedConfig] as number}
                        onChange={(val) => updateQuantity(key, val)}
                        min={min}
                      />
                    </div>
                  )
                })}

                <Cost cost={basicCostPerYear} />
              </BlockBox>

              <div className="space-y-4">
                <TitleDiv>{t('extension.modules')}</TitleDiv>

                {(showDamExtensions || showGeaExtensions) && (
                  <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#101010]">
                    {showDamExtensions && (
                      <>
                        <button
                          type="button"
                          aria-expanded={!damAllCollapsed}
                          className="flex w-full items-center justify-between bg-[#191919] px-4 py-5 text-left text-base font-medium"
                          onClick={() => setProductGroupsCollapsed('dam', !damAllCollapsed)}
                        >
                          <span className="text-white">{t('extension.musedam')}</span>
                          <span
                            aria-hidden
                            className={cn(
                              'inline-block size-0 border-y-4 border-l-[5px] border-y-transparent border-l-current transition-transform duration-300 ease-in-out',
                              !damAllCollapsed && 'rotate-90',
                            )}
                          />
                        </button>
                        {damModuleGroups.map((group, groupIndex) => {
                          const { selected, total } = countSelectedInGroup(group.modules)
                          const collapsed = Boolean(collapsedGroups[group.id])
                          return (
                            <div key={group.id}>
                              <button
                                type="button"
                                className={cn(
                                  'flex h-20 w-full items-center justify-between border-y border-[rgba(255,255,255,0.1)] bg-[#141414] px-4 text-left',
                                  groupIndex > 0 && '-mt-px',
                                )}
                                onClick={() =>
                                  setCollapsedGroups((s) => ({
                                    ...s,
                                    [group.id]: !s[group.id],
                                  }))
                                }
                              >
                                <Label className="flex items-center gap-2 text-white/50">
                                  <span className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border border-white/40 text-[11px] leading-none text-white/50">
                                    {groupIndex + 1}
                                  </span>
                                  {group.title}
                                </Label>
                                <span className="flex items-center gap-2 text-sm text-white-50">
                                  {t('selected.count', { count: selected, total })}
                                  <span
                                    aria-hidden
                                    className={cn(
                                      'inline-block size-0 border-y-4 border-l-[5px] border-y-transparent border-l-current transition-transform duration-300 ease-in-out',
                                      !collapsed && 'rotate-90',
                                    )}
                                  />
                                </span>
                              </button>
                              <div
                                className={cn(
                                  'grid transition-[grid-template-rows] duration-300 ease-in-out',
                                  collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
                                )}
                              >
                                <div className="overflow-hidden">
                                  <div className="divide-y divide-[rgba(255,255,255,0.1)] px-4 py-5">
                                    {renderGroupModules(group.modules)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}

                    {showGeaExtensions && (
                      <>
                        <button
                          type="button"
                          aria-expanded={!geaAllCollapsed}
                          className="flex w-full items-center justify-between bg-[#191919] px-4 py-5 text-left text-base font-medium"
                          onClick={() => setProductGroupsCollapsed('gea', !geaAllCollapsed)}
                        >
                          <span className="text-white">{t('extension.gea')}</span>
                          <span
                            aria-hidden
                            className={cn(
                              'inline-block size-0 border-y-4 border-l-[5px] border-y-transparent border-l-current transition-transform duration-300 ease-in-out',
                              !geaAllCollapsed && 'rotate-90',
                            )}
                          />
                        </button>
                        {geaModuleGroups.map((group, groupIndex) => {
                          const { selected, total } = countSelectedInGroup(group.modules)
                          const collapsed = Boolean(collapsedGroups[group.id])
                          return (
                            <div key={group.id}>
                              <button
                                type="button"
                                className={cn(
                                  'flex h-20 w-full items-center justify-between border-y border-[rgba(255,255,255,0.1)] bg-[#141414] px-4 text-left',
                                  groupIndex > 0 && '-mt-px',
                                )}
                                onClick={() =>
                                  setCollapsedGroups((s) => ({
                                    ...s,
                                    [group.id]: !s[group.id],
                                  }))
                                }
                              >
                                <Label className="flex items-center gap-2 text-white/50">
                                  <span className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border border-white/40 text-[11px] leading-none text-white/50">
                                    {groupIndex + 1}
                                  </span>
                                  {group.title}
                                </Label>
                                <span className="flex items-center gap-2 text-sm text-white-50">
                                  {t('selected.count', { count: selected, total })}
                                  <span
                                    aria-hidden
                                    className={cn(
                                      'inline-block size-0 border-y-4 border-l-[5px] border-y-transparent border-l-current transition-transform duration-300 ease-in-out',
                                      !collapsed && 'rotate-90',
                                    )}
                                  />
                                </span>
                              </button>
                              <div
                                className={cn(
                                  'grid transition-[grid-template-rows] duration-300 ease-in-out',
                                  collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
                                )}
                              >
                                <div className="overflow-hidden">
                                  <div className="divide-y divide-[rgba(255,255,255,0.1)] px-4 py-5">
                                    {renderGroupModules(group.modules)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}

                    <div className="px-5 py-6">
                      <Cost cost={extensionCostPerYear} costTitle={t('advanced.cost')} />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value={TabEnum.PRIVATE} className="mt-6 space-y-4">
              <BlockBox>
                {/* 总开关 */}
                <div className="flex items-center justify-between">
                  <Label className="text-white">{t('private.cloud.title')}</Label>
                  <Switch.Root
                    checked={privateConfig.enabled}
                    onCheckedChange={(open) =>
                      // 私有化开启时「部署实施」必选
                      updatePrivateConfig(
                        open ? { enabled: true, implementationEnabled: true } : { enabled: false },
                      )
                    }
                    className={cn(
                      'relative h-[22px] w-[44px] cursor-pointer rounded-full border outline-none',
                      'group transition-all duration-300 ease-in-out',
                      !privateConfig.enabled
                        ? 'border-[rgba(255,255,255,0.2)] hover:border-white/40'
                        : 'data-[state=checked]:border-transparent data-[state=checked]:bg-[#3366FF]',
                    )}
                  >
                    <Switch.Thumb className="block size-[18px] translate-x-0.5 rounded-full bg-white-72 transition-all duration-300 ease-in-out group-hover:bg-white data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-white" />
                  </Switch.Root>
                </div>

                {privateConfig.enabled && (
                  <>
                    {/* 软件授权费 */}
                    <div className="space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={privateConfig.licenseEnabled}
                            onCheckedChange={(c: boolean) =>
                              updatePrivateConfig({ licenseEnabled: c })
                            }
                            className="size-4 shrink-0 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label className="flex items-center gap-2">
                            {t('private.license.fee')}
                            <span title={t('private.license.hint')}>
                              <Info className="size-3.5 text-white-50" />
                            </span>
                          </Label>
                        </div>
                        {/* 私部支持方式-暂时隐藏 */}
                        {/* <Select
                          value={privateConfig.licenseType}
                          onValueChange={(v) =>
                            updatePrivateConfig({ licenseType: v as PrivateLicenseType })
                          }
                        >
                          <SelectTrigger className="h-8 w-auto min-w-[120px] rounded-full border-[rgba(255,255,255,0.2)] bg-[#141414] px-3 text-sm text-white focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-[rgba(255,255,255,0.2)] bg-[#141414] text-white">
                            {licenseTypeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select> */}
                      </div>

                      {privateConfig.licenseEnabled && (
                        <div className="ml-6 space-y-4">
                          <DesParagraph>{t('private.license.hint')}</DesParagraph>
                          <DesParagraph className="text-white">
                            {privateConfig.licenseType === 'perpetual'
                              ? `${prefix} ${formatWithToLocaleString(privateLicenseFee)} ${t('private.license.currentVersion')}`
                              : privateConfig.licenseType === 'source'
                                ? `${t('private.license.saasTimes', { times: pricing.private.sourceMultiplier })} ≈ ${prefix} ${formatWithToLocaleString(privateLicenseFee)}${t('per.year')}`
                                : `${prefix} ${formatWithToLocaleString(privateLicenseFee)}${t('per.year')}`}
                          </DesParagraph>
                          <Button
                            type="button"
                            onClick={() => setActiveTab(TabEnum.ADVANCED)}
                            className="box-border flex h-9 w-[152px] shrink-0 items-center justify-center gap-1.5 rounded-[10px] border border-black/[0.03] bg-white px-5 py-4 text-sm font-medium text-[#141414] shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.03),inset_0px_1px_3px_-2px_rgba(255,255,255,0.03),inset_0px_-1px_3px_-2px_rgba(0,0,0,0.06)] hover:bg-white/90"
                          >
                            {t('private.select.modules')}
                            <ChevronRight className="size-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* 产品运营及维护 */}
                    <div className="space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-6">
                      <div className="flex items-center space-x-2">
                        <Label className="flex items-center gap-2">
                          {t('private.ops.title')}
                          <span title={t('product.operation.maintenance.description')}>
                            <Info className="size-3.5 text-white-50" />
                          </span>
                        </Label>
                      </div>

                      {privateConfig.opsEnabled && (
                        <div className="space-y-4">
                          <div className="flex items-start space-x-2">
                            <div className="flex h-[16px] shrink-0 items-center">
                              {/* 基础维护为必选项 */}
                              <Checkbox
                                checked
                                disabled
                                className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                              />
                            </div>
                            <div className="space-y-[6px]">
                              <Label className="flex items-center gap-2">
                                {t('private.ops.basic')}
                                <ModuleInfoIcon
                                  description={t('private.ops.basic.hint')}
                                  skuKey="private.ops.basic"
                                />
                              </Label>
                              <HintParagraph>{t('private.ops.basic.desc')}</HintParagraph>
                              <DesParagraph>
                                {prefix} {formatWithToLocaleString(privateBasicMaintenanceFee)}
                              </DesParagraph>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                              <div className="flex h-[16px] shrink-0 items-center">
                                <Checkbox
                                  checked={privateConfig.versionIteration}
                                  onCheckedChange={(c: boolean) =>
                                    updatePrivateConfig({ versionIteration: c })
                                  }
                                  className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                />
                              </div>
                              <div className="space-y-[6px]">
                                <Label className="flex items-center gap-2">
                                  {t('private.ops.iteration')}
                                  <ModuleInfoIcon description={t('private.ops.iteration.hint1')} />
                                </Label>
                                <HintParagraph>{t('private.ops.iteration.hint1')}</HintParagraph>
                                <HintParagraph>{t('private.ops.iteration.hint2')}</HintParagraph>
                              </div>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                              {([1, 4] as PrivateIterationFrequency[]).map((freq) => {
                                const active = privateConfig.iterationFrequency === freq
                                const price = pricing.private.iterationPrices[freq]
                                const listPrice = pricing.private.iterationListPrices[freq]
                                const discounted = listPrice > price
                                return (
                                  <button
                                    key={freq}
                                    type="button"
                                    onClick={() =>
                                      updatePrivateConfig({
                                        iterationFrequency: freq,
                                        versionIteration: true,
                                      })
                                    }
                                    className={cn(
                                      'rounded-lg border px-4 py-3 text-left transition-colors',
                                      active && privateConfig.versionIteration
                                        ? 'border-[#3366FF] bg-[#3366FF]/10'
                                        : 'border-[rgba(255,255,255,0.15)]',
                                      // 未勾选「版本迭代」时档位置灰，点击即勾选
                                      !privateConfig.versionIteration && 'opacity-50',
                                    )}
                                  >
                                    <div className="flex items-center gap-2 text-sm text-white">
                                      <span
                                        className={cn(
                                          'flex size-4 shrink-0 items-center justify-center rounded-full border',
                                          active ? 'border-[#3366FF]' : 'border-white/40',
                                        )}
                                      >
                                        {active && (
                                          <span className="size-2 rounded-full bg-[#3366FF]" />
                                        )}
                                      </span>
                                      {t('private.ops.iteration.times', { times: freq })}
                                      {discounted && <OrangeBadge text={t('badge.limitedHalfOff')} />}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-white-72">
                                      {discounted && (
                                        <span className="text-white-50 line-through">
                                          {prefix} {formatWithToLocaleString(listPrice)}
                                          {t('per.year')}
                                        </span>
                                      )}
                                      <span>
                                        {prefix} {formatWithToLocaleString(price)}
                                        {t('per.year')}
                                      </span>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 私有化部署实施 */}
                    <div className="space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked
                            disabled
                            className="size-4 shrink-0 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label className="flex items-center gap-2">
                            {t('private.implementation.once')}
                            <span title={t('private.deployment.implementation.description')}>
                              <Info className="size-3.5 text-white-50" />
                            </span>
                          </Label>
                        </div>
                        <Select
                          value={privateConfig.cloudProvider}
                          onValueChange={(v) =>
                            updatePrivateConfig({ cloudProvider: v as PrivateCloudProvider })
                          }
                        >
                          <SelectTrigger className="h-8 w-auto min-w-[100px] rounded-full border-[rgba(255,255,255,0.2)] bg-[#141414] px-3 text-sm text-white focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-[rgba(255,255,255,0.2)] bg-[#141414] text-white">
                            {cloudProviderOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {privateConfig.implementationEnabled && (
                        <div className="ml-6 space-y-4">
                          {privateImplProductList.map(({ key, label, price }) => {
                            const saasForced = isSaasProductSelected(
                              key,
                              advancedConfig,
                              advancedModules,
                            )
                            const privatelySelected = !!privateImplProducts[key]
                            const checked = saasForced || privatelySelected
                            // SaaS 已选且非私有化主动勾选 → 锁定；私有化主动勾选的仍可取消
                            const locked = saasForced && !privatelySelected
                            return (
                              <div key={key} className="flex items-start space-x-2">
                                <div className="flex h-[16px] shrink-0 items-center">
                                  <Checkbox
                                    checked={checked}
                                    disabled={locked}
                                    onCheckedChange={(c: boolean) =>
                                      handlePrivateImplChange(key, c)
                                    }
                                    className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                  />
                                </div>
                                <div className="space-y-[6px]">
                                  <Label className="flex items-center gap-2">
                                    {label}
                                    <Info className="size-3.5 text-white-50" />
                                  </Label>
                                  <DesParagraph>
                                    {prefix} {formatWithToLocaleString(price)}
                                    {t('private.oneTime')}
                                  </DesParagraph>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* API 点数费用（默认勾选 50 万点） */}
                    <div className="space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            checked={Boolean(privateConfig.aiPointsEnabled)}
                            onCheckedChange={(c: boolean) =>
                              updatePrivateConfig({ aiPointsEnabled: c })
                            }
                            className="mt-1 size-4 shrink-0 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                          />
                          <div className="space-y-[6px]">
                            <Label className="flex flex-wrap items-center gap-2">
                              {t('private.aiPointsPack')}
                              <ModuleInfoIcon
                                description={t('moduleDesc.geaAiPointsPack')}
                                skuKey="privateAiPoints"
                              />
                              <Select
                                value={String(privateAiPoints)}
                                onValueChange={(v) =>
                                  updatePrivateConfig({ aiPointsOption: Number(v) })
                                }
                              >
                                <SelectTrigger className="h-7 w-auto min-w-[86px] gap-1 rounded-sm border-[rgba(255,255,255,0.2)] bg-transparent px-[6px] py-[2px] text-sm text-white focus:ring-0">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-[rgba(255,255,255,0.2)] bg-[#141414] text-white">
                                  {AI_POINTS_OPTIONS.map((points) => (
                                    <SelectItem key={points} value={String(points)}>
                                      {t('gea.aiPointsPack.tag', { points: String(points / 10000) })}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </Label>
                            <HintParagraph>{t('gea.aiPointsPack.cycleHint')}</HintParagraph>
                            <DesParagraph>
                              {prefix} {formatWithToLocaleString(privateAiPointsFee)}
                              {t('per.year')}
                            </DesParagraph>
                          </div>
                        </div>
                        <NumControl
                          value={privateAiPointsQty}
                          onChange={(val) => updatePrivateConfig({ aiPointsQty: Math.max(1, val) })}
                          min={1}
                        />
                      </div>
                    </div>

                    <Cost
                      cost={privateAnnualTotal}
                      costTitle={t('price.annual')}
                      oneTimeCost={privateOneTimeDisplayTotal}
                    />
                  </>
                )}
              </BlockBox>
            </TabsContent>
            <TabsContent value={TabEnum.CUSTOM} className="mt-6 space-y-5">
              <CustomServiceContent />
              {/* 定制服务可单独设置折扣 */}
              {!isGlobal && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <TitleDiv>{t('custom.discount.settings')}</TitleDiv>
                    <Switch.Root
                      checked={openCustomDiscount}
                      onCheckedChange={(open) => {
                        setCustomDiscount(open ? 9.5 : undefined)
                        setOpenCustomDiscount(open)
                      }}
                      className={cn(
                        'relative h-[22px] w-[44px] cursor-pointer rounded-full border outline-none',
                        'group transition-all duration-300 ease-in-out',
                        !openCustomDiscount
                          ? 'border-[rgba(255,255,255,0.2)] hover:border-white/40'
                          : 'data-[state=checked]:border-transparent data-[state=checked]:bg-[#3366FF]',
                      )}
                    >
                      <Switch.Thumb className="block size-[18px] translate-x-0.5 rounded-full bg-white-72 transition-all duration-300 ease-in-out group-hover:bg-white data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-white" />
                    </Switch.Root>
                  </div>
                  {openCustomDiscount && (
                    <BlockBox className="flex items-center justify-between space-y-0">
                      <div className="space-y-[6px]">
                        <Label>{t('discount.input.label')}</Label>
                        <DesParagraph>{t('discount.input.hint')}</DesParagraph>
                      </div>
                      <div className="flex items-center gap-[10px]">
                        <Input
                          value={customDiscount ?? ''}
                          onChange={(e) => {
                            if (e.target.value === '') {
                              setCustomDiscount(undefined)
                              return
                            }
                            setCustomDiscount(e.target.value as unknown as number)
                          }}
                          onBlur={(e) => {
                            const val = e.target.value ? Number(e.target.value) : 9.5
                            setCustomDiscount(
                              Math.max(1, Math.min(10, Math.round(val * 100) / 100)),
                            )
                          }}
                          className="h-[44px] max-w-[115px] rounded-none border-[rgba(255,255,255,0.2)] font-medium text-white"
                          placeholder="1-10"
                        />
                        <span className="text-base">{t('discount.unit')}</span>
                      </div>
                    </BlockBox>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {!isGlobal && activeTab === TabEnum.ADVANCED && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <TitleDiv>{t('discount.settings')}</TitleDiv>
                <Switch.Root
                  checked={openDiscount}
                  onCheckedChange={(open) => {
                    setDiscount(open ? 9.5 : undefined)
                    setOpenDiscount(open)
                  }}
                  className={cn(
                    'relative h-[22px] w-[44px] cursor-pointer rounded-full border outline-none',
                    'group transition-all duration-300 ease-in-out',
                    !openDiscount
                      ? 'border-[rgba(255,255,255,0.2)] hover:border-white/40'
                      : 'data-[state=checked]:border-transparent data-[state=checked]:bg-[#3366FF]',
                  )}
                >
                  <Switch.Thumb className="block size-[18px] translate-x-0.5 rounded-full bg-white-72 transition-all duration-300 ease-in-out group-hover:bg-white data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-white" />
                </Switch.Root>
              </div>
              {openDiscount && (
                <BlockBox className="space-y-0">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="space-y-[6px]">
                      <Label>{t('discount.input.label')}</Label>
                      <DesParagraph>{t('discount.input.hint')}</DesParagraph>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <Input
                        value={
                          discount !== undefined
                            ? language === 'zh-CN'
                              ? discount
                              : Math.round((10 - discount) * 10)
                            : ''
                        }
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
                            setDiscount(Math.max(8, Math.min(10, Math.round(val * 100) / 100)))
                          } else {
                            const validInputVal = Math.max(0, Math.min(20, Math.floor(val)))
                            setDiscount(Math.max(8, (100 - validInputVal) / 10))
                          }
                        }}
                        className="h-[44px] max-w-[115px] rounded-none border-[rgba(255,255,255,0.2)] font-medium text-white"
                        placeholder={language === 'zh-CN' ? '8-10' : '0-20'}
                      />
                      <span className="text-base">{t('discount.unit')}</span>
                    </div>
                  </div>
                  {/* 整单刊例：整体折后价 ÷ 折前价，保留 2 位小数 */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-5">
                    <Label>{t('discount.overall')}</Label>
                    <span className="text-base text-white">
                      <span className='text-lg'>{overallDiscountText}</span>
                      <span className={language === 'zh-CN' ? 'ml-1' : ''}>
                        {t('discount.unit')}
                      </span>
                    </span>
                  </div>
                </BlockBox>
              )}
            </div>
          )}

          {activeTab === TabEnum.ADVANCED && (
            <div className="space-y-5">
              <TitleDiv>{t('feature.display.options')}</TitleDiv>
              <RadioGroup.Root className="flex flex-col gap-3 md:flex-row md:gap-6" value={featureView}>
                {[EFeatureView.OVERVIEW, EFeatureView.DETAIL].map((listType) => (
                  <BlockBox
                    className={cn(
                      'flex h-full flex-1 cursor-pointer items-center space-x-2 space-y-0 transition-colors',
                      listType === featureView ? 'border-[#3366FF]' : 'hover:border-white/40',
                    )}
                    key={listType}
                    onClick={() => setFeatureView(listType)}
                  >
                    <RadioGroup.Item
                      className={cn(
                        'mr-2 flex size-4 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)]',
                        listType === featureView ? 'border-[#3366FF]' : 'hover:border-white/40',
                      )}
                      value={listType}
                      onClick={() => setFeatureView(listType)}
                    >
                      <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                    </RadioGroup.Item>
                    <Label className="text-[14px] leading-[1.3em] text-white">
                      {listType === EFeatureView.OVERVIEW ? t('feature.overview') : t('feature.details')}
                    </Label>
                  </BlockBox>
                ))}
              </RadioGroup.Root>
            </div>
          )}

          {activeTab === TabEnum.ADVANCED && (
            <div className="space-y-5">
              <TitleDiv>{t('unselected.modules.pricing')}</TitleDiv>
              <RadioGroup.Root
                className="flex flex-col gap-3 md:flex-row md:gap-6"
                value={showNoBuyFeature.toString()}
              >
                {[false, true].map((radio) => (
                  <BlockBox
                    className={cn(
                      'flex h-full flex-1 cursor-pointer items-center space-x-2 space-y-0 transition-colors',
                      showNoBuyFeature === radio ? 'border-[#3366FF]' : 'hover:border-white/40',
                    )}
                    key={String(radio)}
                    onClick={() => handleShowNoBuyChange(radio)}
                  >
                    <RadioGroup.Item
                      className={cn(
                        'mr-2 flex size-4 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)]',
                        showNoBuyFeature === radio ? 'border-[#3366FF]' : 'hover:border-white/40',
                      )}
                      value={radio.toString()}
                      onClick={() => handleShowNoBuyChange(radio)}
                    >
                      <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                    </RadioGroup.Item>
                    <Label className="text-[14px] leading-[1.3em] text-white">
                      {radio ? t('show.unselected.modules') : t('hide.unselected.modules')}
                    </Label>
                  </BlockBox>
                ))}
              </RadioGroup.Root>
              {showNoBuyFeature && (
                <div className="flex items-center gap-3">
                  <DesParagraph>
                    {t('noBuy.dialog.selectedCount', {
                      count: noBuyModuleKeys
                        ? noBuyCandidates.filter((v) => v.key && noBuyModuleKeys.includes(v.key))
                            .length
                        : noBuyCandidates.length,
                    })}
                  </DesParagraph>
                  <button
                    type="button"
                    className="text-sm text-[#3366FF] hover:underline"
                    onClick={() => setNoBuyDialogOpen(true)}
                  >
                    {t('noBuy.dialog.title')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex h-[80px] shrink-0 items-center justify-between border-t border-white/15 bg-black px-5">
        <div className="flex items-center gap-3 text-white">
          <span className="text-base font-medium">{t('custom.total')}</span>
          {discountTotal ? (
            <span className="flex items-baseline gap-2">
              <span className="text-base font-normal text-white-50 line-through">{subtotal}</span>
              <span className="text-2xl font-semibold">{discountTotal}</span>
            </span>
          ) : (
            <span className="text-2xl font-semibold">{subtotal}</span>
          )}
        </div>
        <Button
          disabled={loading}
          className="h-[48px] min-w-[140px] rounded-lg bg-white px-6 text-lg font-medium text-[#0e0e0e] transition-all duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.6)] md:min-w-[160px] md:rounded-2xl"
          onClick={() => {
            if (loading) return
            if (!customerInfo.company?.length || !customerInfo.yourEmail?.length) {
              toast({ duration: 800, description: t('form.required') })
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

      <NoBuyModulesDialog
        open={noBuyDialogOpen}
        onOpenChange={setNoBuyDialogOpen}
        candidates={noBuyCandidates}
        value={noBuyModuleKeys}
        onConfirm={(keys) => setNoBuyModuleKeys(keys)}
      />
    </div>
  )
}
