import { useTranslation } from '@/app/i18n/client'
import { usePricing, useBasicConfigs, useAdvancedConfigs, EAdvancedModules, EPrivateModules } from './config'
import { TabEnum, useQuotationContext } from './index'
import { formatWithToLocaleString } from '@/utilities/formatPrice'
import { useCountry } from '@/providers/Country'
import { useMemo } from 'react'

export interface QuoteDetailRow {
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
    rows: QuoteDetailRow[]
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
    } = useQuotationContext()
    const { isInChina } = useCountry()
    const { t } = useTranslation('quotation')
    const basicConfigs = useBasicConfigs()
    const advancedConfigs = useAdvancedConfigs()
    const { pricing, moduleNames, prefix, ssoTypeNames } = usePricing()
    const advancedPricing = pricing.advanced.modules

    const renderCost = (cost: number) => {
        return `${prefix}${formatWithToLocaleString(cost)}${t('per.year')}`
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
            quantity: `${subscriptionYears} ${t('year.s')}`,
            bold: true,
            isSection: true,
        } : {
            name: t('enterprise.edition'),
            quantity: `${subscriptionYears} ${t('year.s')}`,
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
                    unit: renderCost(cost / (key === 'memberSeats' ? basicConfig.memberSeats : key === 'storageSpace' ? basicConfig.storageSpace : basicConfig.aiPoints)),
                    subtotal: `${prefix}${formatWithToLocaleString(cost)}`,
                })
            }
        })
    }

    if (activeTab === TabEnum.ADVANCED) {
        // 高级模块
        const moduleRows = advancedConfigs.map(({ key, label, price, }) => {
            if (key === EAdvancedModules.AI_AUTO_TAG) {
                const moduleCost = Number(advancedPricing[EAdvancedModules.AI_AUTO_TAG_MODULE])

                const pointsNum = Number(advancedModules[EAdvancedModules.AI_AUTO_TAG_POINTS])
                const pointsCost = pointsNum * advancedPricing[EAdvancedModules.AI_AUTO_TAG_POINTS]
                const cost = moduleCost + pointsCost
                return {
                    key,
                    name: label,
                    quantity: `1${t('year.s')} + ${t("ai.AutoTagEngine.quantity", { value: pointsNum })}`,
                    unit: `${prefix}${cost.toLocaleString()}/${t('year.s')}`,
                    subtotal: `${prefix}${cost.toLocaleString()}`,
                    isModule: true,
                    des: t('ai.AutoTagEngine.des', { moduleCost: moduleCost, pointsNum: pointsNum, prefix: prefix, pointsCost: pointsCost }),
                    previewDes: t('ai.AutoTagEngine.previewDes'),
                }
            }

            if (key === EAdvancedModules.ENTERPRISE_SSO) {
                const hasSSOType = [EAdvancedModules.SSO_FEISHU, EAdvancedModules.SSO_WECOM, EAdvancedModules.SSO_DINGTALK].filter((v) => !!advancedModules[v])
                const cost = hasSSOType.length * price
                if (!hasSSOType.length) return undefined
                return {
                    key,
                    name: `${label}(${hasSSOType.map((v) => ssoTypeNames[v]).join(', ')})`,
                    quantity: `1 ${t('year.s')}`,
                    unit: `${prefix}${price.toLocaleString()}${t('sso.unit')}`,
                    subtotal: `${prefix}${cost.toLocaleString()}`,
                    isModule: true,
                }
            }

            if (key === EAdvancedModules.GA) {
                const GaNum = Number(advancedModules[EAdvancedModules.GA])
                const cost = price * GaNum
                return {
                    key,
                    name: `${label}(${10 * GaNum}TB${t("package")})`,
                    quantity: `1 ${t('year.s')}`,
                    unit: `${prefix}${cost.toLocaleString()}/10TB${t('per.year')}`,
                    subtotal: `${prefix}${cost.toLocaleString()}`,
                    isModule: true,
                }
            }

            return {
                key,
                name: label,
                quantity: `1 ${t('year.s')}`,
                unit: `${prefix}${price.toLocaleString()}/${t('year.s')}`,
                subtotal: `${prefix}${price.toLocaleString()}`,
                isModule: true,
            }
        }).filter((v) => !!v)


        allModules = moduleRows;
        if (moduleRows.length > 0) {
            rows.push({
                name: t('advanced.modules.title'),
                quantity: '',
                unit: '',
                subtotal: '',
                isSection: true,
                bold: true
            })
            rows.push(...moduleRows.filter((v) => advancedModules[v.key]))
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
            subtotal: `${prefix}${memberCost}`,
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
                    subtotal: `${prefix}${price}`,
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
                subtotal: `${prefix}${price}`,
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
                subtotal: `${prefix}${price}`,
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
        rows,
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