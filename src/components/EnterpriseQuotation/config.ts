import { useMemo } from 'react'
import { useCountry } from '@/providers/Country'
import { useQuotationStore } from '@/providers/QuotationStore'
import { formatWithToLocaleString } from '@/utilities/formatPrice'

import { useTranslation } from '@/app/i18n/client'

import { EAdvancedModules, EBasicConfigKey, EPrivateModules } from './enums'
import { TabEnum } from './types'

export { EAdvancedModules, EBasicConfigKey, EPrivateModules } from './enums'

// 基础模块
// (moved enums to enums.ts for reuse and to avoid circular deps)

interface IModules {
  key: EAdvancedModules
  label: string
  price: number
  min?: number
  disabled?: boolean
  subFlex?: 'row' | 'column'
  hint?: string
  tag?: string
  noPrice?: boolean
  unit?: string
  noCheckBox?: boolean
  subModules?: IModules[]
}
export const usePricing = () => {
  const { t } = useTranslation('quotation')
  const { isInChina } = useCountry()
  const isGlobal = !isInChina
  const prefix = isGlobal ? '$' : '¥'

  // 价格
  const pricing = useMemo(
    () => ({
      basic: isGlobal
        ? {
            baseCost: 0,
            memberSeatPrice: 300, // 席位年费
            storageSpacePrice: 120,
            aiPointsPrice: 1000,
          }
        : {
            baseCost: 0,
            memberSeatPrice: 1000, // 席位年费
            storageSpacePrice: 600,
            aiPointsPrice: 4800,
          },
      advanced: isGlobal
        ? {
            baseCost: 0,
            memberSeatPrice: 300,
            storageSpacePrice: 1000,
            aiPointsPrice: 1000,
            modules: {
              [EAdvancedModules.ADVANCED_FEATURES]: 5000,
              [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: 5000,
              [EAdvancedModules.STANDARD_PROJECT_HUB]: 15000,
              [EAdvancedModules.ADVANCED_PROJECT_HUB]: 30000,
              [EAdvancedModules.COMPLIANCE_CHECK]: 15000,
              [EAdvancedModules.CUSTOM_METADATA_FIELDS]: 15000,
              [EAdvancedModules.WATERMARK]: 15000,
              [EAdvancedModules.SSO_FEISHU]: 5000,
              [EAdvancedModules.SSO_WECOM]: 5000,
              [EAdvancedModules.SSO_DINGTALK]: 5000,
              [EAdvancedModules.SSO_Teams]: 5000,
              [EAdvancedModules.CUSTOMER_SERVICE]: 0,
              [EAdvancedModules.PROFESSIONAL_SERVICES]: 15000,
              // TODO : ai 自动打标引擎
              [EAdvancedModules.AI_AUTO_TAG_MODULE]: 10000,
              [EAdvancedModules.AI_AUTO_TAG_POINTS]: 20000,
              // 全球加速- 海外版没有
              [EAdvancedModules.GA]: 0,
            },
          }
        : {
            baseCost: 0,
            memberSeatPrice: 1000,
            storageSpacePrice: 5000,
            aiPointsPrice: 4800,
            modules: {
              [EAdvancedModules.ADVANCED_FEATURES]: 20000,
              [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: 10000,
              [EAdvancedModules.STANDARD_PROJECT_HUB]: 30000,
              [EAdvancedModules.ADVANCED_PROJECT_HUB]: 100000,
              [EAdvancedModules.COMPLIANCE_CHECK]: 30000,
              [EAdvancedModules.CUSTOM_METADATA_FIELDS]: 30000,
              [EAdvancedModules.WATERMARK]: 30000,
              [EAdvancedModules.SSO_FEISHU]: 5000,
              [EAdvancedModules.SSO_WECOM]: 5000,
              [EAdvancedModules.SSO_DINGTALK]: 5000,
              [EAdvancedModules.SSO_Teams]: 5000,
              [EAdvancedModules.CUSTOMER_SERVICE]: 0,
              [EAdvancedModules.PROFESSIONAL_SERVICES]: 50000,
              // ai 自动打标引擎
              [EAdvancedModules.AI_AUTO_TAG_MODULE]: 10000,
              [EAdvancedModules.AI_AUTO_TAG_POINTS]: 20000,
              // 全球加速
              [EAdvancedModules.GA]: 30000,
            },
          },
      private: isGlobal
        ? {
            saasBaseCost: 9000,
            perpetualBaseCost: 9000,
            memberSeatPrice: 300,
            modules: {
              [EAdvancedModules.ADVANCED_FEATURES]: 5000,
              [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: 5000,
              [EAdvancedModules.STANDARD_PROJECT_HUB]: 15000,
              [EAdvancedModules.ADVANCED_PROJECT_HUB]: 30000,
              [EAdvancedModules.COMPLIANCE_CHECK]: 15000,
              [EAdvancedModules.CUSTOM_METADATA_FIELDS]: 15000,
              [EAdvancedModules.WATERMARK]: 15000,
              [EAdvancedModules.ENTERPRISE_SSO]: 1000,
              [EAdvancedModules.CUSTOMER_SERVICE]: 0,
              [EAdvancedModules.PROFESSIONAL_SERVICES]: 15000,
              [EPrivateModules.PRIVATE_IMPLEMENTATION]: 18000,
              [EPrivateModules.OPERATION_MAINTENANCE]: 5000,
            },
          }
        : {
            saasBaseCost: 9000,
            perpetualBaseCost: 9000,
            memberSeatPrice: 300,
            modules: {
              [EAdvancedModules.ADVANCED_FEATURES]: 5000,
              [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: 5000,
              [EAdvancedModules.STANDARD_PROJECT_HUB]: 15000,
              [EAdvancedModules.ADVANCED_PROJECT_HUB]: 30000,
              [EAdvancedModules.COMPLIANCE_CHECK]: 15000,
              [EAdvancedModules.CUSTOM_METADATA_FIELDS]: 15000,
              [EAdvancedModules.WATERMARK]: 15000,
              [EAdvancedModules.ENTERPRISE_SSO]: 1000,
              [EAdvancedModules.CUSTOMER_SERVICE]: 0,
              [EAdvancedModules.PROFESSIONAL_SERVICES]: 15000,
              [EPrivateModules.PRIVATE_IMPLEMENTATION]: 18000,
              [EPrivateModules.OPERATION_MAINTENANCE]: 5000,
            },
          },
    }),
    [isGlobal],
  )

  const moduleNames = {
    [EAdvancedModules.ADVANCED_FEATURES]: t('module.advancedFeatures'),
    [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: t('module.customSystemHomepage'),
    [EAdvancedModules.STANDARD_PROJECT_HUB]: t('module.standardProjectHub'),
    [EAdvancedModules.ADVANCED_PROJECT_HUB]: t('module.advancedProjectHub'),
    [EAdvancedModules.COMPLIANCE_CHECK]: t('module.complianceCheck'),
    [EAdvancedModules.CUSTOM_METADATA_FIELDS]: t('module.customMetadataFields'),
    [EAdvancedModules.WATERMARK]: t('module.watermark'),
    [EAdvancedModules.ENTERPRISE_SSO]: t('module.enterpriseSSO'),
    [EAdvancedModules.CUSTOMER_SERVICE]: t('module.customerService'),
    [EAdvancedModules.PROFESSIONAL_SERVICES]: t('module.professionalServices'),
    [EPrivateModules.PRIVATE_IMPLEMENTATION]: t('private.implementation'),
    [EPrivateModules.OPERATION_MAINTENANCE]: t('operation.maintenance'),
    [EAdvancedModules.AI_AUTO_TAG]: t('module.aiAutoTag'),
    [EAdvancedModules.AI_AUTO_TAG_MODULE]: t('module.aiAutoTagModule'),
    [EAdvancedModules.AI_AUTO_TAG_POINTS]: t('module.aiAutoTagPoints'),
    [EAdvancedModules.GA]: t('module.ga'),
  }

  const ssoTypeNames = {
    [EAdvancedModules.SSO_FEISHU]: t('sso.feishu'),
    [EAdvancedModules.SSO_WECOM]: t('sso.wecom'),
    [EAdvancedModules.SSO_DINGTALK]: t('sso.dingtalk'),
    [EAdvancedModules.SSO_Teams]: 'Microsoft Teams',
  }

  const allSSOType = isInChina
    ? [
        EAdvancedModules.SSO_FEISHU,
        EAdvancedModules.SSO_WECOM,
        EAdvancedModules.SSO_DINGTALK,
        EAdvancedModules.SSO_Teams,
      ]
    : [EAdvancedModules.SSO_Teams]

  return { pricing, moduleNames, prefix, ssoTypeNames, allSSOType }
}

export const useBasicConfigs = () => {
  const { t } = useTranslation('quotation')
  const { activeTab } = useQuotationStore()
  const { isInChina } = useCountry()
  const { pricing, prefix } = usePricing()
  const basicPricing = pricing['basic']
  const advancedPricing = pricing['advanced']

  return activeTab === TabEnum.BASIC
    ? [
        {
          key: 'memberSeats',
          title: t('member.seat'),
          min: 1,
          hint: [t('basic.memberSeats.hint')],
          des:
            `${prefix} ${basicPricing.memberSeatPrice}${t('memberSeats.perYear')}` +
            ` (${prefix} ${Math.ceil(basicPricing.memberSeatPrice / 12)}${t('memberSeats.perMonth')})`,
        },
        {
          key: 'storageSpace',
          title: t('storage.space'),
          min: 1,
          hint: [t('basic.storageSpace.hint')],
          des:
            `${prefix} ${basicPricing.storageSpacePrice}/GB${t('per.year')}` +
            ` (${prefix} ${Math.ceil(basicPricing.storageSpacePrice / 12)}/GB${t('per.year')})`,
        },
        {
          key: 'aiPoints',
          title: t('ai.points'),
          min: 0,
          hint: [t('basic.aiPoints.hint1'), t('basic.aiPoints.hint2')],
          des:
            `${prefix} ${formatWithToLocaleString(basicPricing.aiPointsPrice)}${t('per.year')}` +
            ` ( ${prefix} ${parseFloat((basicPricing.aiPointsPrice / 4000 / 12).toFixed(3))}${t('aiPoints.unit')})`,
        },
      ]
    : [
        {
          key: EBasicConfigKey.MEMBER_SEATS,
          title: t('member.seat'),
          hint: [t('advanced.memberSeats.hint')],
          min: isInChina ? 15 : 10,
          price: advancedPricing.memberSeatPrice,
          des:
            `${prefix} ${advancedPricing.memberSeatPrice}${t('memberSeats.perYear')}` +
            ` (${prefix} ${Math.ceil(advancedPricing.memberSeatPrice / 12)}${t('memberSeats.perMonth')})`,
        },
        {
          key: EBasicConfigKey.STORAGE_SPACE,
          min: 3,
          title: t('storage.space'),
          hint: [t('advanced.storageSpace.hint')],
          tag: '1TB',
          des:
            `${prefix} ${formatWithToLocaleString(advancedPricing.storageSpacePrice)}/TB${t('per.year')}` +
            ` ( ${prefix} ${Math.ceil(advancedPricing.storageSpacePrice / 12)}/TB${t('per.year')})`,
        },
        {
          key: EBasicConfigKey.AI_POINTS,
          title: t('ai.points'),
          min: 0,
          hint: [t('advanced.aiPoints.hint1'), t('advanced.aiPoints.hint2')],
          des:
            `${prefix} ${formatWithToLocaleString(advancedPricing.aiPointsPrice)}${t('per.year')}` +
            ` ( ${prefix} ${parseFloat((advancedPricing.aiPointsPrice / 4000 / 12).toFixed(3))}${t('aiPoints.unit')})`,
          price: advancedPricing.aiPointsPrice,
        },
      ]
}

export const useAdvancedConfigs = () => {
  const { t } = useTranslation('quotation')
  const { pricing } = usePricing()
  const { moduleNames } = usePricing()

  const advancedPricing = pricing.advanced
  const { isInChina } = useCountry()

  const modules: IModules[] = [
    {
      key: EAdvancedModules.ADVANCED_FEATURES,
      label: moduleNames[EAdvancedModules.ADVANCED_FEATURES],
      price: advancedPricing.modules[EAdvancedModules.ADVANCED_FEATURES],
      disabled: true,
    },
    {
      key: EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE,
      label: moduleNames[EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE],
      price: advancedPricing.modules[EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE],
    },
    {
      key: EAdvancedModules.STANDARD_PROJECT_HUB,
      label: moduleNames[EAdvancedModules.STANDARD_PROJECT_HUB],
      price: advancedPricing.modules[EAdvancedModules.STANDARD_PROJECT_HUB],
    },
    {
      key: EAdvancedModules.ADVANCED_PROJECT_HUB,
      label: moduleNames[EAdvancedModules.ADVANCED_PROJECT_HUB],
      price: advancedPricing.modules[EAdvancedModules.ADVANCED_PROJECT_HUB],
    },

    {
      key: EAdvancedModules.AI_AUTO_TAG,
      label: moduleNames[EAdvancedModules.AI_AUTO_TAG],
      price: 0,
      hint: t('ai.autoTag.hint'),
      noPrice: true,
      subFlex: 'column',
      subModules: [
        {
          key: EAdvancedModules.AI_AUTO_TAG_MODULE,
          label: moduleNames[EAdvancedModules.AI_AUTO_TAG_MODULE],
          price: advancedPricing.modules[EAdvancedModules.AI_AUTO_TAG_MODULE],
          disabled: true,
        },
        {
          key: EAdvancedModules.AI_AUTO_TAG_POINTS,
          label: moduleNames[EAdvancedModules.AI_AUTO_TAG_POINTS],
          price: advancedPricing.modules[EAdvancedModules.AI_AUTO_TAG_POINTS],
          disabled: true,
          hint: t('ai.autoTag.points.hint'),
          tag: t('ai.autoTag.points.tag'),
          min: 1,
        },
      ],
    },
    {
      key: EAdvancedModules.COMPLIANCE_CHECK,
      label: moduleNames[EAdvancedModules.COMPLIANCE_CHECK],
      price: advancedPricing.modules[EAdvancedModules.COMPLIANCE_CHECK],
    },
    {
      key: EAdvancedModules.CUSTOM_METADATA_FIELDS,
      label: moduleNames[EAdvancedModules.CUSTOM_METADATA_FIELDS],
      price: advancedPricing.modules[EAdvancedModules.CUSTOM_METADATA_FIELDS],
    },
    {
      key: EAdvancedModules.WATERMARK,
      label: moduleNames[EAdvancedModules.WATERMARK],
      price: advancedPricing.modules[EAdvancedModules.WATERMARK],
    },
    {
      key: EAdvancedModules.ENTERPRISE_SSO,
      label: moduleNames[EAdvancedModules.ENTERPRISE_SSO],
      price: advancedPricing.modules[EAdvancedModules.SSO_FEISHU] ?? 0,
      subFlex: 'row',
      unit: t('sso.unit'),
      noCheckBox: true,
      subModules: [
        ...(isInChina
          ? [
              {
                key: EAdvancedModules.SSO_FEISHU,
                label: t('sso.feishu'),
                noPrice: true,
                price: advancedPricing.modules[EAdvancedModules.SSO_FEISHU] ?? 0,
              },
              {
                key: EAdvancedModules.SSO_WECOM,
                label: t('sso.wecom'),
                noPrice: true,
                price: advancedPricing.modules[EAdvancedModules.SSO_WECOM] ?? 0,
              },
              {
                key: EAdvancedModules.SSO_DINGTALK,
                label: t('sso.dingtalk'),
                noPrice: true,
                price: advancedPricing.modules[EAdvancedModules.SSO_DINGTALK] ?? 0,
              },
            ]
          : []),
        {
          key: EAdvancedModules.SSO_Teams,
          label: 'Microsoft Teams',
          noPrice: true,
          price: advancedPricing.modules[EAdvancedModules.SSO_Teams] ?? 0,
        },
      ],
    },
    ...(isInChina
      ? [
          {
            key: EAdvancedModules.GA,
            label: moduleNames[EAdvancedModules.GA],
            price: advancedPricing.modules[EAdvancedModules.GA],
            hint: t('ga.hint'),
            unit: t('ga.unit'),
            tag: '10TB',
            min: 1,
          },
        ]
      : []),
    {
      key: EAdvancedModules.CUSTOMER_SERVICE,
      label: moduleNames[EAdvancedModules.CUSTOMER_SERVICE],
      price: advancedPricing.modules[EAdvancedModules.CUSTOMER_SERVICE],
    },
    {
      key: EAdvancedModules.PROFESSIONAL_SERVICES,
      label: moduleNames[EAdvancedModules.PROFESSIONAL_SERVICES],
      price: advancedPricing.modules[EAdvancedModules.PROFESSIONAL_SERVICES],
    },
  ]

  // 私有化权益
  // [
  //     // 私有化部署
  //     {
  //         key: EPrivateModules.PRIVATE_IMPLEMENTATION,
  //         label: moduleNames[EPrivateModules.PRIVATE_IMPLEMENTATION],
  //         price: pricing.private.modules[EPrivateModules.PRIVATE_IMPLEMENTATION],

  //     },
  //     // 运维服务
  //     {
  //         key: EPrivateModules.OPERATION_MAINTENANCE,
  //         label: moduleNames[EPrivateModules.OPERATION_MAINTENANCE],
  //         price: pricing.private.modules[EPrivateModules.OPERATION_MAINTENANCE],

  //     },
  // ]
  return modules
}
