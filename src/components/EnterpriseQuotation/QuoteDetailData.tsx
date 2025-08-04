import { useTranslation } from '@/app/i18n/client'
import { usePricing, useBasicConfigs, useAdvancedConfigs } from './config'
import { useQuotationContext } from './index'
import { formatWithToLocaleString } from '@/utilities/formatPrice'

export interface QuoteDetailRow {
    name: React.ReactNode
    quantity: string
    unit?: string
    subtotal?: string
    bold?: boolean
    isSection?: boolean
    isModule?: boolean
}

export interface QuoteDetailData {
    rows: QuoteDetailRow[]
    subtotal: string
    total: string
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
    } = useQuotationContext()

    const { t } = useTranslation('quotation')
    const basicConfigs = useBasicConfigs()
    const advancedConfigs = useAdvancedConfigs()
    const { pricing, moduleNames, prefix } = usePricing()

    const renderCost = (cost: number) => {
        return `${prefix}${formatWithToLocaleString(cost)}${t('per.year')}`
    }

    const rows: QuoteDetailRow[] = []
    let subtotal = 0

    if (activeTab === 'basic') {
        // 主套餐
        rows.push({
            name: t('basic.edition'),
            quantity: `${subscriptionYears} ${t('year.s')}`,
            bold: true,
            isSection: true,
        })

        // 基础配置项
        basicConfigs.forEach(({ key, title, hint }) => {
            let quantity = ''
            let cost = 0

            if (key === 'memberSeats') {
                quantity = `${basicConfig.memberSeats} ${t('seats')}`
                cost = basicConfig.memberSeats * pricing.basic.memberSeatPrice
            } else if (key === 'storageSpace') {
                quantity = `${basicConfig.storageSpace}GB`
                cost = basicConfig.storageSpace * pricing.basic.storageSpacePrice
            } else if (key === 'aiPoints') {
                quantity = `${formatWithToLocaleString(4000 * basicConfig.aiPoints)} ${prefix}${t('points.month')}`
                cost = Math.round(basicConfig.aiPoints * pricing.basic.aiPointsPrice)
            }

            subtotal += cost
            if (cost > 0) {
                rows.push({
                    name: title,
                    quantity: quantity,
                    unit: renderCost(cost / (key === 'memberSeats' ? basicConfig.memberSeats : key === 'storageSpace' ? basicConfig.storageSpace : basicConfig.aiPoints)),
                    subtotal: `${prefix}${formatWithToLocaleString(cost)}`,
                })
            }
        })
    } else if (activeTab === 'advanced') {
        // 主套餐
        rows.push({
            name: t('enterprise.edition'),
            quantity: `${subscriptionYears} ${t('year.s')}`,
            bold: true,
            isSection: true,
        })

        // 高级配置项
        advancedConfigs.forEach(({ key, title, hint }) => {
            if (key === 'aiPoints' && !advancedConfig.aiPoints) return

            let quantity = ''
            let cost = 0

            if (key === 'memberSeats') {
                quantity = `${advancedConfig.memberSeats} ${t('seats')}`
                cost = advancedConfig.memberSeats * pricing.advanced.memberSeatPrice
            } else if (key === 'storageSpace') {
                quantity = `${advancedConfig.storageSpace}TB`
                cost = advancedConfig.storageSpace * pricing.advanced.storageSpacePrice
            } else if (key === 'aiPoints') {
                quantity = `${formatWithToLocaleString(4000 * advancedConfig.aiPoints)} ${t('points.month')}`
                cost = Math.round(advancedConfig.aiPoints * pricing.advanced.aiPointsPrice)
            }

            subtotal += cost

            rows.push({
                name: title,
                quantity: quantity,
                unit: renderCost(cost / (key === 'memberSeats' ? advancedConfig.memberSeats : key === 'storageSpace' ? advancedConfig.storageSpace : advancedConfig.aiPoints)),
                subtotal: `${prefix}${formatWithToLocaleString(cost)}`,
            })
        })

        // 高级模块
        const moduleRows = Object.keys(advancedModules).filter(key => advancedModules[key]).map(key => {
            const price = pricing.advanced.modules[key]
            subtotal += price
            return {
                name: moduleNames[key],
                quantity: `1 ${t('year')}`,
                unit: `${prefix}${price.toLocaleString()}/${t('year')}`,
                subtotal: `${prefix}${price.toLocaleString()}`,
                isModule: true,
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
    } else if (activeTab === 'private') {
        // 软件许可
        rows.push({
            name: t('software.license'),
            quantity: `${subscriptionYears} ${t('year.s')}`,
            bold: true,
            isSection: true,
        })

        // 成员席位
        const memberCost = privateConfig.memberSeats * pricing.private.memberSeatPrice
        subtotal += memberCost
        rows.push({
            name: t('member.seat'),
            quantity: `${privateConfig.memberSeats} ${t('seats')}`,
            unit: `${prefix}${privateConfig.memberSeats * pricing.private.memberSeatPrice}${t('per.year')}`,
            subtotal: `${prefix}${memberCost}`,
        })

        // 高级模块
        const moduleRows: QuoteDetailRow[] = []
        Object.keys(privateModules).filter(key => key !== 'privateImplementation' && key !== 'operationMaintenance' && key !== 'maintenanceYears').forEach(key => {
            if (privateModules[key]) {
                const price = pricing.private.modules[key]
                subtotal += price
                moduleRows.push({
                    name: moduleNames[key],
                    quantity: `1 ${t('year')}`,
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
            subtotal += price
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
            subtotal += price
            rows.push({
                name: t('operation.maintenance.times', { times: privateModules.maintenanceYears }),
                quantity: `${privateModules.maintenanceYears} ${t('year.s')}`,
                unit: `${prefix}${pricing.private.modules.operationMaintenance}${t('per.year')}`,
                subtotal: `${prefix}${price}`,
            })
        }
    }

    return {
        rows,
        subtotal: prefix + subtotal.toLocaleString(),
        total: prefix + (subtotal * subscriptionYears).toLocaleString(),
    }
} 