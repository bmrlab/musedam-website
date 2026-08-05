import { useMemo } from 'react'
import { useCountry } from '@/providers/Country'
import { useQuotationStore } from '@/providers/QuotationStore'
import { formatWithToLocaleString } from '@/utilities/formatPrice'

import { useTranslation } from '@/app/i18n/client'

import {
  BillingMode,
  EAdvancedModules,
  EBasicConfigKey,
  EGeaBaseModules,
  EModuleGroupId,
  EPrivateImplProducts,
  EPrivateModules,
  ExtensionBaseProduct,
  PrivateIterationFrequency,
  PrivateLicenseType,
} from './enums'
import { CustomServiceRole, TabEnum } from './types'
import { getModuleSku } from './skuMap'

export { getModuleSku, MODULE_SKU_MAP } from './skuMap'

export {
  EAdvancedModules,
  EBasicConfigKey,
  EGeaBaseModules,
  EModuleGroupId,
  EPrivateImplProducts,
  EPrivateModules,
} from './enums'
export type { BillingMode, PrivateIterationFrequency, PrivateLicenseType } from './enums'

export interface IVariantOption {
  label: string
  value: string
  price: number
  launchTag?: string
  description?: string
  /** 刊例 SKU，前端可不展示 */
  sku?: string
}

export interface IModules {
  key: EAdvancedModules
  label: string
  price: number
  min?: number
  disabled?: boolean
  subFlex?: 'row' | 'column'
  hint?: string
  /** 刊例「功能描述」，用于 Info tooltip */
  description?: string
  /** 刊例 SKU，前端可不展示 */
  sku?: string
  tag?: string
  tagOptions?: { label: string; value: string; priceMultiplier?: number }[]
  noPrice?: boolean
  unit?: string
  noCheckBox?: boolean
  subModules?: IModules[]
  /** 绿色预计上线标签 */
  launchTag?: string
  /** 是否可展示付费/折扣/赠送 */
  giftEligible?: boolean
  /** 可选赠送门槛文案 / SaaS 总价门槛（元） */
  giftBadge?: string
  giftThreshold?: number
  /** 版本 radio 选项（选中父模块后展示） */
  variantOptions?: IVariantOption[]
  /** 多选渠道/特征等 */
  multiOptions?: {
    label: string
    value: string
    launchTag?: string
    fullRow?: boolean
    description?: string
    sku?: string
  }[]
  /** 一次性收费 */
  oneTime?: boolean
  /** 父模块依赖（未购买父模块时禁用） */
  requires?: EAdvancedModules
  /** 卡片容器样式（如社媒账户增购） */
  boxed?: boolean
  /** 多选选项列数，默认 3（md） */
  multiCols?: 2 | 3
  /** 自定义价格文案（如点数包等价值），优先于默认价格格式 */
  priceText?: string
  /** 未勾选父模块时也展示子模块 */
  alwaysShowSubs?: boolean
}

export interface IModuleGroup {
  id: EModuleGroupId
  title: string
  modules: IModules[]
  /** 归属基础模块；未勾选对应基础模块时不展示 */
  baseProduct?: ExtensionBaseProduct
}

export const usePricing = () => {
  const { t } = useTranslation('quotation')
  const { isInChina } = useCountry()
  const { businessRole } = useQuotationStore()
  const isGlobal = !isInChina
  const prefix = isGlobal ? '$' : '¥'
  // Pod: 20w/年；Muse: 5w/年
  const damPriceByRole = businessRole === 'pod' ? 200000 : 50000

  const pricing = useMemo(
    () => ({
      basic: isGlobal
        ? {
            baseCost: 0,
            memberSeatPrice: 300,
            storageSpacePrice: 120,
            aiPointsPrice: 1000,
          }
        : {
            baseCost: 0,
            memberSeatPrice: 1000,
            storageSpacePrice: 600,
            aiPointsPrice: 20000,
          },
      advanced: isGlobal
        ? {
            baseCost: 0,
            damPrice: 0, // TODO: overseas price
            geaContextPrice: 0, // TODO: overseas price
            geaAiPackPrice: 0, // TODO: overseas price (1万点)
            memberSeatPrice: 300,
            storageSpacePrice: 1000,
            seatTierPrices: {
              lte200: 30000,
              lte500: 45000,
              lte1000: 60000,
              unlimited: 90000,
            },
            coldHotStorageFee: 20000,
            chinaHotStoragePrice: 1000,
            chinaColdStoragePrice: 100,
            overseasHotStoragePrice: 2000,
            overseasColdStoragePrice: 400,
            aiPointsPrice: 4000,
            modules: {
              [EAdvancedModules.ADVANCED_FEATURES]: 9000,
              [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: 5000,
              [EAdvancedModules.SMART_FOLDERS]: 10000,
              [EAdvancedModules.CUSTOM_METADATA_FIELDS]: 15000,
              [EAdvancedModules.BRAND_LIBRARY]: 0, // TODO: overseas price
              [EAdvancedModules.PRODUCT_LIBRARY]: 0, // TODO: overseas price
              [EAdvancedModules.PROJECT_HUB]: 0, // TODO: overseas price
              [EAdvancedModules.ASSET_ANALYTICS]: 0, // TODO: overseas price
              [EAdvancedModules.STANDARD_PROJECT_HUB]: 15000,
              [EAdvancedModules.ADVANCED_PROJECT_HUB]: 30000,
              [EAdvancedModules.AI_AUTO_TAG_MODULE]: 6000,
              [EAdvancedModules.AI_AUTO_TAG_POINTS]: 1000,
              [EAdvancedModules.FEATURE_LIBRARY]: 0, // TODO: overseas price
              [EAdvancedModules.AI_FEATURE_RECOGNITION]: 0, // TODO: overseas price
              [EAdvancedModules.AI_FEATURE_POINTS]: 1000,
              [EAdvancedModules.MUSE_AI]: 20000,
              [EAdvancedModules.MUSE_AI_BASIC]: 10000, // TODO: overseas price
              [EAdvancedModules.MUSE_AI_STANDARD]: 0, // TODO: overseas price
              [EAdvancedModules.MUSE_AI_ADVANCED]: 40000, // TODO: overseas price
              [EAdvancedModules.BATCH_TEMPLATING]: 15000,
              [EAdvancedModules.PROFESSIONAL_PRINT]: 0, // TODO: overseas price
              [EAdvancedModules.HTML_EXPORT]: 0, // TODO: overseas price
              [EAdvancedModules.MUSE_CUT]: 30000,
              [EAdvancedModules.CLIPO_REMIX]: 0, // TODO: overseas price
              [EAdvancedModules.CLIPO_REMIX_BEE]: 0, // TODO: overseas price
              [EAdvancedModules.CLIPO_REMIX_PANDA]: 0, // TODO: overseas price
              [EAdvancedModules.CLIPO_REMIX_LION]: 0, // TODO: overseas price
              [EAdvancedModules.CREATIVE_AI_POINTS]: 1000,
              [EAdvancedModules.FILE_COLLECTION]: 0, // TODO: overseas price
              [EAdvancedModules.APPROVAL_CENTER]: 0, // TODO: overseas price
              [EAdvancedModules.DELIVERY_APPROVAL_CENTER]: 15000,
              [EAdvancedModules.TASK_WORKFLOW]: 0, // TODO: overseas price
              [EAdvancedModules.TASK_WORKFLOW_BASIC]: 0, // TODO: overseas price
              [EAdvancedModules.TASK_WORKFLOW_ADVANCED]: 0, // TODO: overseas price
              [EAdvancedModules.AUTOMATION_CENTER]: 0, // TODO: overseas price
              [EAdvancedModules.COMPLIANCE_CHECK]: 15000,
              [EAdvancedModules.REGIONAL_COMPLIANCE]: 0, // TODO: overseas price
              [EAdvancedModules.BRAND_COMPLIANCE_AGENT]: 0, // TODO: overseas price
              [EAdvancedModules.STORE_INSPECTION_AGENT]: 0, // TODO: overseas price
              [EAdvancedModules.COPYRIGHT_MANAGEMENT]: 15000,
              [EAdvancedModules.WATERMARK]: 15000,
              [EAdvancedModules.PUBLIC_ASSETS_AND_DERIVATIVES]: 15000,
              [EAdvancedModules.DAT]: 5000,
              [EAdvancedModules.PORTAL]: 0, // TODO: overseas price
              [EAdvancedModules.PORTAL_THEME]: 0, // TODO: overseas price
              [EAdvancedModules.SOCIAL_ARTICLE]: 0, // TODO: overseas price
              [EAdvancedModules.SOCIAL_ATTRIBUTION]: 0, // TODO: overseas price
              [EAdvancedModules.SOCIAL_CHANNELS]: 0, // TODO: overseas price
              [EAdvancedModules.SOCIAL_ACCOUNT_PACK]: 0, // TODO: overseas price
              [EAdvancedModules.ECOM_CHANNELS]: 0, // TODO: overseas price
              [EAdvancedModules.ECOM_ACCOUNT_PACK]: 0, // TODO: overseas price
              [EAdvancedModules.ECOM_ATTRIBUTION]: 0, // TODO: overseas price
              [EAdvancedModules.NOTION_SYNC]: 0, // TODO: overseas price
              [EAdvancedModules.FEISHU_DRIVE]: 0, // TODO: overseas price
              [EAdvancedModules.FEISHU_BITABLE]: 0, // TODO: overseas price
              [EAdvancedModules.FEISHU_APPROVAL]: 0, // TODO: overseas price
              [EAdvancedModules.SSO_SAML]: 0, // TODO: overseas price
              [EAdvancedModules.SSO_FEISHU]: 5000,
              [EAdvancedModules.SSO_WECOM]: 5000,
              [EAdvancedModules.SSO_DINGTALK]: 5000,
              [EAdvancedModules.SSO_Teams]: 5000,
              [EAdvancedModules.SSO_GOOGLE]: 0, // TODO: overseas price
              [EAdvancedModules.CUSTOMER_SERVICE]: 0,
              [EAdvancedModules.PROFESSIONAL_SERVICES]: 15000,
              [EAdvancedModules.GA]: 0,
              [EAdvancedModules.CDN_TRAFFIC]: 0,
              [EAdvancedModules.CDN_GLOBAL]: 0,
            } as Record<string, number>,
          }
        : {
            baseCost: 0,
            damPrice: damPriceByRole,
            geaContextPrice: 200000,
            geaAiPackPrice: 2000, // 1万点/份
            memberSeatPrice: 1000,
            storageSpacePrice: 5000,
            seatTierPrices: {
              lte200: 100000,
              lte500: 150000,
              lte1000: 200000,
              unlimited: 300000,
            },
            coldHotStorageFee: 100000,
            chinaHotStoragePrice: 5000,
            chinaColdStoragePrice: 500,
            overseasHotStoragePrice: 10000,
            overseasColdStoragePrice: 2000,
            aiPointsPrice: 20000,
            modules: {
              [EAdvancedModules.ADVANCED_FEATURES]: 20000,
              [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: 10000,
              [EAdvancedModules.SMART_FOLDERS]: 20000,
              [EAdvancedModules.CUSTOM_METADATA_FIELDS]: 30000,
              [EAdvancedModules.BRAND_LIBRARY]: 30000,
              [EAdvancedModules.PRODUCT_LIBRARY]: 30000,
              [EAdvancedModules.PROJECT_HUB]: 30000,
              [EAdvancedModules.ASSET_ANALYTICS]: 30000,
              [EAdvancedModules.STANDARD_PROJECT_HUB]: 30000,
              [EAdvancedModules.ADVANCED_PROJECT_HUB]: 100000,
              [EAdvancedModules.AI_AUTO_TAG_MODULE]: 30000,
              [EAdvancedModules.AI_AUTO_TAG_POINTS]: 5000,
              [EAdvancedModules.FEATURE_LIBRARY]: 10000,
              [EAdvancedModules.AI_FEATURE_RECOGNITION]: 30000,
              [EAdvancedModules.AI_FEATURE_POINTS]: 5000,
              [EAdvancedModules.MUSE_AI]: 100000,
              [EAdvancedModules.MUSE_AI_BASIC]: 50000,
              [EAdvancedModules.MUSE_AI_STANDARD]: 100000,
              [EAdvancedModules.MUSE_AI_ADVANCED]: 200000,
              [EAdvancedModules.BATCH_TEMPLATING]: 28000,
              [EAdvancedModules.PROFESSIONAL_PRINT]: 55000,
              [EAdvancedModules.HTML_EXPORT]: 55000,
              [EAdvancedModules.MUSE_CUT]: 100000,
              [EAdvancedModules.CLIPO_REMIX]: 198000,
              [EAdvancedModules.CLIPO_REMIX_BEE]: 98000,
              [EAdvancedModules.CLIPO_REMIX_PANDA]: 198000,
              [EAdvancedModules.CLIPO_REMIX_LION]: 398000,
              [EAdvancedModules.CREATIVE_AI_POINTS]: 5000,
              [EAdvancedModules.FILE_COLLECTION]: 20000,
              [EAdvancedModules.APPROVAL_CENTER]: 100000,
              [EAdvancedModules.DELIVERY_APPROVAL_CENTER]: 50000,
              [EAdvancedModules.TASK_WORKFLOW]: 50000,
              [EAdvancedModules.TASK_WORKFLOW_BASIC]: 50000,
              [EAdvancedModules.TASK_WORKFLOW_ADVANCED]: 100000,
              [EAdvancedModules.AUTOMATION_CENTER]: 50000,
              [EAdvancedModules.COMPLIANCE_CHECK]: 30000,
              [EAdvancedModules.REGIONAL_COMPLIANCE]: 30000,
              [EAdvancedModules.BRAND_COMPLIANCE_AGENT]: 20000,
              [EAdvancedModules.STORE_INSPECTION_AGENT]: 20000,
              [EAdvancedModules.COPYRIGHT_MANAGEMENT]: 50000,
              [EAdvancedModules.WATERMARK]: 30000,
              [EAdvancedModules.PUBLIC_ASSETS_AND_DERIVATIVES]: 30000,
              [EAdvancedModules.DAT]: 20000,
              [EAdvancedModules.PORTAL]: 100000,
              [EAdvancedModules.PORTAL_THEME]: 52500,
              [EAdvancedModules.SOCIAL_ARTICLE]: 100000,
              [EAdvancedModules.SOCIAL_ATTRIBUTION]: 30000,
              [EAdvancedModules.SOCIAL_CHANNELS]: 30000,
              [EAdvancedModules.SOCIAL_ACCOUNT_PACK]: 10000,
              [EAdvancedModules.ECOM_CHANNELS]: 30000,
              [EAdvancedModules.ECOM_ACCOUNT_PACK]: 10000,
              [EAdvancedModules.ECOM_ATTRIBUTION]: 30000,
              [EAdvancedModules.NOTION_SYNC]: 20000,
              [EAdvancedModules.FEISHU_DRIVE]: 30000,
              [EAdvancedModules.FEISHU_BITABLE]: 50000,
              [EAdvancedModules.FEISHU_APPROVAL]: 30000,
              [EAdvancedModules.SSO_SAML]: 5000,
              [EAdvancedModules.SSO_FEISHU]: 5000,
              [EAdvancedModules.SSO_WECOM]: 5000,
              [EAdvancedModules.SSO_DINGTALK]: 5000,
              [EAdvancedModules.SSO_Teams]: 5000,
              [EAdvancedModules.SSO_GOOGLE]: 5000,
              [EAdvancedModules.CUSTOMER_SERVICE]: 0,
              [EAdvancedModules.PROFESSIONAL_SERVICES]: 50000,
              [EAdvancedModules.GA]: 90000,
              [EAdvancedModules.CDN_TRAFFIC]: 6000,
              [EAdvancedModules.CDN_GLOBAL]: 30000,
            } as Record<string, number>,
          },
      private: isGlobal
        ? {
            /** 源码永久买断固定价 */
            perpetualBuyout: 6000000,
            /** 源码部署倍数 */
            sourceMultiplier: 3,
            /** 基础维护 = 软件授权费 × 比例 */
            basicMaintenanceRate: 0.15,
            iterationPrices: {
              1: 150000,
              4: 240000,
            } as Record<PrivateIterationFrequency, number>,
            modules: {
              [EPrivateModules.PRIVATE_IMPLEMENTATION]: 18000,
              [EPrivateModules.OPERATION_MAINTENANCE]: 5000,
            } as Record<string, number>,
            implProducts: {
              [EPrivateImplProducts.DAM]: 100000,
              [EPrivateImplProducts.GEA_CONTEXT]: 80000,
              [EPrivateImplProducts.MUSE_AI]: 50000,
              [EPrivateImplProducts.INGEN_OPS]: 50000,
              [EPrivateImplProducts.CLIPO_REMIX]: 50000,
            } as Record<EPrivateImplProducts, number>,
          }
        : {
            perpetualBuyout: 6000000,
            sourceMultiplier: 3,
            basicMaintenanceRate: 0.15,
            iterationPrices: {
              1: 150000,
              4: 240000,
            } as Record<PrivateIterationFrequency, number>,
            modules: {
              [EPrivateModules.PRIVATE_IMPLEMENTATION]: 18000,
              [EPrivateModules.OPERATION_MAINTENANCE]: 5000,
            } as Record<string, number>,
            implProducts: {
              [EPrivateImplProducts.DAM]: 100000,
              [EPrivateImplProducts.GEA_CONTEXT]: 80000,
              [EPrivateImplProducts.MUSE_AI]: 50000,
              [EPrivateImplProducts.INGEN_OPS]: 50000,
              [EPrivateImplProducts.CLIPO_REMIX]: 50000,
            } as Record<EPrivateImplProducts, number>,
          },
    }),
    [isGlobal, damPriceByRole],
  )

  const moduleNames: Record<string, string> = {
    [EAdvancedModules.ADVANCED_FEATURES]: t('module.advancedFeatures'),
    [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: t('module.customSystemHomepage'),
    [EAdvancedModules.SMART_FOLDERS]: t('module.smartFolders'),
    [EAdvancedModules.CUSTOM_METADATA_FIELDS]: t('module.customMetadataFields'),
    [EAdvancedModules.BRAND_LIBRARY]: t('module.brandLibrary'),
    [EAdvancedModules.PRODUCT_LIBRARY]: t('module.productLibrary'),
    [EAdvancedModules.PROJECT_HUB]: t('module.projectHub'),
    [EAdvancedModules.ASSET_ANALYTICS]: t('module.assetAnalytics'),
    [EAdvancedModules.STANDARD_PROJECT_HUB]: t('module.standardProjectHub'),
    [EAdvancedModules.ADVANCED_PROJECT_HUB]: t('module.advancedProjectHub'),
    [EAdvancedModules.AI_AUTO_TAG]: t('module.aiAutoTag'),
    [EAdvancedModules.AI_AUTO_TAG_MODULE]: t('module.aiAutoTagModule'),
    [EAdvancedModules.AI_AUTO_TAG_POINTS]: t('module.aiAutoTagPoints'),
    [EAdvancedModules.FEATURE_LIBRARY]: t('module.featureLibrary'),
    [EAdvancedModules.AI_FEATURE_RECOGNITION]: t('module.aiFeatureRecognition'),
    [EAdvancedModules.AI_FEATURE_POINTS]: t('module.aiFeaturePoints'),
    [EAdvancedModules.MUSE_AI]: t('module.museAI'),
    [EAdvancedModules.MUSE_AI_BASIC]: t('variant.basic'),
    [EAdvancedModules.MUSE_AI_STANDARD]: t('variant.standard'),
    [EAdvancedModules.MUSE_AI_ADVANCED]: t('variant.advanced'),
    [EAdvancedModules.BATCH_TEMPLATING]: t('module.batchTemplating'),
    [EAdvancedModules.PROFESSIONAL_PRINT]: t('module.professionalPrint'),
    [EAdvancedModules.HTML_EXPORT]: t('module.htmlExport'),
    [EAdvancedModules.MUSE_CUT]: 'MuseCut',
    [EAdvancedModules.CLIPO_REMIX]: t('module.clipoRemix'),
    [EAdvancedModules.CLIPO_REMIX_BEE]: t('variant.clipoBee'),
    [EAdvancedModules.CLIPO_REMIX_PANDA]: t('variant.clipoPanda'),
    [EAdvancedModules.CLIPO_REMIX_LION]: t('variant.clipoLion'),
    [EAdvancedModules.SMART_FILM]: t('module.smartFilm'),
    [EAdvancedModules.CREATIVE_AI_POINTS]: t('module.creativeAiPoints'),
    [EAdvancedModules.FILE_COLLECTION]: t('module.fileCollection'),
    [EAdvancedModules.APPROVAL_CENTER]: t('module.approvalCenter'),
    [EAdvancedModules.DELIVERY_APPROVAL_CENTER]: t('module.deliveryApprovalCenter'),
    [EAdvancedModules.TASK_WORKFLOW]: t('module.taskWorkflow'),
    [EAdvancedModules.AUTOMATION_CENTER]: t('module.automationCenter'),
    [EAdvancedModules.COMPLIANCE_CHECK]: t('module.complianceCheck'),
    [EAdvancedModules.REGIONAL_COMPLIANCE]: t('module.regionalCompliance'),
    [EAdvancedModules.BRAND_COMPLIANCE_AGENT]: t('module.brandComplianceAgent'),
    [EAdvancedModules.STORE_INSPECTION_AGENT]: t('module.storeInspectionAgent'),
    [EAdvancedModules.COPYRIGHT_MANAGEMENT]: t('module.copyrightManagement'),
    [EAdvancedModules.WATERMARK]: t('module.watermark'),
    [EAdvancedModules.PUBLIC_ASSETS_AND_DERIVATIVES]: t('module.publicAssetsAndDerivatives'),
    [EAdvancedModules.DAT]: t('module.dat'),
    [EAdvancedModules.PORTAL]: t('module.portal'),
    [EAdvancedModules.PORTAL_THEME]: t('module.portalTheme'),
    [EAdvancedModules.SOCIAL_DISTRIBUTION]: t('module.socialDistribution'),
    [EAdvancedModules.SOCIAL_ARTICLE]: t('module.socialArticle'),
    [EAdvancedModules.SOCIAL_ATTRIBUTION]: t('module.socialAttribution'),
    [EAdvancedModules.SOCIAL_CHANNELS]: t('module.socialChannels'),
    [EAdvancedModules.SOCIAL_ACCOUNT_PACK]: t('module.socialAccountPack'),
    [EAdvancedModules.ECOM_CHANNELS]: t('module.ecomChannels'),
    [EAdvancedModules.ECOM_ACCOUNT_PACK]: t('module.ecomAccountPack'),
    [EAdvancedModules.ECOM_ATTRIBUTION]: t('module.ecomAttribution'),
    [EAdvancedModules.NOTION_SYNC]: t('module.notionSync'),
    [EAdvancedModules.FEISHU_DRIVE]: t('module.feishuDrive'),
    [EAdvancedModules.FEISHU_BITABLE]: t('module.feishuBitable'),
    [EAdvancedModules.FEISHU_APPROVAL]: t('module.feishuApproval'),
    [EAdvancedModules.ENTERPRISE_SSO]: t('module.enterpriseSSO'),
    [EAdvancedModules.CUSTOMER_SERVICE]: t('module.customerService'),
    [EAdvancedModules.PROFESSIONAL_SERVICES]: t('module.professionalServices'),
    [EPrivateModules.PRIVATE_IMPLEMENTATION]: t('private.implementation'),
    [EPrivateModules.OPERATION_MAINTENANCE]: t('operation.maintenance'),
    [EAdvancedModules.GA]: t('module.ga'),
    [EAdvancedModules.CDN_TRAFFIC]: t('module.cdnTraffic'),
    [EGeaBaseModules.DAM]: t('gea.dam'),
    [EGeaBaseModules.GEA_CONTEXT]: t('gea.context'),
    [EGeaBaseModules.AI_POINTS_PACK]: t('gea.aiPointsPack'),
  }

  const ssoTypeNames: Record<string, string> = {
    [EAdvancedModules.SSO_SAML]: 'SAML',
    [EAdvancedModules.SSO_FEISHU]: t('sso.feishu'),
    [EAdvancedModules.SSO_WECOM]: t('sso.wecom'),
    [EAdvancedModules.SSO_DINGTALK]: t('sso.dingtalk'),
    [EAdvancedModules.SSO_Teams]: 'Microsoft Teams',
    [EAdvancedModules.SSO_GOOGLE]: t('sso.google'),
  }

  const allSSOType = isInChina
    ? [
        EAdvancedModules.SSO_SAML,
        EAdvancedModules.SSO_FEISHU,
        EAdvancedModules.SSO_WECOM,
        EAdvancedModules.SSO_DINGTALK,
        EAdvancedModules.SSO_Teams,
        EAdvancedModules.SSO_GOOGLE,
      ]
    : [EAdvancedModules.SSO_SAML, EAdvancedModules.SSO_Teams, EAdvancedModules.SSO_GOOGLE]

  return { pricing, moduleNames, prefix, ssoTypeNames, allSSOType, isGlobal }
}

export const useBasicConfigs = () => {
  const { t } = useTranslation('quotation')
  const { activeTab } = useQuotationStore()
  const { isInChina } = useCountry()
  const { pricing, prefix } = usePricing()
  const basicPricing = pricing.basic
  const advancedPricing = pricing.advanced

  return activeTab === TabEnum.BASIC
    ? [
        {
          key: 'memberSeats' as const,
          title: t('member.seat'),
          min: 1,
          hint: [t('basic.memberSeats.hint')],
          des:
            `${prefix} ${basicPricing.memberSeatPrice}${t('memberSeats.perYear')}` +
            ` (${prefix} ${Math.ceil(basicPricing.memberSeatPrice / 12)}${t('memberSeats.perMonth')})`,
        },
        {
          key: 'storageSpace' as const,
          title: t('storage.space'),
          min: 1,
          hint: [t('basic.storageSpace.hint')],
          des:
            `${prefix} ${basicPricing.storageSpacePrice}/GB${t('per.year')}` +
            ` (${prefix} ${Math.ceil(basicPricing.storageSpacePrice / 12)}/GB${t('per.year')})`,
        },
        {
          key: 'aiPoints' as const,
          title: t('ai.points'),
          min: 0,
          hint: [t('aiPoints.hint')],
          des:
            `${prefix} ${formatWithToLocaleString(basicPricing.aiPointsPrice)}${t('per.year')}` +
            ` ( ${prefix} ${parseFloat((basicPricing.aiPointsPrice / 100000).toFixed(3))}${t('aiPoints.unit')})`,
        },
      ]
    : [
        {
          key: EBasicConfigKey.MEMBER_SEATS,
          title: t('member.seat'),
          hint: [t('advanced.memberSeats.hint')],
          min: isInChina ? 10 : 10,
          price: advancedPricing.memberSeatPrice,
          des:
            `${prefix} ${advancedPricing.memberSeatPrice}${t('memberSeats.perYear')}` +
            ` (${prefix} ${Math.ceil(advancedPricing.memberSeatPrice / 12)}${t('memberSeats.perMonth')})`,
        },
        {
          key: EBasicConfigKey.STORAGE_SPACE,
          min: 1,
          title: t('storage.space'),
          hint: [t('advanced.storageSpace.hint')],
          tag: '1TB',
          des: `${prefix} ${formatWithToLocaleString(advancedPricing.storageSpacePrice)}/TB${t('per.year')}`,
        },
        {
          key: EBasicConfigKey.AI_POINTS,
          title: t('ai.points'),
          min: 0,
          hint: [t('aiPoints.hint')],
          des:
            `${prefix} ${formatWithToLocaleString(advancedPricing.aiPointsPrice)}${t('per.year')}` +
            ` ( ${prefix} ${parseFloat((advancedPricing.aiPointsPrice / 100000).toFixed(3))}${t('aiPoints.unit')} )`,
          price: advancedPricing.aiPointsPrice,
        },
      ]
}

export interface ICustomServiceRoleOption {
  value: CustomServiceRole
  label: string
  price: number
}

export const useCustomServiceRoleOptions = (): ICustomServiceRoleOption[] => {
  const { t } = useTranslation('quotation')
  const { isGlobal } = usePricing()

  // 国内刊例：SVC-MANDAY-L1~L5
  return [
    {
      value: 'developer',
      label: t('custom.role.developer'),
      price: isGlobal ? 700 : 3500,
    },
    {
      value: 'fde',
      label: t('custom.role.fde'),
      price: isGlobal ? 1600 : 8000,
    },
    {
      value: 'aiEngineer',
      label: t('custom.role.aiEngineer'),
      price: isGlobal ? 2000 : 10000,
    },
    {
      value: 'aiConsultant',
      label: t('custom.role.aiConsultant'),
      price: isGlobal ? 6000 : 30000,
    },
    {
      value: 'founder',
      label: t('custom.role.founder'),
      price: isGlobal ? 10000 : 50000,
    },
    {
      value: 'custom',
      label: t('custom.role.custom'),
      price: 0,
    },
  ]
}

export const useAdvancedModuleGroups = (): IModuleGroup[] => {
  const { t } = useTranslation('quotation')
  const { pricing, moduleNames, prefix } = usePricing()
  const advancedPricing = pricing.advanced
  const { isInChina } = useCountry()
  const m = advancedPricing.modules

  const giftPaid: BillingMode[] = ['paid', 'discount', 'gift']

  const groups: IModuleGroup[] = [
    {
      id: EModuleGroupId.ASSET_ORG,
      title: t('group.assetOrg'),
      baseProduct: 'dam',
      modules: [
        {
          key: EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE,
          label: moduleNames[EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE],
          price: m[EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE],
          giftEligible: true,
          giftBadge: t('badge.optionalGift'),
          giftThreshold: 200000,
        },
        {
          key: EAdvancedModules.SMART_FOLDERS,
          label: moduleNames[EAdvancedModules.SMART_FOLDERS],
          price: m[EAdvancedModules.SMART_FOLDERS],
          giftEligible: true,
          giftBadge: t('badge.optionalGift'),
          giftThreshold: 200000,
        },
        {
          key: EAdvancedModules.CUSTOM_METADATA_FIELDS,
          label: moduleNames[EAdvancedModules.CUSTOM_METADATA_FIELDS],
          price: m[EAdvancedModules.CUSTOM_METADATA_FIELDS],
          giftEligible: true,
          giftBadge: t('badge.optionalGift'),
          giftThreshold: 200000,
        },
        {
          key: EAdvancedModules.ASSET_ANALYTICS,
          label: moduleNames[EAdvancedModules.ASSET_ANALYTICS],
          price: m[EAdvancedModules.ASSET_ANALYTICS],
          launchTag: t('launch.oct'),
        },
        {
          key: EAdvancedModules.BRAND_LIBRARY,
          label: moduleNames[EAdvancedModules.BRAND_LIBRARY],
          price: m[EAdvancedModules.BRAND_LIBRARY],
          launchTag: t('launch.oct'),
        },
        {
          key: EAdvancedModules.PRODUCT_LIBRARY,
          label: moduleNames[EAdvancedModules.PRODUCT_LIBRARY],
          price: m[EAdvancedModules.PRODUCT_LIBRARY],
        },
        {
          key: EAdvancedModules.PROJECT_HUB,
          label: moduleNames[EAdvancedModules.PROJECT_HUB],
          price: m[EAdvancedModules.PROJECT_HUB],
        },
      ],
    },
    {
      id: EModuleGroupId.AI,
      title: t('group.ai'),
      baseProduct: 'dam',
      modules: [
        {
          key: EAdvancedModules.AI_AUTO_TAG,
          label: moduleNames[EAdvancedModules.AI_AUTO_TAG],
          price: m[EAdvancedModules.AI_AUTO_TAG_MODULE],
          hint: t('ai.autoTag.hint'),
          subFlex: 'column',
          alwaysShowSubs: true,
          subModules: [
            {
              key: EAdvancedModules.FEATURE_LIBRARY,
              label: moduleNames[EAdvancedModules.FEATURE_LIBRARY],
              price: m[EAdvancedModules.FEATURE_LIBRARY],
              unit: t('unit.perItem'),
              hint: t('featureLibrary.requires'),
              requires: EAdvancedModules.AI_AUTO_TAG,
              noCheckBox: true,
              multiCols: 2,
              multiOptions: [
                { label: t('feature.brand'), value: 'brand' },
                { label: t('feature.product'), value: 'product' },
                { label: t('feature.person'), value: 'person' },
                { label: t('feature.ip'), value: 'ip' },
              ],
            },
            {
              key: EAdvancedModules.AI_AUTO_TAG_POINTS,
              label: moduleNames[EAdvancedModules.AI_AUTO_TAG_POINTS],
              price: m[EAdvancedModules.AI_AUTO_TAG_POINTS],
              tag: t('ai.pointsPack.tag'),
              hint: t('ai.pointsPack.periodHint'),
              priceText: t('ai.pointsPack.valueHint', {
                prefix,
                price: formatWithToLocaleString(m[EAdvancedModules.AI_AUTO_TAG_POINTS]),
              }),
              giftEligible: true,
              giftBadge: t('badge.optionalGift'),
              giftThreshold: 0,
              requires: EAdvancedModules.AI_AUTO_TAG,
            },
          ],
        },
        {
          key: EAdvancedModules.AI_FEATURE_RECOGNITION,
          label: moduleNames[EAdvancedModules.AI_FEATURE_RECOGNITION],
          price: m[EAdvancedModules.AI_FEATURE_RECOGNITION],
          launchTag: t('launch.oct'),
          hint: t('ai.featureRecognition.hint'),
          subFlex: 'column',
          alwaysShowSubs: true,
          subModules: [
            {
              key: EAdvancedModules.AI_FEATURE_POINTS,
              label: moduleNames[EAdvancedModules.AI_FEATURE_POINTS],
              price: m[EAdvancedModules.AI_FEATURE_POINTS],
              tag: t('ai.pointsPack.tag'),
              hint: t('ai.pointsPack.periodHint'),
              priceText: t('ai.pointsPack.valueHint', {
                prefix,
                price: formatWithToLocaleString(m[EAdvancedModules.AI_FEATURE_POINTS]),
              }),
              giftEligible: true,
              giftBadge: t('badge.optionalGift'),
              giftThreshold: 0,
              requires: EAdvancedModules.AI_FEATURE_RECOGNITION,
            },
          ],
        },
      ],
    },
    {
      id: EModuleGroupId.CREATIVE,
      title: t('group.creative'),
      baseProduct: 'dam',
      modules: [
        {
          key: EAdvancedModules.MUSE_AI,
          label: moduleNames[EAdvancedModules.MUSE_AI],
          price: 0,
          noPrice: true,
          noCheckBox: true,
          hint: t('creative.module.hint'),
          subModules: [
            {
              key: EAdvancedModules.MUSE_AI_BASIC,
              label: moduleNames[EAdvancedModules.MUSE_AI_BASIC],
              price: m[EAdvancedModules.MUSE_AI_BASIC],
            },
            {
              key: EAdvancedModules.MUSE_AI_STANDARD,
              label: moduleNames[EAdvancedModules.MUSE_AI_STANDARD],
              price: m[EAdvancedModules.MUSE_AI_STANDARD],
            },
            {
              key: EAdvancedModules.MUSE_AI_ADVANCED,
              label: moduleNames[EAdvancedModules.MUSE_AI_ADVANCED],
              price: m[EAdvancedModules.MUSE_AI_ADVANCED],
              launchTag: t('launch.dec'),
            },
          ],
        },
        {
          key: EAdvancedModules.BATCH_TEMPLATING,
          label: t('module.ingenOps'),
          price: 0,
          noPrice: true,
          noCheckBox: true,
          hint: t('creative.module.hint'),
          subFlex: 'row',
          subModules: [
            {
              key: EAdvancedModules.BATCH_TEMPLATING,
              label: t('module.batchTemplating'),
              price: m[EAdvancedModules.BATCH_TEMPLATING],
            },
            {
              key: EAdvancedModules.PROFESSIONAL_PRINT,
              label: moduleNames[EAdvancedModules.PROFESSIONAL_PRINT],
              price: m[EAdvancedModules.PROFESSIONAL_PRINT],
              launchTag: t('launch.aug'),
            },
            {
              key: EAdvancedModules.HTML_EXPORT,
              label: moduleNames[EAdvancedModules.HTML_EXPORT],
              price: m[EAdvancedModules.HTML_EXPORT],
              launchTag: t('launch.aug'),
            },
          ],
        },
        {
          key: EAdvancedModules.SMART_FILM,
          label: moduleNames[EAdvancedModules.SMART_FILM],
          price: 0,
          noPrice: true,
          noCheckBox: true,
          hint: t('creative.module.hint'),
          subModules: [
            {
              key: EAdvancedModules.CLIPO_REMIX_BEE,
              label: moduleNames[EAdvancedModules.CLIPO_REMIX_BEE],
              price: m[EAdvancedModules.CLIPO_REMIX_BEE],
              launchTag: t('launch.sep'),
            },
            {
              key: EAdvancedModules.CLIPO_REMIX_PANDA,
              label: moduleNames[EAdvancedModules.CLIPO_REMIX_PANDA],
              price: m[EAdvancedModules.CLIPO_REMIX_PANDA],
              launchTag: t('launch.sep'),
            },
            {
              key: EAdvancedModules.CLIPO_REMIX_LION,
              label: moduleNames[EAdvancedModules.CLIPO_REMIX_LION],
              price: m[EAdvancedModules.CLIPO_REMIX_LION],
              launchTag: t('launch.sep'),
            },
          ],
        },
        {
          key: EAdvancedModules.CREATIVE_AI_POINTS,
          label: moduleNames[EAdvancedModules.CREATIVE_AI_POINTS],
          price: m[EAdvancedModules.CREATIVE_AI_POINTS],
          tag: t('ai.pointsPack.tag'),
          hint: t('ai.creativePoints.periodHint'),
          priceText: t('ai.pointsPack.valueHint', {
            prefix,
            price: formatWithToLocaleString(m[EAdvancedModules.CREATIVE_AI_POINTS]),
          }),
          giftEligible: true,
          giftBadge: t('badge.optionalGift'),
          giftThreshold: 0,
        },
      ],
    },
    {
      id: EModuleGroupId.COLLAB,
      title: t('group.collab'),
      baseProduct: 'dam',
      modules: [
        {
          key: EAdvancedModules.FILE_COLLECTION,
          label: moduleNames[EAdvancedModules.FILE_COLLECTION],
          price: m[EAdvancedModules.FILE_COLLECTION],
          launchTag: t('launch.sep'),
          giftEligible: true,
          giftBadge: t('badge.optionalGift'),
          giftThreshold: 200000,
        },
        {
          key: EAdvancedModules.APPROVAL_CENTER,
          label: moduleNames[EAdvancedModules.APPROVAL_CENTER],
          price: m[EAdvancedModules.APPROVAL_CENTER],
        },
        {
          key: EAdvancedModules.DELIVERY_APPROVAL_CENTER,
          label: moduleNames[EAdvancedModules.DELIVERY_APPROVAL_CENTER],
          price: m[EAdvancedModules.DELIVERY_APPROVAL_CENTER],
        },
        {
          key: EAdvancedModules.TASK_WORKFLOW,
          label: moduleNames[EAdvancedModules.TASK_WORKFLOW],
          price: m[EAdvancedModules.TASK_WORKFLOW_BASIC],
          variantOptions: [
            {
              label: t('variant.basic'),
              value: 'basic',
              price: m[EAdvancedModules.TASK_WORKFLOW_BASIC],
            },
            {
              label: t('variant.advanced'),
              value: 'advanced',
              price: m[EAdvancedModules.TASK_WORKFLOW_ADVANCED],
              launchTag: t('launch.tbd'),
            },
          ],
        },
        {
          key: EAdvancedModules.AUTOMATION_CENTER,
          label: moduleNames[EAdvancedModules.AUTOMATION_CENTER],
          price: m[EAdvancedModules.AUTOMATION_CENTER],
          launchTag: t('launch.aug'),
        },
      ],
    },
    {
      id: EModuleGroupId.COMPLIANCE,
      title: t('group.compliance'),
      baseProduct: 'dam',
      modules: [
        {
          key: EAdvancedModules.COMPLIANCE_CHECK,
          label: moduleNames[EAdvancedModules.COMPLIANCE_CHECK],
          price: m[EAdvancedModules.COMPLIANCE_CHECK],
          hint: t('compliance.hint'),
          subFlex: 'column',
          alwaysShowSubs: true,
          subModules: [
            {
              key: EAdvancedModules.REGIONAL_COMPLIANCE,
              label: moduleNames[EAdvancedModules.REGIONAL_COMPLIANCE],
              price: m[EAdvancedModules.REGIONAL_COMPLIANCE],
              unit: t('unit.perRegionYear'),
              hint: t('regionalCompliance.requires'),
              requires: EAdvancedModules.COMPLIANCE_CHECK,
              noCheckBox: true,
              multiCols: 2,
              multiOptions: [
                { label: t('compliance.eu'), value: 'eu' },
                { label: t('compliance.us'), value: 'us' },
              ],
            },
          ],
        },
        {
          key: EAdvancedModules.BRAND_COMPLIANCE_AGENT,
          label: moduleNames[EAdvancedModules.BRAND_COMPLIANCE_AGENT],
          price: m[EAdvancedModules.BRAND_COMPLIANCE_AGENT],
          launchTag: t('launch.sep'),
          hint: t('brandCompliance.hint'),
        },
        {
          key: EAdvancedModules.STORE_INSPECTION_AGENT,
          label: moduleNames[EAdvancedModules.STORE_INSPECTION_AGENT],
          price: m[EAdvancedModules.STORE_INSPECTION_AGENT],
          launchTag: t('launch.sep'),
        },
        {
          key: EAdvancedModules.COPYRIGHT_MANAGEMENT,
          label: moduleNames[EAdvancedModules.COPYRIGHT_MANAGEMENT],
          price: m[EAdvancedModules.COPYRIGHT_MANAGEMENT],
        },
        {
          key: EAdvancedModules.WATERMARK,
          label: moduleNames[EAdvancedModules.WATERMARK],
          price: m[EAdvancedModules.WATERMARK],
        },
      ],
    },
    {
      id: EModuleGroupId.DISTRIBUTION,
      title: t('group.distribution'),
      baseProduct: 'dam',
      modules: [
        {
          key: EAdvancedModules.PUBLIC_ASSETS_AND_DERIVATIVES,
          label: moduleNames[EAdvancedModules.PUBLIC_ASSETS_AND_DERIVATIVES],
          price: m[EAdvancedModules.PUBLIC_ASSETS_AND_DERIVATIVES],
          hint: t('publicAssetsAndDerivatives.hint'),
        },
        {
          key: EAdvancedModules.DAT,
          label: moduleNames[EAdvancedModules.DAT],
          price: m[EAdvancedModules.DAT],
          hint: t('dat.requires'),
          requires: EAdvancedModules.PUBLIC_ASSETS_AND_DERIVATIVES,
        },
        {
          key: EAdvancedModules.PORTAL,
          label: moduleNames[EAdvancedModules.PORTAL],
          price: m[EAdvancedModules.PORTAL],
        },
        {
          key: EAdvancedModules.PORTAL_THEME,
          label: moduleNames[EAdvancedModules.PORTAL_THEME],
          price: m[EAdvancedModules.PORTAL_THEME],
          oneTime: true,
          unit: t('unit.oneTimePerItem'),
          hint: t('portalTheme.hint'),
          requires: EAdvancedModules.PORTAL,
          min: 1,
        },
        {
          key: EAdvancedModules.SOCIAL_DISTRIBUTION,
          label: moduleNames[EAdvancedModules.SOCIAL_DISTRIBUTION],
          price: 0,
          noPrice: true,
          noCheckBox: true,
          subModules: [
            {
              key: EAdvancedModules.SOCIAL_ARTICLE,
              label: moduleNames[EAdvancedModules.SOCIAL_ARTICLE],
              price: m[EAdvancedModules.SOCIAL_ARTICLE],
              launchTag: t('launch.sep'),
            },
            {
              key: EAdvancedModules.SOCIAL_CHANNELS,
              label: moduleNames[EAdvancedModules.SOCIAL_CHANNELS],
              price: m[EAdvancedModules.SOCIAL_CHANNELS],
              unit: t('unit.perChannelYear'),
              hint: t('socialChannels.hint'),
              noCheckBox: true,
              multiCols: 2,
              multiOptions: [
                { label: t('channel.xiaohongshu'), value: 'xiaohongshu' },
                { label: t('channel.douyin'), value: 'douyin' },
                { label: t('channel.wechat'), value: 'wechat', launchTag: t('launch.tbd') },
                { label: t('channel.channels'), value: 'channels', launchTag: t('launch.tbd') },
                { label: t('channel.weibo'), value: 'weibo', launchTag: t('launch.tbd'), fullRow: true },
                { label: 'YouTube', value: 'youtube' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'Facebook Page', value: 'facebook' },
                { label: 'Instagram Business', value: 'instagram' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'LinkedIn Company Page', value: 'linkedinCompany' },
                { label: 'X/Twitter', value: 'twitter' },
              ],
            },
            {
              key: EAdvancedModules.SOCIAL_ACCOUNT_PACK,
              label: moduleNames[EAdvancedModules.SOCIAL_ACCOUNT_PACK],
              price: m[EAdvancedModules.SOCIAL_ACCOUNT_PACK],
              hint: t('socialAccountPack.hint'),
              unit: t('unit.perYearAccounts50'),
              min: 0,
              noCheckBox: true,
              boxed: true,
            },
            {
              key: EAdvancedModules.SOCIAL_ATTRIBUTION,
              label: moduleNames[EAdvancedModules.SOCIAL_ATTRIBUTION],
              price: m[EAdvancedModules.SOCIAL_ATTRIBUTION],
              launchTag: t('launch.sep'),
            },
          ],
        },
        {
          key: EAdvancedModules.ECOM_CHANNELS,
          label: moduleNames[EAdvancedModules.ECOM_CHANNELS],
          price: m[EAdvancedModules.ECOM_CHANNELS],
          launchTag: t('launch.oct'),
          unit: t('unit.perChannelYear'),
          hint: t('ecomChannels.hint'),
          noCheckBox: true,
          multiCols: 2,
          multiOptions: [
            { label: 'Amazon', value: 'amazon' },
            { label: 'Lazada', value: 'lazada' },
            { label: 'Shopee', value: 'shopee' },
            { label: 'TikTok Shop', value: 'tiktokShop' },
            { label: 'Shopify', value: 'shopify' },
          ],
        },
        {
          key: EAdvancedModules.ECOM_ACCOUNT_PACK,
          label: moduleNames[EAdvancedModules.ECOM_ACCOUNT_PACK],
          price: m[EAdvancedModules.ECOM_ACCOUNT_PACK],
          hint: t('ecomAccountPack.hint'),
          min: 0,
        },
        {
          key: EAdvancedModules.ECOM_ATTRIBUTION,
          label: moduleNames[EAdvancedModules.ECOM_ATTRIBUTION],
          price: m[EAdvancedModules.ECOM_ATTRIBUTION],
          launchTag: t('launch.dec'),
          hint: t('ecomAttribution.requires'),
          requires: EAdvancedModules.ECOM_CHANNELS,
        },
      ],
    },
    {
      id: EModuleGroupId.INTEGRATION,
      title: t('group.integration'),
      baseProduct: 'dam',
      modules: [
        {
          key: EAdvancedModules.NOTION_SYNC,
          label: moduleNames[EAdvancedModules.NOTION_SYNC],
          price: m[EAdvancedModules.NOTION_SYNC],
        },
        ...(isInChina
          ? [
              {
                key: EAdvancedModules.FEISHU_DRIVE,
                label: moduleNames[EAdvancedModules.FEISHU_DRIVE],
                price: m[EAdvancedModules.FEISHU_DRIVE],
                launchTag: t('launch.dec'),
                variantOptions: [
                  {
                    label: t('variant.basic'),
                    value: 'basic',
                    price: m[EAdvancedModules.FEISHU_DRIVE],
                  },
                  {
                    label: t('variant.advanced'),
                    value: 'advanced',
                    price: 100000,
                  },
                ],
              },
              {
                key: EAdvancedModules.FEISHU_BITABLE,
                label: moduleNames[EAdvancedModules.FEISHU_BITABLE],
                price: m[EAdvancedModules.FEISHU_BITABLE],
                launchTag: t('launch.dec'),
                variantOptions: [
                  {
                    label: t('variant.oneWay'),
                    value: 'oneWay',
                    price: m[EAdvancedModules.FEISHU_BITABLE],
                  },
                  {
                    label: t('variant.twoWay'),
                    value: 'twoWay',
                    price: 100000,
                  },
                ],
              },
              {
                key: EAdvancedModules.FEISHU_APPROVAL,
                label: moduleNames[EAdvancedModules.FEISHU_APPROVAL],
                price: m[EAdvancedModules.FEISHU_APPROVAL],
              },
            ]
          : []),
        {
          key: EAdvancedModules.ENTERPRISE_SSO,
          label: moduleNames[EAdvancedModules.ENTERPRISE_SSO],
          price: m[EAdvancedModules.SSO_FEISHU] ?? 0,
          unit: t('sso.unit'),
          noCheckBox: true,
          subFlex: 'row',
          subModules: [
            {
              key: EAdvancedModules.SSO_SAML,
              label: 'SAML',
              noPrice: true,
              price: m[EAdvancedModules.SSO_SAML] ?? 0,
            },
            ...(isInChina
              ? [
                  {
                    key: EAdvancedModules.SSO_FEISHU,
                    label: t('sso.feishu'),
                    noPrice: true,
                    price: m[EAdvancedModules.SSO_FEISHU] ?? 0,
                  },
                  {
                    key: EAdvancedModules.SSO_WECOM,
                    label: t('sso.wecom'),
                    noPrice: true,
                    price: m[EAdvancedModules.SSO_WECOM] ?? 0,
                  },
                  {
                    key: EAdvancedModules.SSO_DINGTALK,
                    label: t('sso.dingtalk'),
                    noPrice: true,
                    price: m[EAdvancedModules.SSO_DINGTALK] ?? 0,
                  },
                ]
              : []),
            {
              key: EAdvancedModules.SSO_Teams,
              label: 'Microsoft Teams',
              noPrice: true,
              price: m[EAdvancedModules.SSO_Teams] ?? 0,
            },
            {
              key: EAdvancedModules.SSO_GOOGLE,
              label: t('sso.google'),
              noPrice: true,
              price: m[EAdvancedModules.SSO_GOOGLE] ?? 0,
              launchTag: t('launch.dec'),
            },
          ],
        },
        ...(isInChina
          ? [
              {
                key: EAdvancedModules.CDN_TRAFFIC,
                label: t('module.cdnTraffic'),
                price: m[EAdvancedModules.CDN_TRAFFIC],
                tag: '10TB',
                hint: t('cdnTraffic.hint'),
                min: 1,
              },
              {
                key: EAdvancedModules.GA_CONTAINER,
                label: moduleNames[EAdvancedModules.GA],
                price: m[EAdvancedModules.GA] ?? 0,
                noPrice: true,
                hint: t('ga.hint'),
                subFlex: 'column' as const,
                noCheckBox: true,
                subModules: [
                  {
                    key: EAdvancedModules.CDN_GLOBAL,
                    label: t('ga.cdnOss'),
                    price: m[EAdvancedModules.CDN_GLOBAL],
                    hint: t('ga.cdnOss.hint'),
                    tag: '10TB',
                    min: 1,
                  },
                  {
                    key: EAdvancedModules.GA,
                    label: t('ga.dedicatedLine'),
                    price: m[EAdvancedModules.GA],
                    hint: t('ga.dedicatedLine.hint'),
                    tag: '10TB',
                    min: 1,
                  },
                ],
              },
            ]
          : []),
      ],
    },
    {
      id: EModuleGroupId.SERVICE_SUPPORT,
      title: t('group.serviceSupport'),
      baseProduct: 'dam',
      modules: [
        {
          key: EAdvancedModules.CUSTOMER_SERVICE,
          label: moduleNames[EAdvancedModules.CUSTOMER_SERVICE],
          price: m[EAdvancedModules.CUSTOMER_SERVICE],
        },
        {
          key: EAdvancedModules.PROFESSIONAL_SERVICES,
          label: moduleNames[EAdvancedModules.PROFESSIONAL_SERVICES],
          price: m[EAdvancedModules.PROFESSIONAL_SERVICES],
        },
      ],
    },
  ]

  // silence unused
  void giftPaid

  const resolveDesc = (key: string) => {
    const text = t(`moduleDesc.${key}`)
    return text && text !== `moduleDesc.${key}` ? text : undefined
  }

  const FEATURE_DESC_BY_VALUE: Record<string, string> = {
    brand: 'featureBrand',
    product: 'featureProduct',
    person: 'featurePerson',
    ip: 'featureIp',
  }
  const FEATURE_SKU_BY_VALUE: Record<string, string> = {
    brand: 'feature.brand',
    product: 'feature.product',
    person: 'feature.person',
    ip: 'feature.ip',
  }
  const COMPLIANCE_DESC_BY_VALUE: Record<string, string> = {
    eu: 'complianceEu',
    us: 'complianceUs',
  }
  const COMPLIANCE_SKU_BY_VALUE: Record<string, string> = {
    eu: 'compliance.eu',
    us: 'compliance.us',
  }
  const FEISHU_DRIVE_DESC: Record<string, string> = {
    basic: 'feishuDrive.basic',
    advanced: 'feishuDrive.advanced',
  }
  const FEISHU_BITABLE_DESC: Record<string, string> = {
    oneWay: 'feishuBitable.oneWay',
    twoWay: 'feishuBitable.twoWay',
  }
  const TASK_WF_DESC: Record<string, string> = {
    basic: 'taskWorkflowBasic',
    advanced: 'taskWorkflowAdvanced',
  }
  const TASK_WF_SKU: Record<string, string> = {
    basic: 'taskWorkflow.basic',
    advanced: 'taskWorkflow.advanced',
  }
  const CHANNEL_SKU_BY_VALUE: Record<string, string> = {
    xiaohongshu: 'channel.xiaohongshu',
    douyin: 'channel.douyin',
    wechat: 'channel.wechat',
    channels: 'channel.channels',
    weibo: 'channel.weibo',
    youtube: 'channel.youtube',
    tiktok: 'channel.tiktok',
    facebook: 'channel.facebook',
    instagram: 'channel.instagram',
    linkedin: 'channel.linkedin',
    linkedinCompany: 'channel.linkedinCompany',
    twitter: 'channel.twitter',
  }
  const ECOM_SKU_BY_VALUE: Record<string, string> = {
    amazon: 'ecom.amazon',
    lazada: 'ecom.lazada',
    shopee: 'ecom.shopee',
    tiktokShop: 'ecom.tiktokShop',
    shopify: 'ecom.shopify',
  }

  const attachMeta = (mod: IModules): IModules => {
    const description = mod.description ?? resolveDesc(mod.key)
    const sku = mod.sku ?? getModuleSku(mod.key)
    return {
      ...mod,
      description,
      sku,
      subModules: mod.subModules?.map(attachMeta),
      variantOptions: mod.variantOptions?.map((v) => {
        let descKey: string | undefined
        let skuKey: string | undefined
        if (mod.key === EAdvancedModules.TASK_WORKFLOW) {
          descKey = TASK_WF_DESC[v.value]
          skuKey = TASK_WF_SKU[v.value]
        }
        if (mod.key === EAdvancedModules.FEISHU_DRIVE) {
          descKey = FEISHU_DRIVE_DESC[v.value]
          skuKey = `feishuDrive.${v.value}`
        }
        if (mod.key === EAdvancedModules.FEISHU_BITABLE) {
          descKey = FEISHU_BITABLE_DESC[v.value]
          skuKey = `feishuBitable.${v.value}`
        }
        return {
          ...v,
          description: v.description ?? (descKey ? resolveDesc(descKey) : undefined),
          sku: v.sku ?? (skuKey ? getModuleSku(skuKey) : undefined),
        }
      }),
      multiOptions: mod.multiOptions?.map((opt) => {
        let descKey: string | undefined
        let skuKey: string | undefined
        if (mod.key === EAdvancedModules.FEATURE_LIBRARY) {
          descKey = FEATURE_DESC_BY_VALUE[opt.value]
          skuKey = FEATURE_SKU_BY_VALUE[opt.value]
        }
        if (mod.key === EAdvancedModules.REGIONAL_COMPLIANCE) {
          descKey = COMPLIANCE_DESC_BY_VALUE[opt.value]
          skuKey = COMPLIANCE_SKU_BY_VALUE[opt.value]
        }
        if (mod.key === EAdvancedModules.SOCIAL_CHANNELS) {
          skuKey = CHANNEL_SKU_BY_VALUE[opt.value]
        }
        if (mod.key === EAdvancedModules.ECOM_CHANNELS) {
          skuKey = ECOM_SKU_BY_VALUE[opt.value]
        }
        return {
          ...opt,
          description: opt.description ?? (descKey ? resolveDesc(descKey) : undefined),
          sku: opt.sku ?? (skuKey ? getModuleSku(skuKey) : undefined),
        }
      }),
    }
  }

  return groups.map((g) => ({
    ...g,
    modules: g.modules.map(attachMeta),
  }))
}

/** 扁平化分组模块，供计价 / 兼容旧逻辑 */
export const useAdvancedConfigs = (): IModules[] => {
  const groups = useAdvancedModuleGroups()
  return groups.flatMap((g) => g.modules)
}

/** 私有化实施产品 ↔ SaaS 状态映射 */
export const PRIVATE_IMPL_SAAS_MAP: Record<
  EPrivateImplProducts,
  {
    /** 对应 advancedConfig 布尔字段 */
    configKey?: 'geaDam' | 'geaContext'
    /** 对应 advancedModules 模块 key */
    moduleKey?: EAdvancedModules
    /** IngenOps：任一子模块选中即视为选中 */
    anyModuleKeys?: EAdvancedModules[]
  }
> = {
  [EPrivateImplProducts.DAM]: { configKey: 'geaDam' },
  [EPrivateImplProducts.GEA_CONTEXT]: { configKey: 'geaContext' },
  [EPrivateImplProducts.MUSE_AI]: {
    anyModuleKeys: [
      EAdvancedModules.MUSE_AI_BASIC,
      EAdvancedModules.MUSE_AI_STANDARD,
      EAdvancedModules.MUSE_AI_ADVANCED,
    ],
  },
  [EPrivateImplProducts.INGEN_OPS]: {
    anyModuleKeys: [
      EAdvancedModules.BATCH_TEMPLATING,
      EAdvancedModules.PROFESSIONAL_PRINT,
      EAdvancedModules.HTML_EXPORT,
    ],
  },
  [EPrivateImplProducts.CLIPO_REMIX]: {
    anyModuleKeys: [
      EAdvancedModules.CLIPO_REMIX,
      EAdvancedModules.CLIPO_REMIX_BEE,
      EAdvancedModules.CLIPO_REMIX_PANDA,
      EAdvancedModules.CLIPO_REMIX_LION,
    ],
  },
}

export const isSaasProductSelected = (
  product: EPrivateImplProducts,
  advancedConfig: { geaDam: boolean; geaContext: boolean },
  advancedModules: Record<string, boolean | number>,
): boolean => {
  const map = PRIVATE_IMPL_SAAS_MAP[product]
  if (map.configKey) return !!advancedConfig[map.configKey]
  if (map.moduleKey) return !!advancedModules[map.moduleKey]
  if (map.anyModuleKeys) return map.anyModuleKeys.some((k) => !!advancedModules[k])
  return false
}

/** 计算软件授权费（基于 SaaS 年费基数） */
export const calcPrivateLicenseFee = (
  licenseType: PrivateLicenseType,
  saasAnnualFee: number,
  pricing: {
    perpetualBuyout: number
    sourceMultiplier: number
  },
): number => {
  switch (licenseType) {
    case 'encrypted':
      return saasAnnualFee
    case 'source':
      return saasAnnualFee * pricing.sourceMultiplier
    case 'perpetual':
      return pricing.perpetualBuyout
    default:
      return 0
  }
}

/** 私有化基础维护：软件授权费 × 比例（永久买断按 SaaS 年费基数） */
export const calcPrivateBasicMaintenance = (
  annualLicenseBase: number,
  rate: number,
): number => Math.round(annualLicenseBase * rate)
