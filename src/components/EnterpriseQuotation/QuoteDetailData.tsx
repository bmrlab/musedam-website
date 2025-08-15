import { useTranslation } from '@/app/i18n/client'
import { usePricing, useBasicConfigs, useAdvancedConfigs, EAdvancedModules, EPrivateModules } from './config'
import { TabEnum } from './types'
import { formatWithToLocaleString } from '@/utilities/formatPrice'
import { useCountry } from '@/providers/Country'
import { useMemo } from 'react'
import { useLanguage } from '@/providers/Language'
import { useQuotationStore } from '@/providers/QuotationStore'

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
}

export interface QuoteDetailRowFormatted {
    name: React.ReactNode
    quantity: string
    unit?: string
    subtotal?: string
    bold?: boolean
    isSection?: boolean
    isModule?: boolean
    des?: string
    previewDes?: string
    key?: string
}

export interface QuoteDetailData {
    rows: QuoteDetailRowFormatted[]
    allModules: QuoteDetailRow[]
    subtotal: string
    total: string
    years: number
    totalNumPerYear: number
    /** 基础套餐价格/年 */
    basicCostPerYear: number
    /** 折后总价 */
    discountTotal?: string
}


export const useQuoteDetailData = (): QuoteDetailData => {
    const {
        activeTab,
        advancedConfig,
        advancedModules,
        privateConfig,
        privateModules,
        basicConfig,
        subscriptionYears,
        discount
    } = useQuotationStore()
    const { isInChina } = useCountry()
    const { t } = useTranslation('quotation')
    const basicConfigs = useBasicConfigs()
    const advancedConfigs = useAdvancedConfigs()
    const { pricing, moduleNames, prefix, ssoTypeNames } = usePricing()
    const advancedPricing = pricing.advanced.modules
    const { language } = useLanguage()

    const renderCost = (cost: number) => {
        return `${prefix}${formatWithToLocaleString(cost)}${t('per.year')}`
    }

    const getYear = (years: number) => {
        if (years > 1) {
            return `${years} ${t('years')}`
        }
        return `1 ${t('year')}`
    }

    const rows: QuoteDetailRow[] = []
    let allModules: QuoteDetailRow[] = []

    let basicCostPerYear = 0
    let privatePerYear = 0

    if (activeTab === TabEnum.BASIC || activeTab === TabEnum.ADVANCED) {
        const isBasic = activeTab === TabEnum.BASIC;
        const packageBasic = isBasic ? basicConfig : advancedConfig
        const pricingBasic = isBasic ? pricing.basic : pricing.advanced

        // 主套餐
        rows.push(isBasic ? {
            name: t('basic.edition'),
            quantity: `${subscriptionYears} ${subscriptionYears > 1 ? t('years') : t('year')}`,
            bold: true,
            isSection: true,
        } : {
            name: t('enterprise.edition'),
            quantity: `${subscriptionYears} ${subscriptionYears > 1 ? t('years') : t('year')}`,
            bold: true,
            isSection: true,
        })

        // 基础配置项
        basicConfigs.forEach(({ key, title, hint }) => {
            let quantity = ''
            let cost = 0
            if (key === 'memberSeats') {
                quantity = `${packageBasic.memberSeats} ${t('seats')}`
                cost = packageBasic.memberSeats * pricingBasic.memberSeatPrice
            } else if (key === 'storageSpace') {
                quantity = `${packageBasic.storageSpace}` + (isBasic ? 'GB' : 'TB')
                cost = packageBasic.storageSpace * pricingBasic.storageSpacePrice
            } else if (key === 'aiPoints') {
                quantity = `${formatWithToLocaleString(4000 * packageBasic.aiPoints)} ${prefix}${t('points.month')}`
                cost = Math.round(packageBasic.aiPoints * pricingBasic.aiPointsPrice)
            }

            basicCostPerYear += cost
            if (cost > 0) {
                rows.push({
                    key,
                    name: title,
                    quantity: quantity,
                    des: hint.at(-1),
                    unit: renderCost(cost / (key === 'memberSeats' ? packageBasic.memberSeats : key === 'storageSpace' ? packageBasic.storageSpace : packageBasic.aiPoints)),
                    subtotal: cost,
                })
            }
        })
    }

    if (activeTab === TabEnum.ADVANCED) {
        // 高级模块
        const moduleRows = advancedConfigs.map(({ key, label, price, }) => {
            if (key === EAdvancedModules.AI_AUTO_TAG) {
                const moduleCost = Number(advancedPricing[EAdvancedModules.AI_AUTO_TAG_MODULE])
                const pointsNum = Math.max(Number(advancedModules[EAdvancedModules.AI_AUTO_TAG_POINTS]), 1)
                const perPointCost = advancedPricing[EAdvancedModules.AI_AUTO_TAG_POINTS]
                const pointsCost = pointsNum * perPointCost
                const cost = moduleCost + pointsCost
                return {
                    key,
                    name: label,
                    quantity: `${pointsNum} ${t("year")}${t(subscriptionYears > 1 ? "ai.AutoTagEngine.quantity.perYear" : "ai.AutoTagEngine.quantity", { value: language === 'zh-CN' ? pointsNum * 26.8 : (pointsNum * 268000).toLocaleString() })}`,
                    unit: `${prefix}${cost.toLocaleString()}${t('per.year')}`,
                    subtotal: cost,
                    isModule: true,
                    des: t('ai.AutoTagEngine.des', { moduleCost: moduleCost.toLocaleString(), pointsNum: pointsNum, prefix: prefix, pointsCost: pointsCost.toLocaleString() }),
                    previewDes: t('ai.AutoTagEngine.previewDes'),
                }
            }

            if (key === EAdvancedModules.ENTERPRISE_SSO) {
                const allSSOType = [EAdvancedModules.SSO_FEISHU, EAdvancedModules.SSO_WECOM, EAdvancedModules.SSO_DINGTALK]
                let hasSSOType = allSSOType.filter((v) => !!advancedModules[v])
                const cost = hasSSOType.length * price
                return {
                    key,
                    name: `${label}(${(hasSSOType.length > 0 ? hasSSOType : allSSOType).map((v) => ssoTypeNames[v]).join(', ')})`,
                    quantity: getYear(hasSSOType.length ? subscriptionYears : 1),
                    unit: `${prefix}${price.toLocaleString()}${t('sso.unit')}`,
                    subtotal: cost,
                    isModule: true,
                    notBuy: !hasSSOType.length
                }
            }

            if (key === EAdvancedModules.GA) {
                const GaNum = Math.max(Number(advancedModules[EAdvancedModules.GA]), 1)
                const cost = price * GaNum
                return {
                    key,
                    name: `${label}(${10 * GaNum}TB${t("package")})`,
                    quantity: getYear(!advancedModules[key] ? 1 : subscriptionYears),
                    unit: `${prefix}${cost.toLocaleString()}/10TB${t('per.year')}`,
                    subtotal: cost,
                    isModule: true,
                }
            }

            return {
                key,
                name: label,
                quantity: getYear(!advancedModules[key] ? 1 : subscriptionYears),
                unit: price === 0 ? t('free') : `${prefix}${price.toLocaleString()}${t('per.year')}`,
                subtotal: price === 0 ? t('free') : price,
                isModule: true,
            }
        })


        allModules = moduleRows;
        const filterModules = moduleRows.filter((v) => !v.notBuy && advancedModules[v.key])

        if (filterModules.length > 0) {
            rows.push({
                name: t('advanced.modules.title'),
                quantity: '',
                unit: '',
                subtotal: '',
                isSection: true,
                bold: true
            })
            rows.push(...filterModules)
        }
    }

    if (activeTab === TabEnum.PRIVATE) {
        // 软件许可
        rows.push({
            name: t('software.license'),
            quantity: `${subscriptionYears} ${t('year.s')}`,
            bold: true,
            isSection: true,
        })

        // 成员席位
        const memberCost = privateConfig.memberSeats * pricing.private.memberSeatPrice
        basicCostPerYear += memberCost
        rows.push({
            name: t('member.seat'),
            quantity: `${privateConfig.memberSeats} ${t('seats')}`,
            unit: `${prefix}${privateConfig.memberSeats * pricing.private.memberSeatPrice}${t('per.year')}`,
            subtotal: memberCost,
        })

        // 高级模块
        const moduleRows: QuoteDetailRow[] = []
        Object.keys(privateModules).filter(key => key !== EPrivateModules.PRIVATE_IMPLEMENTATION && key !== EPrivateModules.OPERATION_MAINTENANCE && key !== 'maintenanceYears').forEach(key => {
            if (privateModules[key]) {
                const price = pricing.private.modules[key]
                // privatePerYear += price
                moduleRows.push({
                    name: moduleNames[key],
                    quantity: `1 ${t('year.s')}`,
                    unit: `${prefix}${price}${t('per.year')}`,
                    subtotal: price === 0 ? t('free') : price,
                    isModule: true,
                })
            }
        })

        if (moduleRows.length > 0) {
            rows.push({
                name: t('advanced.modules.title'),
                quantity: '',
                unit: '',
                subtotal: '',
                isSection: true,
            })
            rows.push(...moduleRows)
        }

        // 私有化实施
        if (privateModules.privateImplementation) {
            const price = pricing.private.modules.privateImplementation
            privatePerYear += price
            rows.push({
                name: t('private.implementation'),
                quantity: '1',
                unit: `${prefix}${price}`,
                subtotal: price,
            })
        }

        // 运维服务
        if (privateModules.operationMaintenance) {
            const price = pricing.private.modules.operationMaintenance * privateModules.maintenanceYears
            privatePerYear += price
            rows.push({
                name: t('operation.maintenance.times', { times: privateModules.maintenanceYears }),
                quantity: `${privateModules.maintenanceYears} ${t('year.s')}`,
                unit: `${prefix}${pricing.private.modules.operationMaintenance}${t('per.year')}`,
                subtotal: price,
            })
        }
    }



    const advancedCostPerYear = useMemo(() => Object.keys(advancedModules).filter((v) => !!advancedModules[v]).reduce((total, key) => {
        const value = advancedModules[key];
        const price = advancedPricing[key]
        if (!price) return total
        return total + price * (typeof value === 'number' ? value : 1)
    }, 0), [advancedModules, advancedPricing])

    const totalPerYear = basicCostPerYear + advancedCostPerYear
    /** 未税- 未折扣价 */
    const noTaxTotal = totalPerYear * subscriptionYears

    /** 未税- 折扣价 */
    const discountTotal = noTaxTotal * ((discount || 10) / 10)



    return {
        rows: rows.map((v) => ({
            ...v,
            subtotal: typeof v.subtotal === 'string' ? v.subtotal : v.subtotal ? prefix + (v.subtotal * subscriptionYears).toLocaleString() : undefined
        })),
        allModules, // 全部高级模块
        subtotal: prefix + noTaxTotal.toLocaleString(),
        /** 税后- 折扣价 */
        total: prefix + (discountTotal * (isInChina ? 1.06 : 1)).toLocaleString(),
        discountTotal: discount ? prefix + discountTotal.toLocaleString() : undefined,
        years: subscriptionYears,
        basicCostPerYear: basicCostPerYear,
        totalNumPerYear: totalPerYear
    }
}


export const useExpandServices = () => {
    const { t } = useTranslation('quotation')
    const { isInChina } = useCountry()
    const { language } = useLanguage()

    const expansions = useMemo(() => [
        {
            name: t('expansion.memberSeats'),
            description: t('expansion.memberSeats.desc'),
            value: (isInChina ? '¥1,000' : '$300') + t('memberSeats.perYear'),
            unit: (isInChina ? '¥1,000' : '$300') + t('memberSeats.perYear'),
            quantity: `1 ${t('year')}`
        },

        {
            name: t('expansion.storageSpace'),
            description: t('expansion.storageSpace.desc'),
            value: (isInChina ? '¥5,000/TB' : '$1,000/TB') + t("per.year"),
            unit: (isInChina ? '¥5,000/TB' : '$1,000/TB') + t('per.year'),
            quantity: `1 ${t('year')}`
        },

        {
            name: t('expansion.aiPoints'),
            description: t('expansion.aiPoints.desc'),
            value: `${isInChina ? '¥20,000' : '$5,760'}${t('per.year')}\n /268,000` + t('expansion.points'),
            unit: (isInChina ? '¥20,000' : '$5,760') + '/' + t("ai.AutoTagEngine.unit"),
            quantity: `1 ${t('year')}${t("ai.AutoTagEngine.quantity", { value: language === 'zh-CN' ? 26.8 : (268000).toLocaleString() })}`
        },

        {
            name: t('expansion.downloadData'),
            description: t('expansion.downloadData.desc'),
            value: isInChina ? '¥150/TB' : '$30/TB',
            unit: (isInChina ? '¥150' : '$30') + '/' + t('ai.AutoTagEngine.unit'),
            quantity: `1 ${t('ai.AutoTagEngine.unit')}${t('expand.download.quantity', { value: '1TB' })}`
        },
        ...(!isInChina ? [] : [{
            name: t('expansion.GA'),
            description: t('expansion.GA.desc'),
            value: `¥30,000${t("per.year")}\n /10TB`,
            unit: '¥30,000/' + t('ai.AutoTagEngine.unit'),
            quantity: `1 ${t('ai.AutoTagEngine.unit')}${t('expand.download.quantity', { value: '10TB' })}`
        }])
    ], [t, isInChina, language])

    return expansions
}