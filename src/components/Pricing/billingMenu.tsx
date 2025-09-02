import { useMemo } from 'react'
import { useCountry } from '@/providers/Country'
import { useTranslation } from 'react-i18next'

import { BillingType, EPlanProductType, PlanType } from './types/plan'
import { EMuseProductType } from './types/products'

export const useBillingMenu = ({ isMuseAI }: { isMuseAI: boolean }) => {
  const { t } = useTranslation('pricing')
  const { isInChina } = useCountry()

  const featuresSummary = {
    // 个人版
    [EPlanProductType.PERSON_FREE]: [
      t('pricing.summary.storage.personal', { val: '5GB' }),
      t('pricing.1.person.no.expansion.allowed'),
      // isInChina ? undefined : t('pricing.summary.points.onetime', { val: 100 }),
    ],
    [EPlanProductType.PERSON_PRO]: [
      t('pricing.summary.storage.personal', { val: '100G' }),
      t('pricing.1.person.no.expansion.allowed'),
      // isInChina ? undefined : t('pricing.summary.points', { val: 200 }),
      t('pricing.summary.ai'),
      t('pricing.encrypted_sharing.label'),
    ],
    [EPlanProductType.PERSON_PRO_PLUS]: [
      t('pricing.summary.storage.personal', { val: '1T (1024G) ' }),
      t('pricing.1.person.no.expansion.allowed'),
      // isInChina ? undefined : t('pricing.summary.points', { val: 800 }),
      t('pricing.summary.ai'),
      t('pricing.encrypted_sharing.label'),
    ],
    [EPlanProductType.PERSON_PRO_MASTER]: [
      t('pricing.summary.storage.personal', { val: '3T (3072G) ' }),
      t('pricing.1.person.no.expansion.allowed'),
      // isInChina ? undefined : t('pricing.summary.points', { val: '2,000' }),
      t('pricing.summary.ai'),
      t('pricing.summary.accelerated'),
    ],
    // 团队版
    [EPlanProductType.TEAM_BASIC]: [
      t('pricing.summary.ai'),
      t('pricing.summary.storage', { val: isInChina ? '100G' : '300G' }),
      t('pricing.summary.seats', { val: 5 }),
      // isInChina ? undefined : t('pricing.summary.points', { val: '4,000' }),
      t('pricing.summary.folderAuth'),
    ],
    [EPlanProductType.TEAM_PRO]: [
      t('pricing.summary.ai'),
      t('pricing.summary.storage', { val: '1T(1024G)' }),
      t('pricing.summary.seats', { val: 10 }),
      // isInChina ? undefined : t('pricing.summary.points', { val: '8,000' }),
      t('pricing.summary.folderAuth'),
    ],
    [EPlanProductType.TEAM_FLAGSHIP]: [
      t('pricing.summary.ai'),
      t('pricing.summary.storage', { val: '3T(3072G)' }),
      t('pricing.summary.seats', { val: isInChina ? 15 : 30 }),
      // isInChina ? undefined : t('pricing.summary.points', { val: '24,000' }),
      t('pricing.summary.folderAuth'),
    ],
    [EPlanProductType.ENTERPRISE]: [
      t('pricing.summary.enterprise.team'),
      t('pricing.summary.enterprise.seatSet'),
      t('pricing.summary.enterprise.roleSet'),
      t('pricing.summary.enterprise.memberAndDepartment'),
      t('pricing.summary.enterprise.folder'),
    ],
  }

  // 企业官网-团队版
  const enterpriseSummary = {
    [EPlanProductType.TEAM_BASIC]: [
      t('pricing.summary.seats', { val: 2 }),
      t('pricing.summary.storage.expand', { val: '100GB' }),
      t('pricing.summary.ai.new'),
      t('pricing.enterpriseSummary.basicFolderPermissions'),
    ],
    [EPlanProductType.TEAM_FLAGSHIP]: [
      t('pricing.summary.seats', { val: isInChina ? 15 : 10 }),
      t('pricing.summary.storage', { val: '3T(3072G)' }),
      t('pricing.enterpriseSummary.includesAllBasic'),
      t('pricing.enterpriseSummary.advancedPermissions'),
      t('pricing.enterpriseSummary.advancedExtensions'),
    ],
    [EPlanProductType.ENTERPRISE]: [
      t('pricing.enterpriseSummary.customPlans'),
      t('pricing.enterpriseSummary.dedicatedManager'),
      t('pricing.enterpriseSummary.awsDeployment'),
      t('pricing.enterpriseSummary.sla'),
    ],
  }

  // museAI
  const museAIBillingMenu = {
    [PlanType.personal]: [
      {
        key: EPlanProductType.PERSON_FREE,
        title: t('pricing.personal.free'),
        description: t('pricing.personal.free.des'),
        buttonType: 'try',
        summary: [
          t('plan.summary.copyright.free'),
          t('plan.summary.use.free'),
          t('plan.summary.point.free', { val: 100 }),
          t('plan.summary.storage.free', { val: '5G' }),
        ],
        uncheckSummary: [t('pricing.summary.privacy')],
        des: t('pricing.personal.free.price.hint'),
        price: '0',
        period: ' ',
      },
      {
        key: EPlanProductType.PERSON_PRO_SEASON,
        title: t('pricing.personal.proSeason'),
        description: t('pricing.personal.proPlus.des'),
        buttonType: 'buy',
        isHighlight: true,
        summary: [
          t('plan.summary.copyright.personal'),
          t('plan.summary.usage_rights'),
          t('plan.summary.points.perMonth', { val: 800 }),
          t('plan.summary.storage', { val: '1T (1024G)' }),
          t('plan.summary.seats.person_pro'),
        ],
        price: EMuseProductType.PERSON_PRO_SEASON,
        desFn: (price: number) =>
          t('pricing.menuCard.personal.price.des', { val: Math.ceil(price / 3) }),
        period: t('pricing.perSeason'),
      },
      {
        key: EPlanProductType.PERSON_PRO_PLUS,
        title: t('pricing.personal.proPlus'),
        description: t('pricing.personal.proPlus.des'),
        buttonType: 'buy',
        summary: [
          t('plan.summary.copyright.personal'),
          t('plan.summary.usage_rights'),
          t('plan.summary.points.perMonth', { val: 800 }),
          t('plan.summary.storage', { val: '1T (1024G)' }),
          t('plan.summary.seats.person_pro'),
        ],
        price: EMuseProductType.PERSON_PRO_ANNUAL,
        desFn: (price: number) =>
          t('pricing.menuCard.personal.price.des', { val: Math.ceil(price / 12) }),
        period: t('pricing.perYear'),
      },
      {
        key: EPlanProductType.PERSON_PRO_MONTH,
        title: t('pricing.personal.proMonth'),
        description: t('pricing.personal.proPlus.des'),
        buttonType: 'buy',
        summary: [
          t('plan.summary.copyright.personal'),
          t('plan.summary.usage_rights'),
          t('plan.summary.points.perMonth', { val: 800 }),
          t('plan.summary.storage', { val: '1T (1024G)' }),
          t('plan.summary.seats.person_pro'),
        ],

        price: EMuseProductType.PERSON_PRO_SIGN,
        des: t('pricing.menuCard.monthly.des'),
        period: t('pricing.perMonth'),
      },
    ],
    [PlanType.team]: [
      {
        key: EPlanProductType.TEAM_BASIC,
        title: t('pricing.team.basic'),
        description: t('pricing.team.basic.des'),
        buttonType: 'buy',
        summary: [
          t('plan.summary.copyright.enterprise'),
          t('plan.summary.usage_rights'),
          t('plan.summary.points.perMonth', { val: '4,000' }),
          t('plan.summary.storage', { val: '100G' }),
          t('plan.summary.seats.team', { val: 5 }),
        ],
        uncheckSummary: [t('plan.summary.team.gallery')],
        des: t('pricing.menuCard.team.price.des', { val: '2,688' }),
        price: EMuseProductType.ORG_BASIC,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.TEAM_PRO,
        title: t('pricing.team.pro'),
        description: t('pricing.team.pro.des'),
        buttonType: 'buy',
        isHighlight: true,
        summary: [
          t('plan.summary.copyright.enterprise'),
          t('plan.summary.usage_rights'),
          t('plan.summary.points.perMonth', { val: '8,000' }),
          t('plan.summary.storage', { val: '1T' }),
          t('plan.summary.seats.team', { val: 10 }),
          t('plan.summary.team.gallery'),
        ],

        desFn: (price: number) =>
          t('pricing.menuCard.team.price.des', { val: price.toLocaleString() }),
        price: EMuseProductType.ORG_PROFESSION,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.TEAM_FLAGSHIP,
        title: t('pricing.team.flagship'),
        description: t('pricing.team.flagship.des'),
        buttonType: 'buy',
        summary: [
          t('plan.summary.copyright.enterprise'),
          t('plan.summary.usage_rights'),
          t('plan.summary.points.perMonth', { val: '24,000' }),
          t('plan.summary.storage', { val: '3T' }),
          t('plan.summary.seats.team', { val: 15 }),
          t('plan.summary.team.gallery'),
        ],

        desFn: (price: number) =>
          t('pricing.menuCard.team.price.des', { val: price.toLocaleString() }),
        price: EMuseProductType.ORG_FLAGSHIP,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.ENTERPRISE,
        title: t('pricing.team.enterprise'),
        description: t('pricing.team.enterprise.des.domestic'),
        buttonType: 'contact',
        summary: [
          t('plan.summary.copyright.enterprise'),
          t('plan.summary.usage_rights'),
          t('plan.summary.team.gallery'),
          t('pricing.summary.enterprise.memberAndDepartment'),
          t('pricing.summary.enterprise.pointsManagement'),
          t('pricing.summary.enterprise.teamFolder'),
        ],

        icon: '/assets/Pricing/vip.svg',
        des: t('pricing.enterprise.consult'),
        price: t('pricing.contact'),
        period: null,
      },
    ],
  }

  // 企业版(团队)
  const enterpriseBillingMenu = [
    {
      key: EPlanProductType.TEAM_BASIC,
      title: t('pricing.enterpriseBilling.basic.title'),
      description: t('pricing.enterpriseBilling.basic.description'),
      buttonType: 'try',
      linkText: t('pricing.plan.actions.buy-now'),
      summary: enterpriseSummary[EPlanProductType.TEAM_BASIC],
      [BillingType.monthly]: EMuseProductType.ABROAD_ORG_BASIC_MONTHLY,
      [BillingType.yearly]: EMuseProductType.ABROAD_ORG_BASIC_YEARLY,
      period: t('pricing.perMonth'),
      priceGlobal: '60',
      price: '225',
      color: '#BBB3FF'
    },
    {
      key: EPlanProductType.TEAM_FLAGSHIP,
      title: t('pricing.enterpriseBilling.advanced.title'),
      description: t('pricing.enterpriseBilling.advanced.description'),
      buttonType: 'bookDemo',
      linkText: t('pricing.plan.actions.buy-now'),
      isHighlight: true,
      summary: enterpriseSummary[EPlanProductType.TEAM_FLAGSHIP],
      [BillingType.monthly]: EMuseProductType.ABROAD_ORG_PROFESSION_MONTHLY,
      [BillingType.yearly]: EMuseProductType.ABROAD_ORG_PROFESSION_YEARLY,
      period: t('pricing.perMonth'),
      priceGlobal: '1,250',
      price: '4,200',
      color: '#FFA3F2'
    },
    {
      key: EPlanProductType.ENTERPRISE,
      title: t('pricing.enterpriseBilling.custom.title'),
      description: t('pricing.enterpriseBilling.custom.description'),
      buttonType: 'contact',
      summary: enterpriseSummary[EPlanProductType.ENTERPRISE],
      icon: '/assets/Pricing/vip.svg',
      [BillingType.monthly]: t('pricing.contact.sales'),
      [BillingType.yearly]: t('pricing.contact.sales'),
      period: null,
      color: '#070707'
    },
  ]
  // 国内
  const domesticBillingMenu = {
    [PlanType.personal]: [
      {
        key: EPlanProductType.PERSON_FREE,
        title: t('pricing.personal.free'),
        description: t('pricing.personal.free.des'),
        buttonType: 'try',
        summary: featuresSummary[EPlanProductType.PERSON_FREE],
        uncheckSummary: [
          t('pricing.summary.ai'),
          t('pricing.ai_search.label'),
          t('pricing.ai_tag.label'),
        ],
        des: t('pricing.personal.free.price.hint'),
        price: '0',
        period: ' ',
      },
      {
        key: EPlanProductType.PERSON_PRO_YEAR,
        title: t('pricing.personal.proYear'),
        description: t('pricing.personal.pro.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        isHighlight: true,
        summary: featuresSummary[EPlanProductType.PERSON_PRO],
        price: EMuseProductType.PERSON_PRO_YEAR,
        desFn: (price: number) =>
          t('pricing.menuCard.personal.price.des', { val: Math.ceil(price / 12) }),
        period: t('pricing.perYear'),
      },
      {
        key: EPlanProductType.PERSON_PRO_PLUS,
        title: t('pricing.personal.proPlus'),
        description: t('pricing.personal.proPlus.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        summary: featuresSummary[EPlanProductType.PERSON_PRO_PLUS],
        price: EMuseProductType.PERSON_PRO_ANNUAL,
        desFn: (price: number) =>
          t('pricing.menuCard.personal.price.des', { val: Math.ceil(price / 12) }),
        period: t('pricing.perYear'),
      },
      {
        key: EPlanProductType.PERSON_PRO_MONTH,
        title: t('pricing.personal.proMonth'),
        description: t('pricing.personal.proPlus.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        summary: featuresSummary[EPlanProductType.PERSON_PRO_MASTER],

        price: EMuseProductType.PERSON_PRO_SIGN,
        des: t('pricing.menuCard.monthly.des'),
        period: t('pricing.perMonth'),
      },
    ],
    [PlanType.team]: [
      {
        key: EPlanProductType.TEAM_BASIC,
        title: t('pricing.team.basic'),
        description: t('pricing.team.basic.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        summary: featuresSummary[EPlanProductType.TEAM_BASIC],

        desFn: (price: number) =>
          t('pricing.menuCard.team.price.des', { val: price.toLocaleString() }),
        price: EMuseProductType.ORG_BASIC,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.TEAM_PRO,
        title: t('pricing.team.pro'),
        description: t('pricing.team.pro.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        isHighlight: true,
        summary: featuresSummary[EPlanProductType.TEAM_PRO],

        desFn: (price: number) =>
          t('pricing.menuCard.team.price.des', { val: price.toLocaleString() }),
        price: EMuseProductType.ORG_PROFESSION,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.TEAM_FLAGSHIP,
        title: t('pricing.team.flagship'),
        description: t('pricing.team.flagship.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        summary: featuresSummary[EPlanProductType.TEAM_FLAGSHIP],

        desFn: (price: number) =>
          t('pricing.menuCard.team.price.des', { val: price.toLocaleString() }),
        price: EMuseProductType.ORG_FLAGSHIP,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.ENTERPRISE,
        title: t('pricing.team.enterprise'),
        description: t('pricing.team.enterprise.des'),
        buttonType: 'contact',
        summary: featuresSummary[EPlanProductType.ENTERPRISE],
        icon: '/assets/Pricing/vip.svg',
        des: t('pricing.enterprise.consult'),
        price: t('pricing.contact'),
        period: null,
      },
    ],
  }
  // 海外
  const abroadBillingMenu = {
    [PlanType.personal]: [
      {
        key: EPlanProductType.PERSON_FREE,
        title: t('pricing.personal.free'),
        description: t('pricing.personal.free.des'),
        buttonType: 'try',
        summary: featuresSummary[EPlanProductType.PERSON_FREE],
        uncheckSummary: [
          t('pricing.summary.ai'),
          t('pricing.ai_search.label'),
          t('pricing.ai_tag.label'),
        ],
        [BillingType.monthly]: '0',
        [BillingType.yearly]: '0',
        period: ' ',
      },
      {
        key: EPlanProductType.PERSON_PRO,
        title: t('pricing.personal.pro'),
        description: t('pricing.personal.pro.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        summary: featuresSummary[EPlanProductType.PERSON_PRO],
        [BillingType.monthly]: EMuseProductType.ABROAD_PERSON_PRO_MONTHLY,
        [BillingType.yearly]: EMuseProductType.ABROAD_PERSON_PRO_YEARLY,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.PERSON_PRO_PLUS,
        title: t('pricing.personal.proPlus'),
        description: t('pricing.personal.proPlus.des'),
        isHighlight: true,
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        summary: featuresSummary[EPlanProductType.PERSON_PRO_PLUS],
        [BillingType.monthly]: EMuseProductType.ABROAD_PERSON_PRO_PLUS_MONTHLY,
        [BillingType.yearly]: EMuseProductType.ABROAD_PERSON_PRO_PLUS_YEARLY,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.PERSON_PRO_MASTER,
        title: t('pricing.personal.proMaster'),
        description: t('pricing.personal.proMaster.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        summary: featuresSummary[EPlanProductType.PERSON_PRO_MASTER],
        [BillingType.monthly]: EMuseProductType.ABROAD_PERSON_PRO_MASTER_MONTHLY,
        [BillingType.yearly]: EMuseProductType.ABROAD_PERSON_PRO_MASTER_YEARLY,
        period: t('pricing.perMonth'),
      },
    ],
    [PlanType.team]: [
      {
        key: EPlanProductType.TEAM_BASIC,
        title: t('pricing.team.basic'),
        description: t('pricing.team.basic.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        summary: featuresSummary[EPlanProductType.TEAM_BASIC],
        [BillingType.monthly]: EMuseProductType.ABROAD_ORG_BASIC_MONTHLY,
        [BillingType.yearly]: EMuseProductType.ABROAD_ORG_BASIC_YEARLY,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.TEAM_PRO,
        title: t('pricing.team.pro'),
        description: t('pricing.team.pro.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        isHighlight: true,
        summary: featuresSummary[EPlanProductType.TEAM_PRO],
        [BillingType.monthly]: EMuseProductType.ABROAD_ORG_PROFESSION_MONTHLY,
        [BillingType.yearly]: EMuseProductType.ABROAD_ORG_PROFESSION_YEARLY,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.TEAM_FLAGSHIP,
        title: t('pricing.team.flagship'),
        description: t('pricing.team.flagship.des'),
        buttonType: 'try',
        linkText: t('pricing.plan.actions.buy-now'),
        summary: featuresSummary[EPlanProductType.TEAM_FLAGSHIP],

        [BillingType.monthly]: EMuseProductType.ABROAD_ORG_FLAGSHIP_MONTHLY,
        [BillingType.yearly]: EMuseProductType.ABROAD_ORG_FLAGSHIP_YEARLY,
        period: t('pricing.perMonth'),
      },
      {
        key: EPlanProductType.ENTERPRISE,
        title: t('pricing.team.enterprise'),
        description: t('pricing.team.enterprise.des'),
        buttonType: 'contact',
        summary: featuresSummary[EPlanProductType.ENTERPRISE],
        icon: '/assets/Pricing/vip.svg',

        [BillingType.monthly]: t('pricing.contact'),
        [BillingType.yearly]: t('pricing.contact'),
        period: null,
      },
    ],
  }

  const billingMenu = useMemo(
    () => (isMuseAI ? museAIBillingMenu : isInChina ? domesticBillingMenu : abroadBillingMenu),
    [isMuseAI, isInChina, t],
  )

  return { billingMenu, enterpriseBillingMenu }
}
