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
  CLIPO_REMIX_VARIANT_KEYS,
  MUSE_AI_VARIANT_KEYS,
} from './enums'
import { ModuleInfoIcon } from './ModuleInfoIcon'
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
  SeatPricingMode,
  SeatTier,
  TabEnum,
} from './types'
import {
  AI_GIFT_PACKS,
  AI_GIFT_POINTS,
  AI_POINT_UNIT_PRICE,
  AI_POINTS_GIFT_THRESHOLD,
  EBasicConfigKey,
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
import { useQuoteDetailData } from './QuoteDetailData'

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

const BillingToggle: FC<{
  value: BillingMode
  onChange: (mode: BillingMode) => void
}> = ({ value, onChange }) => {
  const { t } = useTranslation('quotation')
  const items: BillingMode[] = ['paid', 'discount', 'gift']
  return (
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
  )
}

const Cost = ({ cost, costTitle }: { cost: number; costTitle?: string }) => {
  const { t } = useTranslation('quotation')
  const { prefix } = usePricing()
  return (
    <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
      <div className="flex items-center justify-between text-white">
        <Label className="text-lg font-normal">{costTitle ?? t('base.cost')}</Label>
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
  const moduleGroups = useAdvancedModuleGroups()
  const { pricing, prefix } = usePricing()
  const { isInChina } = useCountry()
  const isGlobal = !isInChina
  const { toast } = useToast()
  const router = useRouter()
  const { language } = useLanguage()
  const {
    subtotal,
    totalNumPerYear,
    years,
    basicCostPerYear,
    extensionCostPerYear,
    saasPaidTotalPerYear,
    saasLicenseBasePerYear,
  } = useQuoteDetailData()

  const [openDiscount, setOpenDiscount] = useState(false)
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
    showNoBuyFeature,
    setShowNoBuyFeature,
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
  const aiPointsValue = AI_GIFT_POINTS * AI_POINT_UNIT_PRICE

  useEffect(() => {
    if (editInfo) setOpenDiscount(editInfo.discount !== undefined)
  }, [editInfo])

  useEffect(() => {
    if (activeTab === TabEnum.BASIC) setDiscount(undefined)
  }, [activeTab, setDiscount])

  useEffect(() => {
    setLoading(false)
  }, [])

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
    if (aiPointsPackMode === 'gift') {
      setAdvancedConfig({
        ...advancedConfig,
        geaAiPointsPack: AI_GIFT_PACKS,
      })
    }
  }

  const handleAiPointsPackBillingChange = (mode: BillingMode) => {
    setModuleBillingMode(EGeaBaseModules.AI_POINTS_PACK, mode)
    if (mode === 'gift') {
      setAdvancedConfig({
        ...advancedConfig,
        geaAiPointsPack: AI_GIFT_PACKS,
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
  }

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
        price: pricing.private.implProducts[EPrivateImplProducts.DAM],
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

  const privateDisplayTotal =
    (privateConfig.licenseEnabled ? privateLicenseFee : 0) + privateOpsAnnual + privateImplTotal

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
      prefix,
      featureView,
      showNoBuyFeature,
      lang: language,
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
  ])

  const displayPrice = (key: string, listPrice: number) => {
    const mode = moduleBillingModes[key as EAdvancedModules] ?? 'paid'
    if (mode === 'gift') return 0
    return advancedModulePriceOverrides[key as EAdvancedModules] ?? listPrice
  }

  /** SaaS 折后年总价：仅作赠送门槛判断，不在 UI 展示 */
  const saasDiscountedTotalPerYear = useMemo(
    () => saasPaidTotalPerYear * ((discount ?? 10) / 10),
    [saasPaidTotalPerYear, discount],
  )

  const isGiftAllowed = (threshold?: number) => {
    if (!threshold) return true
    return saasDiscountedTotalPerYear >= threshold
  }

  // 门槛不满足时，隐藏切换控件并回退为付费，避免残留折扣/赠送价
  useEffect(() => {
    const giftOk = (threshold?: number) =>
      !threshold || saasDiscountedTotalPerYear >= threshold

    const resetIfNeeded = (key: EAdvancedModules | EGeaBaseModules, threshold?: number) => {
      if (giftOk(threshold)) return
      const mode = moduleBillingModes[key]
      if (mode && mode !== 'paid') setModuleBillingMode(key, 'paid')
    }

    resetIfNeeded(EGeaBaseModules.AI_POINTS_PACK, AI_POINTS_GIFT_THRESHOLD)

    const walk = (modules: IModules[]) => {
      modules.forEach((m) => {
        if (m.giftEligible) resetIfNeeded(m.key, m.giftThreshold)
        if (m.subModules?.length) walk(m.subModules)
      })
    }
    moduleGroups.forEach((g) => walk(g.modules))
  }, [saasDiscountedTotalPerYear, moduleBillingModes, moduleGroups, setModuleBillingMode])

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
    } = module
    const mode = (moduleBillingModes[key] ?? 'paid') as BillingMode
    const price = displayPrice(key, module.price)
    const giftOk = isGiftAllowed(giftThreshold)
    const parentOk = !requires || !!advancedModules[requires]
    const checked = !!advancedModules[key]

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
                {module.description && <ModuleInfoIcon description={module.description} />}
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
          <div className={cn('flex items-start', !boxed && !(noCheckBox && multiOptions) && 'space-x-2')}>
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
              <Label className="flex flex-wrap items-center gap-2 font-normal">
                <span>{module.label}</span>
                {module.description && <ModuleInfoIcon description={module.description} />}
                {tag && (
                  <span className="rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px] text-sm">
                    {tag}
                  </span>
                )}
                {giftEligible && giftBadge && <OrangeBadge text={giftBadge} />}
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
                }}
              />
            )}
            {mode === 'discount' && giftEligible && giftOk && (
              <Input
                type="number"
                min={0}
                value={advancedModulePriceOverrides[key] ?? module.price}
                onChange={(e) => {
                  const parsed = Number(e.target.value)
                  if (!Number.isNaN(parsed)) setAdvancedModulePriceOverride(key, Math.max(0, parsed))
                }}
                className="h-8 w-[115px] rounded-none border-[rgba(255,255,255,0.2)] text-white"
                placeholder={t('discount.edit.price')}
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
                disabled={!advancedModules[key] && min !== 0}
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
                      {opt.description && <ModuleInfoIcon description={opt.description} />}
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
                noCheckBox ? 'ml-0' : 'ml-6',
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
                      {opt.description && <ModuleInfoIcon description={opt.description} />}
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
                'ml-[26px]',
                module.subFlex === 'row'
                  ? 'mt-3 flex flex-wrap items-center gap-2 md:gap-8'
                  : 'mt-2 space-y-5',
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
                        {sub.description && <ModuleInfoIcon description={sub.description} />}
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
          className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#141414] p-4"
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
              <BlockBox>
                <div className="flex w-full items-center justify-between space-x-2">
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
                        <ModuleInfoIcon description={t('moduleDesc.geaDam')} />
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
                        <ModuleInfoIcon description={t('moduleDesc.geaContext')} />
                      </Label>
                      <DesParagraph>
                        {prefix} {formatWithToLocaleString(pricing.advanced.geaContextPrice)}
                        {t('per.year')}
                      </DesParagraph>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      checked={advancedConfig.geaAiPointsPack > 0}
                      onCheckedChange={(checked) =>
                        setAdvancedConfig({
                          ...advancedConfig,
                          geaAiPointsPack: checked
                            ? AI_GIFT_PACKS
                            : 0,
                        })
                      }
                      className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <div className="space-y-[6px]">
                      <Label className="flex flex-wrap items-center gap-2">
                        {t('gea.aiPointsPack')}
                        <ModuleInfoIcon description={t('moduleDesc.geaAiPointsPack')} />
                        <span className="rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px] text-sm">
                          {t('gea.aiPointsPack.tag', {
                            points: String(AI_GIFT_POINTS / 10000),
                          })}
                        </span>
                        {isGiftAllowed(AI_POINTS_GIFT_THRESHOLD) && (
                          <OrangeBadge text={t('badge.optionalGift')} />
                        )}
                      </Label>
                      <HintParagraph>{t('gea.aiPointsPack.cycleHint')}</HintParagraph>
                      <DesParagraph>
                        {t('gea.aiPointsPack.valueHint', {
                          points: String(AI_GIFT_POINTS / 10000),
                          price: formatWithToLocaleString(aiPointsValue),
                        })}
                      </DesParagraph>
                    </div>
                  </div>
                  {isGiftAllowed(AI_POINTS_GIFT_THRESHOLD) && (
                    <BillingToggle
                      value={aiPointsPackMode}
                      onChange={handleAiPointsPackBillingChange}
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
                      <div className="w-full space-y-4" key={key}>
                        <div className="flex w-full items-center justify-between gap-2">
                          <div className="space-y-[6px]">
                            <Label className="flex items-center gap-3 text-[16px] text-white">
                              {title}
                              <div className="rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] py-[2px] font-euclidlight text-sm font-light">
                                {unitTag}
                              </div>
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
                                <ModuleInfoIcon description={t('moduleDesc.coldHotStorage')} />
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
                        className="flex w-full items-center justify-between space-x-2 border-t border-[rgba(255,255,255,0.1)] pt-4"
                        key={key}
                      >
                        <div className="space-y-[6px]">
                          <Label className="flex items-center gap-3 text-[16px] text-white">
                            {title}
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
                                  'flex w-full items-center justify-between border-y border-[rgba(255,255,255,0.1)] bg-[#141414] px-4 py-5 text-left',
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
                                      'inline-block size-0 border-x-4 border-t-[5px] border-x-transparent border-t-current transition-transform duration-300 ease-in-out',
                                      collapsed && 'rotate-180',
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
                                    {group.modules.map((m) => (
                                      <div key={m.key} className="py-5 first:pt-0 last:pb-0">
                                        {renderModuleItem(m)}
                                      </div>
                                    ))}
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
                                  'flex w-full items-center justify-between border-y border-[rgba(255,255,255,0.1)] bg-[#141414] px-4 py-5 text-left',
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
                                      'inline-block size-0 border-x-4 border-t-[5px] border-x-transparent border-t-current transition-transform duration-300 ease-in-out',
                                      collapsed && 'rotate-180',
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
                                    {group.modules.map((m) => (
                                      <div key={m.key} className="py-5 first:pt-0 last:pb-0">
                                        {renderModuleItem(m)}
                                      </div>
                                    ))}
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
                    onCheckedChange={(open) => updatePrivateConfig({ enabled: open })}
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
                        <Select
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
                        </Select>
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
                        <Checkbox
                          checked={privateConfig.opsEnabled}
                          onCheckedChange={(c: boolean) => updatePrivateConfig({ opsEnabled: c })}
                          className="size-4 shrink-0 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        />
                        <Label className="flex items-center gap-2">
                          {t('private.ops.title')}
                          <span title={t('product.operation.maintenance.description')}>
                            <Info className="size-3.5 text-white-50" />
                          </span>
                        </Label>
                      </div>

                      {privateConfig.opsEnabled && (
                        <div className="ml-6 space-y-4">
                          <div className="flex items-start space-x-2">
                            <div className="flex h-[16px] shrink-0 items-center">
                              <Checkbox
                                checked={privateConfig.basicMaintenance}
                                onCheckedChange={(c: boolean) =>
                                  updatePrivateConfig({ basicMaintenance: c })
                                }
                                className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                              />
                            </div>
                            <div className="space-y-[6px]">
                              <Label>{t('private.ops.basic')}</Label>
                              <DesParagraph>
                                {t('private.ops.basic.rate', {
                                  rate: String(Math.round(pricing.private.basicMaintenanceRate * 100)),
                                })}
                                {' ≈ '}
                                {prefix}{' '}
                                {formatWithToLocaleString(privateBasicMaintenanceFee)}
                                {t('per.year')}
                              </DesParagraph>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={privateConfig.versionIteration}
                                onCheckedChange={(c: boolean) =>
                                  updatePrivateConfig({ versionIteration: c })
                                }
                                className="size-4 shrink-0 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                              />
                              <Label>{t('private.ops.iteration')}</Label>
                            </div>

                            {privateConfig.versionIteration && (
                              <div className="ml-6 grid gap-3 md:grid-cols-2">
                                {([1, 4] as PrivateIterationFrequency[]).map((freq) => {
                                  const active = privateConfig.iterationFrequency === freq
                                  const price = pricing.private.iterationPrices[freq]
                                  return (
                                    <button
                                      key={freq}
                                      type="button"
                                      onClick={() =>
                                        updatePrivateConfig({ iterationFrequency: freq })
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
                                            'size-3 rounded-full border',
                                            active
                                              ? 'border-[#3366FF] bg-[#3366FF]'
                                              : 'border-white/40',
                                          )}
                                        />
                                        {t('private.ops.iteration.times', { times: freq })}
                                      </div>
                                      <div className="mt-1 text-sm text-white-72">
                                        {prefix} {formatWithToLocaleString(price)}
                                        {t('per.year')}
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          {(privateConfig.basicMaintenance || privateConfig.versionIteration) && (
                            <DesParagraph className="text-white">
                              {prefix} {formatWithToLocaleString(privateOpsAnnual)}
                              {t('per.year')}
                            </DesParagraph>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 私有化部署实施 */}
                    <div className="space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={privateConfig.implementationEnabled}
                            onCheckedChange={(c: boolean) =>
                              updatePrivateConfig({ implementationEnabled: c })
                            }
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

                    <Cost cost={privateDisplayTotal} costTitle={t('base.cost')} />
                  </>
                )}
              </BlockBox>
            </TabsContent>
            <TabsContent value={TabEnum.CUSTOM} className="mt-6">
              <CustomServiceContent />
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
                <BlockBox className="flex items-center justify-between space-y-0">
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
                </BlockBox>
              )}
            </div>
          )}

          {activeTab === TabEnum.ADVANCED && (
            <div className="space-y-5">
              <TitleDiv>{t('feature.display.options')}</TitleDiv>
              <RadioGroup.Root className="flex flex-col gap-3 md:flex-row md:gap-6" value={featureView}>
                {[EFeatureView.OVERVIEW, EFeatureView.DETAIL].map((listType) => (
                  <BlockBox className="flex h-full flex-1 items-center space-x-2 space-y-0" key={listType}>
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
                    className="flex h-full flex-1 items-center space-x-2 space-y-0"
                    key={String(radio)}
                  >
                    <RadioGroup.Item
                      className={cn(
                        'mr-2 flex size-4 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)]',
                        showNoBuyFeature === radio ? 'border-[#3366FF]' : 'hover:border-white/40',
                      )}
                      value={radio.toString()}
                      onClick={() => setShowNoBuyFeature(radio)}
                    >
                      <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                    </RadioGroup.Item>
                    <Label className="text-[14px] leading-[1.3em] text-white">
                      {radio ? t('show.unselected.modules') : t('hide.unselected.modules')}
                    </Label>
                  </BlockBox>
                ))}
              </RadioGroup.Root>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-white/15 bg-black p-5 md:px-[60px] md:py-7">
        <div className="flex items-center gap-3 text-white">
          <span className="text-base font-medium">{t('custom.total')}</span>
          <span className="text-2xl font-semibold">{subtotal}</span>
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
    </div>
  )
}
