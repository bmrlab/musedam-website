'use client'

import { useTranslation } from '@/app/i18n/client'
import {
  usePricing,
  useBasicConfigs,
  useAdvancedModuleGroups,
  EAdvancedModules,
  EPrivateImplProducts,
  IModules,
  IModuleGroup,
  calcPrivateBasicMaintenance,
  calcPrivateLicenseFee,
  isSaasProductSelected,
  useCustomServiceRoleOptions,
} from './config'
import { TabEnum } from './types'
import { formatWithToLocaleString } from '@/utilities/formatPrice'
import { useCountry } from '@/providers/Country'
import { useMemo } from 'react'
import { useQuotationStore } from '@/providers/QuotationStore'
import {
  AI_POINTS_PER_PACK,
  BillingMode,
  EGeaBaseModules,
  PRIVATE_DEFAULT_AI_POINTS,
} from './enums'
import { useLanguage } from '@/providers/Language'
import {
  calcMemberSeatsCost,
  calcStorageCost,
  getSeatPricingMode,
  getSeatTier,
} from './seatStorage'
import { getModuleSku } from './skuMap'

export interface QuoteDetailRow {
  name: React.ReactNode
  quantity: string
  unit?: string
  subtotal?: number | string
  bold?: boolean
  isSection?: boolean
  isModule?: boolean
  des?: string
  previewDes?: string
  key?: string
  /** 刊例 SKU，前端可不展示 */
  sku?: string
  groupId?: string
  billingMode?: BillingMode
  oneTime?: boolean
}

export interface QuoteDetailRowFormatted {
  name: React.ReactNode
  quantity: string
  unit?: string
  subtotal?: string
  /** 该行小计的数值（已乘订阅年限），用于「优惠折扣」列计算 */
  amount?: number
  bold?: boolean
  isSection?: boolean
  isModule?: boolean
  des?: string
  previewDes?: string
  key?: string
  /** 刊例 SKU，前端可不展示 */
  sku?: string
  groupId?: string
  billingMode?: BillingMode
  oneTime?: boolean
}

export interface QuoteDetailData {
  rows: QuoteDetailRowFormatted[]
  allModules: QuoteDetailRow[]
  subtotal: string
  total: string
  years: number
  totalNumPerYear: number
  basicCostPerYear: number
  discountTotal?: string
  hasSSOType: EAdvancedModules[]
  /** 用于赠送门槛判断：不含赠送模块的 SaaS 年价（再乘整体折扣得折后总价） */
  saasPaidTotalPerYear: number
  /** 拓展模块已勾选（非赠送）年费合计 */
  extensionCostPerYear: number
  /** 私有化授权费基数：模块费 + 席位费（不含存储） */
  saasLicenseBasePerYear: number
  /** 私有化一次性实施费用合计 */
  privateOneTimeTotal: number
  /** 定制服务一次性费用合计 */
  customOneTimeTotal: number
}

/** 基础配置里支持「合并到主报价」的项（席位见 SEAT_UNMERGE_KEY） */
export const MERGEABLE_BASIC_KEYS = {
  AI_POINTS_PACK: EGeaBaseModules.AI_POINTS_PACK as string,
  STORAGE: 'storageSpace',
  AI_POINTS: 'aiPoints',
} as const

/**
 * 成员席位默认就并入主报价行，所以这里存的是「取消合并」标记：
 * set 中不含该 key = 合并（历史报价的默认行为）。
 */
export const SEAT_UNMERGE_KEY = 'memberSeatsUnmerged'

/** 存储空间在报价单中可能拆出的行 key */
const STORAGE_ROW_KEYS = [
  'storageSpace',
  'coldHotStorageFee',
  'chinaHotStorage',
  'chinaColdStorage',
  'overseasHotStorage',
  'overseasColdStorage',
  'chinaStorage',
  'overseasStorage',
]

const getBillingMode = (
  key: string,
  modes: Partial<Record<string, BillingMode>>,
): BillingMode => modes[key] ?? 'paid'

const clampModuleDiscount = (val: number) =>
  Math.min(10, Math.max(1, Math.round(val * 10) / 10))

/** 折扣 / 赠送模块在名称后追加橘色标注，如「元数据自定义字段（1 折）」 */
const withBillingSuffix = (name: React.ReactNode, suffix?: string): React.ReactNode => {
  if (!suffix) return name
  return (
    <>
      {name}
      <span className="text-[#FA8C16]">（{suffix}）</span>
    </>
  )
}

const resolveUnitPrice = (
  key: string,
  listPrice: number,
  mode: BillingMode,
  overrides: Partial<Record<string, number>>,
): number => {
  if (mode === 'gift') return 0
  if (mode === 'discount') {
    const rate = overrides[key]
    if (typeof rate === 'number') return listPrice * (clampModuleDiscount(rate) / 10)
    return listPrice
  }
  return listPrice
}

export const useQuoteDetailData = (): QuoteDetailData => {
  const {
    activeTab,
    advancedConfig,
    advancedModules,
    privateConfig,
    privateImplProducts,
    customServices,
    basicConfig,
    subscriptionYears,
    discount,
    customDiscount,
    rowDiscounts,
    moduleBillingModes,
    moduleVariants,
    moduleMultiSelections,
    advancedModulePriceOverrides,
    mergedToBasicModules,
    gaTagOption,
    cdnTagOption,
  } = useQuotationStore()
  const { isInChina } = useCountry()
  const { language } = useLanguage()
  const { t } = useTranslation('quotation')
  const basicConfigs = useBasicConfigs()
  const moduleGroups = useAdvancedModuleGroups()

  /** 存储空间在报价单里可能拆成冷/热、境内/境外多行，统一跟随「存储空间」的合并开关 */
  const isMergedToBasic = (rowKey: string): boolean => {
    if (mergedToBasicModules.has(rowKey as EAdvancedModules)) return true
    return (
      STORAGE_ROW_KEYS.includes(rowKey) &&
      mergedToBasicModules.has(MERGEABLE_BASIC_KEYS.STORAGE as EAdvancedModules)
    )
  }

  /** 折扣 / 赠送模块在报价单名称后的橘色标注文案 */
  const billingSuffix = (row: QuoteDetailRow): string | undefined => {
    if (!row.key) return undefined
    if (row.billingMode === 'gift') return t('billing.gift')
    if (row.billingMode !== 'discount') return undefined
    const rate = advancedModulePriceOverrides[row.key as EAdvancedModules]
    if (typeof rate !== 'number') return t('billing.discount')
    const value = clampModuleDiscount(rate)
    return language === 'zh-CN' || language === 'zh-TW'
      ? `${value}${t('discount.unit')}`
      : `${Math.round((10 - value) * 10)}% off`
  }
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
  const customRoleOptions = useCustomServiceRoleOptions()
  const { pricing, moduleNames, prefix, ssoTypeNames, allSSOType } = usePricing()
  const advancedPricing = pricing.advanced.modules

  const getYear = (years: number) => {
    if (years > 1) return `${years} ${t('years')}`
    return `1 ${t('year')}`
  }

  const renderCost = (cost: number, oneTime?: boolean) => {
    if (cost === 0) return t('free')
    return oneTime
      ? `${prefix}${formatWithToLocaleString(cost)}`
      : `${prefix}${formatWithToLocaleString(cost)}${t('per.year')}`
  }

  const rows: QuoteDetailRow[] = []
  let allModules: QuoteDetailRow[] = []
  let basicCostPerYear = 0
  let privatePerYear = 0
  let privateOneTimeTotal = 0
  let customOneTimeTotal = 0
  let hasSSOType: EAdvancedModules[] = []
  let extensionCostPerYear = 0
  let saasLicenseBasePerYear = 0
  /** 「合并到主报价」的模块把价格并入这一行（DAM，未选则 GEA） */
  let mergeTargetRowIndex: number | undefined

  const calcModuleLine = (
    module: IModules,
    opts?: { forceSelected?: boolean },
  ): QuoteDetailRow | null => {
    const { key, label, price, noCheckBox, variantOptions, multiOptions, oneTime, min, unit, sku } =
      module
    if (price === undefined || price === null) return null
    // 纯容器（无自身计价）：展开子项由调用方处理；带 multiOptions / 数量的 noCheckBox 仍需计价
    if (
      noCheckBox &&
      key !== EAdvancedModules.ENTERPRISE_SSO &&
      key !== EAdvancedModules.GA_CONTAINER &&
      !multiOptions?.length &&
      min === undefined
    ) {
      return null
    }

    const mode = getBillingMode(key, moduleBillingModes)
    const selected =
      opts?.forceSelected ||
      (key === EAdvancedModules.ENTERPRISE_SSO
        ? allSSOType.some((s) => !!advancedModules[s])
        : key === EAdvancedModules.GA_CONTAINER
          ? !!advancedModules[EAdvancedModules.CDN_GLOBAL] || !!advancedModules[EAdvancedModules.GA]
          : !!advancedModules[key])

    const resolveLineSku = (fallback?: string) => fallback ?? sku ?? getModuleSku(key)

    // Variant modules
    if (variantOptions?.length) {
      const variantValue = moduleVariants[key] ?? variantOptions[0].value
      const variant = variantOptions.find((v) => v.value === variantValue) ?? variantOptions[0]
      const unitPrice = resolveUnitPrice(key, variant.price, mode, advancedModulePriceOverrides)
      return {
        key,
        sku: resolveLineSku(variant.sku),
        name: `${label}（${variant.label}）`,
        quantity: oneTime ? '1' : getYear(selected ? subscriptionYears : 1),
        unit: mode === 'gift' ? t('free') : renderCost(unitPrice, oneTime),
        subtotal: selected ? (mode === 'gift' ? t('free') : unitPrice) : unitPrice,
        isModule: true,
        billingMode: mode,
        notBuy: !selected,
      } as QuoteDetailRow & { notBuy?: boolean }
    }

    // Multi-select channel / feature priced per selection
    if (multiOptions?.length && (key === EAdvancedModules.SOCIAL_CHANNELS || key === EAdvancedModules.ECOM_CHANNELS || key === EAdvancedModules.REGIONAL_COMPLIANCE || key === EAdvancedModules.FEATURE_LIBRARY)) {
      const selectedOpts = moduleMultiSelections[key] ?? []
      const count = selectedOpts.length
      const unitPrice = resolveUnitPrice(key, price, mode, advancedModulePriceOverrides)
      const cost = unitPrice * Math.max(count, 0)
      const names = selectedOpts
        .map((v) => multiOptions.find((o) => o.value === v)?.label)
        .filter(Boolean)
        .join(', ')
      const selectedSkus = selectedOpts
        .map((v) => multiOptions.find((o) => o.value === v)?.sku)
        .filter(Boolean) as string[]
      const isSelected = count > 0 || !!advancedModules[key]
      return {
        key,
        sku: selectedSkus.length ? selectedSkus.join(',') : resolveLineSku(),
        name: names ? `${label}（${names}）` : label,
        quantity: oneTime ? String(Math.max(count, 1)) : getYear(isSelected ? subscriptionYears : 1),
        unit:
          mode === 'gift'
            ? t('free')
            : `${prefix}${formatWithToLocaleString(unitPrice)}${unit ?? t('per.year')}`,
        subtotal: isSelected ? (mode === 'gift' ? t('free') : cost) : cost,
        isModule: true,
        billingMode: mode,
        notBuy: !isSelected,
      } as QuoteDetailRow & { notBuy?: boolean }
    }

    // SSO container
    if (key === EAdvancedModules.ENTERPRISE_SSO) {
      hasSSOType = allSSOType.filter((v) => !!advancedModules[v])
      const unitPrice = resolveUnitPrice(key, price, mode, advancedModulePriceOverrides)
      const cost = hasSSOType.length * unitPrice
      const ssoSkus = (hasSSOType.length > 0 ? hasSSOType : allSSOType)
        .map((v) => getModuleSku(v))
        .filter(Boolean) as string[]
      return {
        key,
        sku: ssoSkus.join(',') || undefined,
        name: `${label}(${(hasSSOType.length > 0 ? hasSSOType : allSSOType).map((v) => ssoTypeNames[v]).join(', ')})`,
        quantity: getYear(hasSSOType.length ? subscriptionYears : 1),
        unit: `${prefix}${formatWithToLocaleString(unitPrice)}${t('sso.unit')}`,
        subtotal: cost,
        isModule: true,
        billingMode: mode,
        notBuy: !hasSSOType.length,
      } as QuoteDetailRow & { notBuy?: boolean }
    }

    // GA container
    if (key === EAdvancedModules.GA_CONTAINER) {
      const parts: string[] = []
      const skus: string[] = []
      let totalCost = 0
      let hasSelected = false
      const cdnNum = Number(advancedModules[EAdvancedModules.CDN_GLOBAL]) || 0
      const gaNum = Number(advancedModules[EAdvancedModules.GA]) || 0
      if (cdnNum > 0) {
        const p = resolveUnitPrice(
          EAdvancedModules.CDN_GLOBAL,
          advancedPricing[EAdvancedModules.CDN_GLOBAL] ?? 30000,
          getBillingMode(EAdvancedModules.CDN_GLOBAL, moduleBillingModes),
          advancedModulePriceOverrides,
        )
        parts.push(`${t('ga.cdnOss')}(${cdnNum * 10}TB)`)
        const s = getModuleSku(EAdvancedModules.CDN_GLOBAL)
        if (s) skus.push(s)
        totalCost += p * cdnNum
        hasSelected = true
      }
      if (gaNum > 0) {
        const p = resolveUnitPrice(
          EAdvancedModules.GA,
          advancedPricing[EAdvancedModules.GA] ?? 90000,
          getBillingMode(EAdvancedModules.GA, moduleBillingModes),
          advancedModulePriceOverrides,
        )
        parts.push(`${t('ga.dedicatedLine')}(${gaNum * 10}TB)`)
        const s = getModuleSku(EAdvancedModules.GA)
        if (s) skus.push(s)
        totalCost += p * gaNum
        hasSelected = true
      }
      return {
        key,
        sku: skus.join(',') || undefined,
        name: parts.length ? `${label}(${parts.join(', ')})` : label,
        quantity: getYear(hasSelected ? subscriptionYears : 1),
        unit: renderCost(totalCost),
        subtotal: totalCost,
        isModule: true,
        notBuy: !hasSelected,
      } as QuoteDetailRow & { notBuy?: boolean }
    }

    // AI auto tag (module + optional feature library already separate)
    if (key === EAdvancedModules.AI_AUTO_TAG) {
      const unitPrice = resolveUnitPrice(
        key,
        advancedPricing[EAdvancedModules.AI_AUTO_TAG_MODULE] ?? price,
        mode,
        advancedModulePriceOverrides,
      )
      return {
        key,
        sku: resolveLineSku(),
        name: label,
        quantity: getYear(selected ? subscriptionYears : 1),
        unit: mode === 'gift' ? t('free') : renderCost(unitPrice),
        subtotal: selected ? (mode === 'gift' ? t('free') : unitPrice) : unitPrice,
        isModule: true,
        billingMode: mode,
        des: module.hint,
        notBuy: !selected,
      } as QuoteDetailRow & { notBuy?: boolean }
    }

    // Quantity modules：未勾选（数值为 0）不计价，min 仅约束勾选后的下限
    const isNumeric = typeof advancedModules[key] === 'number'
    const qty = isNumeric ? Number(advancedModules[key]) : selected ? 1 : 0
    const isSelected = isNumeric ? qty > 0 : selected
    let listPrice = price
    // legacy tag multipliers for GA/CDN if still present
    if (key === EAdvancedModules.CDN_TRAFFIC && cdnTagOption === '5TB') listPrice = price * 0.5
    if (key === EAdvancedModules.GA && gaTagOption === '5TB') listPrice = price * 0.5

    const unitPrice = resolveUnitPrice(key, listPrice, mode, advancedModulePriceOverrides)
    const multiplier = isNumeric
      ? qty > 0
        ? Math.max(qty, min ?? 0)
        : 0
      : selected
        ? 1
        : 0
    const cost = unitPrice * multiplier

    return {
      key,
      sku: resolveLineSku(),
      name: label,
      quantity: oneTime
        ? String(Math.max(multiplier, 1))
        : getYear(isSelected ? subscriptionYears : 1),
      unit: mode === 'gift' ? t('free') : renderCost(unitPrice, oneTime),
      subtotal: isSelected ? (mode === 'gift' ? t('free') : cost) : unitPrice,
      isModule: true,
      billingMode: mode,
      des: module.hint,
      notBuy: !isSelected,
    } as QuoteDetailRow & { notBuy?: boolean }
  }

  if (activeTab === TabEnum.BASIC) {
    const packageBasic = basicConfig
    const pricingBasic = pricing.basic

    rows.push({
      name: t('basic.edition'),
      quantity: `${subscriptionYears} ${subscriptionYears > 1 ? t('years') : t('year')}`,
      bold: true,
      isSection: true,
    })

    basicConfigs.forEach(({ key, title, hint }) => {
      let quantity = ''
      let cost = 0
      if (key === 'memberSeats') {
        quantity = `${packageBasic.memberSeats} ${t('seats')}`
        cost = packageBasic.memberSeats * pricingBasic.memberSeatPrice
      } else if (key === 'storageSpace') {
        quantity = `${packageBasic.storageSpace}GB`
        cost = packageBasic.storageSpace * pricingBasic.storageSpacePrice
      } else if (key === 'aiPoints') {
        quantity = `${packageBasic.aiPoints} ${t('ai.AutoTagEngine.unit')}${packageBasic.aiPoints > 1 ? t('ai.AutoTagEngine.unit.s') : ''} \n(${formatWithToLocaleString(100000 * packageBasic.aiPoints)}${t('expansion.points')})`
        cost = Math.round(packageBasic.aiPoints * pricingBasic.aiPointsPrice)
      }

      basicCostPerYear += cost
      if (cost > 0) {
        rows.push({
          key,
          name: title,
          quantity,
          des: hint.at(-1),
          unit: renderCost(
            cost /
              (key === 'memberSeats'
                ? packageBasic.memberSeats
                : key === 'storageSpace'
                  ? packageBasic.storageSpace
                  : packageBasic.aiPoints),
          ),
          subtotal: cost,
        })
      }
    })
  } else {
    // 企业版 SaaS 明细：无论当前在 SaaS / 私有化 / 定制服务页签，都始终展示
    const packageBasic = advancedConfig
    const pricingBasic = pricing.advanced

    rows.push({
      name: t('gea.plan'),
      quantity: `${subscriptionYears} ${subscriptionYears > 1 ? t('years') : t('year')}`,
      bold: true,
      isSection: true,
    })

    /**
     * 成员席位默认合并进 DAM 数字资产管理；未选 DAM 时合并进 GEA OS + Context System。
     * 两者都未选时（理论上不会发生）仍单独成行。
     */
    const memberSeatsCost = calcMemberSeatsCost(packageBasic, pricingBasic)
    const seatsMerged = !mergedToBasicModules.has(SEAT_UNMERGE_KEY as EAdvancedModules)
    const seatMergeTarget: EGeaBaseModules | undefined = !seatsMerged
      ? undefined
      : advancedConfig.geaDam
        ? EGeaBaseModules.DAM
        : advancedConfig.geaContext
          ? EGeaBaseModules.GEA_CONTEXT
          : undefined

    if (advancedConfig.geaDam) {
      const mode = getBillingMode(EGeaBaseModules.DAM, moduleBillingModes)
      const price = resolveUnitPrice(
        EGeaBaseModules.DAM,
        pricing.advanced.damPrice,
        mode,
        advancedModulePriceOverrides,
      )
      const merged = seatMergeTarget === EGeaBaseModules.DAM ? memberSeatsCost : 0
      const lineTotal = (mode === 'gift' ? 0 : price) + merged
      basicCostPerYear += lineTotal
      // DAM 行即主报价行，其它项「合并到主报价」时并入此行
      mergeTargetRowIndex = rows.length
      rows.push({
        key: EGeaBaseModules.DAM,
        sku: getModuleSku(EGeaBaseModules.DAM),
        name: t('gea.dam'),
        quantity: getYear(subscriptionYears),
        unit: mode === 'gift' && !merged ? t('free') : renderCost(lineTotal),
        subtotal: mode === 'gift' && !merged ? t('free') : lineTotal,
        billingMode: mode,
      })
    }
    if (advancedConfig.geaContext) {
      const mode = getBillingMode(EGeaBaseModules.GEA_CONTEXT, moduleBillingModes)
      const price = resolveUnitPrice(
        EGeaBaseModules.GEA_CONTEXT,
        pricing.advanced.geaContextPrice,
        mode,
        advancedModulePriceOverrides,
      )
      const merged = seatMergeTarget === EGeaBaseModules.GEA_CONTEXT ? memberSeatsCost : 0
      const lineTotal = (mode === 'gift' ? 0 : price) + merged
      basicCostPerYear += lineTotal
      // 未选 DAM 时，GEA 行作为主报价行
      if (mergeTargetRowIndex === undefined) mergeTargetRowIndex = rows.length
      rows.push({
        key: EGeaBaseModules.GEA_CONTEXT,
        sku: getModuleSku(EGeaBaseModules.GEA_CONTEXT),
        name: t('gea.context'),
        quantity: getYear(subscriptionYears),
        unit: mode === 'gift' && !merged ? t('free') : renderCost(lineTotal),
        subtotal: mode === 'gift' && !merged ? t('free') : lineTotal,
        billingMode: mode,
      })
    }
    if (advancedConfig.geaAiPointsPack > 0) {
      const mode = getBillingMode(EGeaBaseModules.AI_POINTS_PACK, moduleBillingModes)
      const unitPrice = resolveUnitPrice(
        EGeaBaseModules.AI_POINTS_PACK,
        pricing.advanced.geaAiPackPrice,
        mode,
        advancedModulePriceOverrides,
      )
      const cost = unitPrice * advancedConfig.geaAiPointsPack
      basicCostPerYear += mode === 'gift' ? 0 : cost
      rows.push({
        key: EGeaBaseModules.AI_POINTS_PACK,
        sku: getModuleSku(EGeaBaseModules.AI_POINTS_PACK),
        name: t('gea.aiPointsPack'),
        quantity: `${advancedConfig.geaAiPointsPack} ${t('ai.AutoTagEngine.unit')}`,
        unit: mode === 'gift' ? t('free') : renderCost(unitPrice),
        subtotal: mode === 'gift' ? t('free') : cost,
        billingMode: mode,
      })
    }

    basicConfigs.forEach(({ key, title, hint }) => {
      if (key === 'memberSeats') {
        // 已合并进 DAM / GEA 行，不再单独成行
        if (seatMergeTarget) return
        const cost = memberSeatsCost
        basicCostPerYear += cost
        if (cost > 0) {
          const isTier = getSeatPricingMode(packageBasic) === 'byTier'
          rows.push({
            key,
            sku: isTier
              ? getModuleSku(`seat.${getSeatTier(packageBasic)}`)
              : getModuleSku(key),
            name: title,
            quantity: isTier
              ? t(`seat.tier.${getSeatTier(packageBasic)}`)
              : `${packageBasic.memberSeats} ${t('seats')}`,
            des: hint.at(-1),
            unit: isTier
              ? renderCost(cost)
              : renderCost(pricingBasic.memberSeatPrice),
            subtotal: cost,
          })
        }
        return
      }

      if (key === 'storageSpace') {
        if (packageBasic.enableColdHotStorage) {
          const fee = pricingBasic.coldHotStorageFee
          basicCostPerYear += fee
          if (fee > 0) {
            rows.push({
              key: 'coldHotStorageFee',
              sku: getModuleSku('coldHotStorageFee'),
              name: t('storage.coldHot'),
              quantity: '1',
              unit: renderCost(fee),
              subtotal: fee,
            })
          }
          const pushStorageLine = (
            rowKey: string,
            name: string,
            qty: number,
            unitPrice: number,
          ) => {
            if (qty <= 0) return
            const lineCost = qty * unitPrice
            basicCostPerYear += lineCost
            rows.push({
              key: rowKey,
              sku: getModuleSku(rowKey) ?? getModuleSku(key),
              name,
              quantity: `${qty}TB`,
              unit: renderCost(unitPrice),
              subtotal: lineCost,
            })
          }
          pushStorageLine(
            'chinaHotStorage',
            `${t('storage.china')} · ${t('storage.hot.full')}`,
            packageBasic.chinaHotStorage ?? 0,
            pricingBasic.chinaHotStoragePrice,
          )
          pushStorageLine(
            'chinaColdStorage',
            `${t('storage.china')} · ${t('storage.cold.full')}`,
            packageBasic.chinaColdStorage ?? 0,
            pricingBasic.chinaColdStoragePrice,
          )
          if (packageBasic.enableMultiRegionStorage) {
            pushStorageLine(
              'overseasHotStorage',
              `${t('storage.overseas')} · ${t('storage.hot.full')}`,
              packageBasic.overseasHotStorage ?? 0,
              pricingBasic.overseasHotStoragePrice,
            )
            pushStorageLine(
              'overseasColdStorage',
              `${t('storage.overseas')} · ${t('storage.cold.full')}`,
              packageBasic.overseasColdStorage ?? 0,
              pricingBasic.overseasColdStoragePrice,
            )
          }
          return
        }

        if (packageBasic.enableMultiRegionStorage) {
          const pushStorageLine = (
            rowKey: string,
            name: string,
            qty: number,
            unitPrice: number,
          ) => {
            if (qty <= 0) return
            const lineCost = qty * unitPrice
            basicCostPerYear += lineCost
            rows.push({
              key: rowKey,
              sku: getModuleSku(rowKey) ?? getModuleSku(key),
              name,
              quantity: `${qty}TB`,
              unit: renderCost(unitPrice),
              subtotal: lineCost,
            })
          }
          pushStorageLine(
            'chinaStorage',
            `${t('storage.china')} · ${t('storage.space')}`,
            packageBasic.chinaHotStorage ?? packageBasic.storageSpace ?? 0,
            pricingBasic.chinaHotStoragePrice,
          )
          pushStorageLine(
            'overseasStorage',
            `${t('storage.overseas')} · ${t('storage.space')}`,
            packageBasic.overseasHotStorage ?? 0,
            pricingBasic.overseasHotStoragePrice,
          )
          return
        }

        const cost = calcStorageCost(packageBasic, pricingBasic)
        basicCostPerYear += cost
        if (cost > 0) {
          rows.push({
            key,
            sku: getModuleSku(key),
            name: title,
            quantity: `${packageBasic.storageSpace}TB`,
            des: hint.at(-1),
            unit: renderCost(pricingBasic.storageSpacePrice),
            subtotal: cost,
          })
        }
        return
      }

      if (key === 'aiPoints') {
        const quantity = `${packageBasic.aiPoints} ${t('ai.AutoTagEngine.unit')}${packageBasic.aiPoints > 1 ? t('ai.AutoTagEngine.unit.s') : ''} \n(${formatWithToLocaleString(100000 * packageBasic.aiPoints)}${t('expansion.points')})`
        const cost = Math.round(packageBasic.aiPoints * pricingBasic.aiPointsPrice)
        basicCostPerYear += cost
        if (cost > 0) {
          rows.push({
            key,
            sku: getModuleSku(key),
            name: title,
            quantity,
            des: hint.at(-1),
            unit: renderCost(pricingBasic.aiPointsPrice),
            subtotal: cost,
          })
        }
      }
    })

    const collected: QuoteDetailRow[] = []

    const pushModuleTree = (module: IModules, group: IModuleGroup) => {
      if (module.noCheckBox && module.noPrice && module.subModules?.length) {
        module.subModules.forEach((sub) => pushModuleTree(sub, group))
        return
      }

      const line = calcModuleLine(module)
      if (line) {
        collected.push({ ...line, groupId: group.id })
      }

      if (module.subModules?.length && module.key === EAdvancedModules.AI_AUTO_TAG) {
        module.subModules.forEach((sub) => {
          const subLine = calcModuleLine(sub)
          if (subLine) collected.push({ ...subLine, groupId: group.id })
        })
      }
      if (module.subModules?.length && module.key === EAdvancedModules.AI_FEATURE_RECOGNITION) {
        module.subModules.forEach((sub) => {
          const subLine = calcModuleLine(sub)
          if (subLine) collected.push({ ...subLine, groupId: group.id })
        })
      }
      if (module.subModules?.length && module.key === EAdvancedModules.COMPLIANCE_CHECK) {
        module.subModules.forEach((sub) => {
          const subLine = calcModuleLine(sub)
          if (subLine) collected.push({ ...subLine, groupId: group.id })
        })
      }
    }

    visibleModuleGroups.forEach((group) => {
      group.modules.forEach((m) => pushModuleTree(m, group))
    })

    allModules = collected

    const purchased = collected.filter((v) => !(v as any).notBuy && v.key)

    if (purchased.length > 0) {
      rows.push({
        name: t('extension.modules'),
        quantity: '',
        unit: '',
        subtotal: '',
        isSection: true,
        bold: true,
      })

      // 走查：报价单不再展示 7 大模块分组标题，仅列出已购模块
      purchased.forEach((module) => {
        const cost = typeof module.subtotal === 'number' ? module.subtotal : 0
        rows.push(module)
        if (module.billingMode !== 'gift') {
          extensionCostPerYear += cost
        }
      })
    }

    /**
     * 「合并到主报价」：基础配置项与拓展模块统一处理 —— 行内只列名称，
     * 价格并入主报价行（DAM，未选则 GEA）。总价不变，仅展示位置变化。
     */
    if (mergeTargetRowIndex !== undefined) {
      let mergedCostPerYear = 0
      rows.forEach((row, index) => {
        if (index === mergeTargetRowIndex || !row.key) return
        if (!isMergedToBasic(row.key)) return
        if (row.billingMode !== 'gift' && typeof row.subtotal === 'number') {
          mergedCostPerYear += row.subtotal
        }
        rows[index] = { ...row, unit: undefined, subtotal: undefined }
      })
      if (mergedCostPerYear > 0) {
        const target = rows[mergeTargetRowIndex]
        const base = typeof target.subtotal === 'number' ? target.subtotal : 0
        const nextTotal = base + mergedCostPerYear
        rows[mergeTargetRowIndex] = {
          ...target,
          unit: renderCost(nextTotal),
          subtotal: nextTotal,
        }
      }
    }
  }

  // SaaS 授权费基数：DAM + GEA Context + 席位 + 拓展模块（不含存储 / AI 点数包）
  {
    let licenseBase = 0
    if (advancedConfig.geaDam) {
      const mode = getBillingMode(EGeaBaseModules.DAM, moduleBillingModes)
      if (mode !== 'gift') {
        licenseBase += resolveUnitPrice(
          EGeaBaseModules.DAM,
          pricing.advanced.damPrice,
          mode,
          advancedModulePriceOverrides,
        )
      }
    }
    if (advancedConfig.geaContext) {
      const mode = getBillingMode(EGeaBaseModules.GEA_CONTEXT, moduleBillingModes)
      if (mode !== 'gift') {
        licenseBase += resolveUnitPrice(
          EGeaBaseModules.GEA_CONTEXT,
          pricing.advanced.geaContextPrice,
          mode,
          advancedModulePriceOverrides,
        )
      }
    }
    licenseBase += calcMemberSeatsCost(advancedConfig, pricing.advanced)
    licenseBase += extensionCostPerYear
    saasLicenseBasePerYear = licenseBase
  }

  // 私有化费用：开关开启即计入报价（不依赖当前页签）
  if (privateConfig.enabled) {
    rows.push({
      name: t('private.cloud.title'),
      quantity: getYear(subscriptionYears),
      bold: true,
      isSection: true,
    })

    if (privateConfig.licenseEnabled) {
      const licenseFee = calcPrivateLicenseFee(privateConfig.licenseType, saasLicenseBasePerYear, {
        perpetualBuyout: pricing.private.perpetualBuyout,
        sourceMultiplier: pricing.private.sourceMultiplier,
      })
      const isPerpetual = privateConfig.licenseType === 'perpetual'
      if (!isPerpetual) privatePerYear += licenseFee
      else privateOneTimeTotal += licenseFee

      const licenseLabel =
        privateConfig.licenseType === 'encrypted'
          ? t('private.license.encrypted')
          : privateConfig.licenseType === 'source'
            ? t('private.license.source')
            : t('private.license.perpetual')

      rows.push({
        key: 'privateLicense',
        name: `${t('private.license.fee')}（${licenseLabel}）`,
        quantity: isPerpetual ? '1' : getYear(subscriptionYears),
        unit: renderCost(licenseFee, isPerpetual),
        subtotal: licenseFee,
        oneTime: isPerpetual,
        des: t('private.license.hint'),
      })
    }

    if (privateConfig.opsEnabled) {
      if (privateConfig.basicMaintenance) {
        const maintenanceBase =
          privateConfig.licenseEnabled && privateConfig.licenseType !== 'perpetual'
            ? calcPrivateLicenseFee(privateConfig.licenseType, saasLicenseBasePerYear, {
                perpetualBuyout: pricing.private.perpetualBuyout,
                sourceMultiplier: pricing.private.sourceMultiplier,
              })
            : saasLicenseBasePerYear
        const price = calcPrivateBasicMaintenance(
          maintenanceBase,
          pricing.private.basicMaintenanceRate,
        )
        privatePerYear += price
        rows.push({
          key: 'privateBasicMaintenance',
          sku: getModuleSku('private.ops.basic'),
          name: t('private.ops.basic'),
          quantity: getYear(subscriptionYears),
          unit: renderCost(price),
          subtotal: price,
          des: t('private.ops.basic.rate', {
            rate: String(Math.round(pricing.private.basicMaintenanceRate * 100)),
          }),
        })
      }
      const price = pricing.private.iterationPrices[privateConfig.iterationFrequency] ?? 0
      const iterationListPrice =
        pricing.private.iterationListPrices[privateConfig.iterationFrequency] ?? price
      // 限时折扣档位（如一年4次 5 折）在名称后标注折扣
      const iterationRate =
        iterationListPrice > price && iterationListPrice > 0
          ? clampModuleDiscount((price / iterationListPrice) * 10)
          : undefined
      const iterationSuffix =
        iterationRate === undefined
          ? undefined
          : language === 'zh-CN' || language === 'zh-TW'
            ? `${iterationRate}${t('discount.unit')}`
            : `${Math.round((10 - iterationRate) * 10)}% off`
      privatePerYear += price
      rows.push({
        key: 'privateVersionIteration',
        sku: getModuleSku(`private.ops.iteration.${privateConfig.iterationFrequency}`),
        name: withBillingSuffix(
          `${t('private.ops.iteration')}（${t('private.ops.iteration.times', { times: privateConfig.iterationFrequency })}）`,
          iterationSuffix,
        ),
        quantity: getYear(subscriptionYears),
        unit: renderCost(price),
        subtotal: price,
      })
    }

    if (privateConfig.aiPointsEnabled) {
      const points = privateConfig.aiPointsOption ?? PRIVATE_DEFAULT_AI_POINTS
      const packs = points / AI_POINTS_PER_PACK
      const unitPrice = pricing.advanced.geaAiPackPrice
      const price = packs * unitPrice
      privatePerYear += price
      rows.push({
        key: 'privateAiPoints',
        sku: getModuleSku('privateAiPoints'),
        name: t('private.aiPointsPack'),
        quantity: t('gea.aiPointsPack.tag', { points: String(points / 10000) }),
        unit: renderCost(unitPrice),
        subtotal: price,
        des: t('gea.aiPointsPack.cycleHint'),
      })
    }

    if (privateConfig.implementationEnabled) {
      const implItems: { key: EPrivateImplProducts; label: string }[] = [
        { key: EPrivateImplProducts.DAM, label: t('gea.dam') },
        { key: EPrivateImplProducts.GEA_CONTEXT, label: t('gea.context') },
        { key: EPrivateImplProducts.MUSE_AI, label: t('module.museAI') },
        { key: EPrivateImplProducts.INGEN_OPS, label: t('module.ingenOps') },
        { key: EPrivateImplProducts.CLIPO_REMIX, label: t('module.clipoRemix') },
      ]

      const selectedImpl = implItems.filter(
        ({ key }) =>
          isSaasProductSelected(key, advancedConfig, advancedModules) ||
          !!privateImplProducts[key],
      )

      if (selectedImpl.length > 0) {
        rows.push({
          name: t('private.implementation.once'),
          quantity: '',
          unit: '',
          subtotal: '',
          isSection: true,
          bold: true,
        })
        selectedImpl.forEach(({ key, label }) => {
          const price = pricing.private.implProducts[key]
          privateOneTimeTotal += price
          rows.push({
            key,
            sku: getModuleSku(key),
            name: label,
            quantity: '1',
            unit: renderCost(price, true),
            subtotal: price,
            oneTime: true,
            isModule: true,
          })
        })
      }
    }
  }

  const validCustomServices = customServices.filter((service) => service.name.trim())
  if (validCustomServices.length > 0) {
    rows.push({
      name: t('custom.service.section.pro'),
      quantity: '',
      unit: '',
      subtotal: '',
      isSection: true,
      bold: true,
    })

    const roleMap = new Map(customRoleOptions.map((option) => [option.value, option]))
    validCustomServices.forEach((service) => {
      const lineBlocks: string[] = []
      let serviceCost = 0
      let totalQuantity = 0

      service.roleLines.forEach((line) => {
        const option = roleMap.get(line.role)
        const roleName =
          line.role === 'custom' && line.customRoleName ? line.customRoleName : option?.label
        const price = option?.price ?? 0
        const cost = price * line.quantity
        serviceCost += cost
        totalQuantity += line.quantity

        const descriptions = service.roleByDetail
          ? service.details
              .filter((detail) => detail.id === line.detailId && detail.description.trim())
              .map((detail) => detail.description.trim())
          : service.details
              .filter((detail) => detail.description.trim())
              .map((detail) => detail.description.trim())

        const detailText = descriptions.join('；')
        const titleLine =
          detailText && roleName
            ? `${detailText}：${roleName}`
            : detailText || roleName || ''

        lineBlocks.push(
          [
            titleLine,
            `${prefix}${formatWithToLocaleString(price)}${t('custom.perPersonDay')} × ${line.quantity}${t('custom.personDay')}`,
          ]
            .filter(Boolean)
            .join('\n'),
        )
      })

      // 定制服务可单独设置折扣
      const discountedServiceCost = Math.round(serviceCost * ((customDiscount ?? 10) / 10))
      customOneTimeTotal += discountedServiceCost
      rows.push({
        key: service.id,
        name: service.name,
        quantity: totalQuantity ? `${totalQuantity}${t('custom.personDay')}` : '',
        unit: undefined,
        subtotal: discountedServiceCost,
        oneTime: true,
        des: lineBlocks.join('\n\n'),
      })
    })
  }

  const saasAnnual = basicCostPerYear + extensionCostPerYear
  const annualTotal = saasAnnual + privatePerYear
  const noTaxTotal =
    annualTotal * subscriptionYears + privateOneTimeTotal + customOneTimeTotal

  /** 该行小计的数值（已乘订阅年限） */
  const rowAmount = (v: QuoteDetailRow): number | undefined => {
    if (typeof v.subtotal !== 'number') return undefined
    const years = v.oneTime || v.key === EAdvancedModules.PORTAL_THEME ? 1 : subscriptionYears
    return v.subtotal * years
  }

  /**
   * 折后小计：默认整体折扣；「优惠折扣」列被编辑过的行按其系数叠加差额。
   * 小计（未税）不受影响，仅折后小计变化。
   */
  const defaultFactor = (discount || 10) / 10
  const rowDiscountDelta = rows.reduce((sum, v) => {
    if (!v.key) return sum
    const override = rowDiscounts[v.key]
    if (typeof override !== 'number') return sum
    const amount = rowAmount(v)
    if (amount === undefined) return sum
    return sum + amount * (override - defaultFactor)
  }, 0)
  const discountTotal = noTaxTotal * defaultFactor + rowDiscountDelta

  // silence unused
  void moduleNames
  void basicConfig

  return {
    rows: rows.map((v) => ({
      ...v,
      name: withBillingSuffix(v.name, billingSuffix(v)),
      amount: rowAmount(v),
      subtotal:
        typeof v.subtotal === 'string'
          ? v.subtotal
          : v.subtotal
            ? prefix +
              (
                Number(v.subtotal) *
                (v.oneTime || v.key === EAdvancedModules.PORTAL_THEME ? 1 : subscriptionYears)
              ).toLocaleString()
            : undefined,
    })),
    allModules,
    subtotal: prefix + noTaxTotal.toLocaleString(),
    total: prefix + (discountTotal * (isInChina ? 1.06 : 1)).toLocaleString(),
    discountTotal: discount ? prefix + discountTotal.toLocaleString() : undefined,
    years: subscriptionYears,
    basicCostPerYear,
    extensionCostPerYear,
    totalNumPerYear:
      annualTotal + (privateOneTimeTotal + customOneTimeTotal) / subscriptionYears,
    hasSSOType,
    /** 赠送门槛仅看 SaaS 付费年价，不含私有化 */
    saasPaidTotalPerYear: saasAnnual,
    saasLicenseBasePerYear,
    privateOneTimeTotal,
    customOneTimeTotal,
  }
}

export const useExpandServices = () => {
  const { t } = useTranslation('quotation')
  const { isInChina } = useCountry()
  const { language } = useLanguage()

  const expansions = useMemo(
    () => [
      {
        name: t('expansion.memberSeats'),
        description: t('expansion.memberSeats.desc'),
        value: (isInChina ? '¥1,000' : '$300') + t('memberSeats.perYear'),
        unit: (isInChina ? '¥1,000' : '$300') + t('memberSeats.perYear'),
        quantity: `1 ${t('year')}`,
      },
      {
        name: t('expansion.storageSpace'),
        description: t('expansion.storageSpace.desc'),
        value: (isInChina ? '¥5,000/TB' : '$1,000/TB') + t('per.year'),
        unit: (isInChina ? '¥5,000/TB' : '$1,000/TB') + t('per.year'),
        quantity: `1 ${t('year')}`,
      },
      {
        name: t('expansion.aiPoints'),
        description: t('expansion.aiPoints.desc'),
        value: `${isInChina ? '¥20,000' : '$4,000'}${t('per.year')}\n /100,000` + t('expansion.points'),
        unit: (isInChina ? '¥20,000' : '$4,000') + '/' + t('ai.AutoTagEngine.unit'),
        quantity: `1 ${t('year')}\n${t('ai.AutoTagEngine.quantity', { value: language === 'zh-CN' ? 10 : (100000).toLocaleString() })}`,
      },
      {
        name: t('expansion.downloadData'),
        description: t('expansion.downloadData.desc'),
        value: isInChina ? '¥600/TB' : '$120/TB',
        unit: (isInChina ? '¥600' : '$120') + '/TB',
        quantity: `1 ${t('ai.AutoTagEngine.unit')}${t('expand.download.quantity', { value: '1TB' })}`,
      },
      {
        name: t('expansion.CDN'),
        description: t('expansion.CDN.desc'),
        value: isInChina ? '¥600/TB' : '$120/TB',
        unit: (isInChina ? '¥600' : '$120') + '/TB',
        quantity: `1 ${t('ai.AutoTagEngine.unit')}${t('expand.download.quantity', { value: '1TB' })}`,
      },
      ...(!isInChina
        ? []
        : [
            {
              name: t('expansion.baiduDrive'),
              description: t('expansion.baiduDrive.desc'),
              value: '¥600/TB',
              unit: '¥600/TB',
              quantity: `1 ${t('ai.AutoTagEngine.unit')}${t('expand.download.quantity', { value: '1TB' })}`,
            },
            {
              name: t('expansion.GA'),
              description: `${t('expansion.GA.cdnOss.desc')}\n${t('expansion.GA.dedicatedLine.desc')}`,
              // 数量 / 单价按 CDN、GA 两行分行展示
              value: '¥3,000/TB\n¥9,000/TB',
              unit: '¥3,000/TB\n¥9,000/TB',
              quantity: `1 ${t('ai.AutoTagEngine.unit')}${t('expand.download.quantity', { value: '1TB' })}\n1 ${t('ai.AutoTagEngine.unit')}${t('expand.download.quantity', { value: '1TB' })}`,
            },
          ]),
    ],
    [t, isInChina, language],
  )

  return expansions
}
