"use client"

import { useTranslation } from '@/app/i18n/client'
import { usePricing, useBasicConfigs, useAdvancedConfigs, EAdvancedModules, EPrivateModules } from './config'
import { TabEnum } from './types'
import { formatWithToLocaleString } from '@/utilities/formatPrice'
import { useCountry } from '@/providers/Country'
import { useMemo } from 'react'
import { useLanguage } from '@/providers/Language'
import { useQuotationStore } from '@/providers/QuotationStore'
import { isInChina } from '@/utilities/isInChina'

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
    /** 购买的sso内容 */
    hasSSOType: EAdvancedModules[]
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
        discount,
        museAITagOption,
        museCutTagOption,
        mergedToBasicModules
    } = useQuotationStore()
    const { isInChina } = useCountry()
    const { t } = useTranslation('quotation')
    const basicConfigs = useBasicConfigs()
    const advancedConfigs = useAdvancedConfigs()
    const { pricing, moduleNames, prefix, ssoTypeNames, allSSOType } = usePricing()
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
    let hasSSOType: EAdvancedModules[] = []

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
                quantity = `${packageBasic.aiPoints} ${t('ai.AutoTagEngine.unit')}${packageBasic.aiPoints > 1 ? t("ai.AutoTagEngine.unit.s") : ''} \n(${formatWithToLocaleString(100000 * packageBasic.aiPoints)}${t('expansion.points')})`
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

                const realYear = advancedModules[key] ? subscriptionYears : 1
                return {
                    key,
                    name: label,
                    quantity: `${realYear} ${t("year")}${t(realYear > 1 ? "ai.AutoTagEngine.quantity.perYear" : "ai.AutoTagEngine.quantity", { value: language === 'zh-CN' ? pointsNum * 10 : (pointsNum * 10 * 10000).toLocaleString() })}`,
                    unit: `${prefix}${cost.toLocaleString()}${t('per.year')}`,
                    subtotal: cost,
                    isModule: true,
                    des: t('ai.AutoTagEngine.des', { moduleCost: moduleCost.toLocaleString(), pointsNum: pointsNum, prefix: prefix, pointsCost: pointsCost.toLocaleString() }),
                    previewDes: t('ai.AutoTagEngine.previewDes'),
                }
            }
            if (key === EAdvancedModules.MUSE_AI) {
                const pointsNum = Math.max(Number(advancedModules[EAdvancedModules.MUSE_AI]), 1)
                let perPointCost = advancedPricing[EAdvancedModules.MUSE_AI]
                // 根据选择的 tagOption 调整价格
                const moduleConfig = advancedConfigs.find(m => m.key === key)
                if (moduleConfig?.tagOptions) {
                    const selectedOption = moduleConfig.tagOptions.find(opt => opt.value === museAITagOption)
                    if (selectedOption?.priceMultiplier) {
                        perPointCost = perPointCost * selectedOption.priceMultiplier
                    }
                }
                const cost = pointsNum * perPointCost
                const realYear = advancedModules[key] ? subscriptionYears : 1
                // 根据选择的 tagOption 显示对应的点数
                const selectedOption = moduleConfig?.tagOptions?.find(opt => opt.value === museAITagOption)
                const pointsDisplay = selectedOption ? parseInt(selectedOption.value) / 10000 : pointsNum * 50
                return {
                    key,
                    name: label,
                    quantity: `${realYear} ${t("year")}${t(realYear > 1 ? "ai.AutoTagEngine.quantity.perYear" : "ai.AutoTagEngine.quantity",
                        { value: language === 'zh-CN' ? pointsDisplay : (pointsDisplay * 10000).toLocaleString() })}`,
                    unit: `${prefix}${cost.toLocaleString()}${t('per.year')}`,
                    subtotal: cost,
                    isModule: true,
                    des: t('ai.museAI.des', { pointsNum: pointsNum, prefix: prefix, pointsCost: cost.toLocaleString() }),
                    previewDes: t('ai.museAI.previewDes'),
                }
            }

            if (key === EAdvancedModules.MUSE_CUT) {
                const pointsNum = Math.max(Number(advancedModules[EAdvancedModules.MUSE_CUT]), 1)
                let perPointCost = advancedPricing[EAdvancedModules.MUSE_CUT]
                // 根据选择的 tagOption 调整价格
                const moduleConfig = advancedConfigs.find(m => m.key === key)
                if (moduleConfig?.tagOptions) {
                    const selectedOption = moduleConfig.tagOptions.find(opt => opt.value === museCutTagOption)
                    if (selectedOption?.priceMultiplier) {
                        perPointCost = perPointCost * selectedOption.priceMultiplier
                    }
                }
                const cost = pointsNum * perPointCost
                const realYear = advancedModules[key] ? subscriptionYears : 1
                // 根据选择的 tagOption 显示对应的点数
                const selectedOption = moduleConfig?.tagOptions?.find(opt => opt.value === museCutTagOption)
                const pointsDisplay = selectedOption ? parseInt(selectedOption.value) / 10000 : pointsNum * 50
                return {
                    key,
                    name: label,
                    quantity: `${realYear} ${t("year")}${t(realYear > 1 ? "ai.AutoTagEngine.quantity.perYear" : "ai.AutoTagEngine.quantity",
                        { value: language === 'zh-CN' ? pointsDisplay : (pointsDisplay * 10000).toLocaleString() })}`,
                    unit: `${prefix}${cost.toLocaleString()}${t('per.year')}`,
                    subtotal: cost,
                    isModule: true,
                    des: t('ai.museCut.des', { pointsNum: pointsNum, prefix: prefix, pointsCost: cost.toLocaleString() }),
                    previewDes: t('ai.museCut.previewDes'),
                }
            }

            if (key === EAdvancedModules.ENTERPRISE_SSO) {
                hasSSOType = allSSOType.filter((v) => !!advancedModules[v])
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

        // 分离合并到基础报价的模块和普通模块
        const mergedModules = filterModules.filter((v) => v.key && mergedToBasicModules.has(v.key))
        // 普通模块：只排除被合并的父级模块
        // 注意：moduleRows 中只包含父级模块，子模块不会单独出现在这里
        const normalModules = filterModules.filter((v) => {
            if (!v.key) return true
            // 只排除被合并的父级模块
            return !mergedToBasicModules.has(v.key)
        })

        // 计算合并到基础报价的模块总价格（按年计算）
        // 注意：父级模块的价格已经包含了子模块的价格（如 AI_AUTO_TAG 包含子模块，ENTERPRISE_SSO 的价格基于选中的子模块）
        let mergedCostPerYear = 0
        if (mergedModules.length > 0) {
            mergedCostPerYear = mergedModules.reduce((total, module) => {
                // 父级模块的价格（已经包含子模块价格）
                const moduleCost = typeof module.subtotal === 'number' ? module.subtotal : 0
                return total + moduleCost
            }, 0)
            // basicCostPerYear += mergedCostPerYear
        }

        // 将合并模块的价格加到"Enterprise Features"这一行
        if (mergedCostPerYear > 0) {
            const enterpriseFeaturesIndex = normalModules.findIndex(m => m.key === EAdvancedModules.ADVANCED_FEATURES)
            if (enterpriseFeaturesIndex !== -1) {
                const enterpriseFeatures = normalModules[enterpriseFeaturesIndex]
                const originalCost = typeof enterpriseFeatures.subtotal === 'number' ? enterpriseFeatures.subtotal : 0
                const newCost = originalCost + mergedCostPerYear
                // 更新 Enterprise Features 的价格
                normalModules[enterpriseFeaturesIndex] = {
                    ...enterpriseFeatures,
                    subtotal: newCost,
                    unit: `${prefix}${newCost.toLocaleString()}${t('per.year')}`,
                }
            }
        }

        // 显示企业模块：按照原始顺序显示，合并模块不显示价格
        if (filterModules.length > 0) {
            rows.push({
                name: t('advanced.modules.title'),
                quantity: '',
                unit: '',
                subtotal: '',
                isSection: true,
                bold: true
            })

            // 创建普通模块的 Map，方便按 key 查找（价格已更新）
            const normalModulesMap = new Map(normalModules.map(m => [m.key, m]))
            // 创建合并模块的 Set，方便快速判断
            const mergedModulesSet = new Set(mergedModules.map(m => m.key))

            // 按照 filterModules 的原始顺序遍历显示
            filterModules.forEach(module => {
                if (module.key && mergedModulesSet.has(module.key)) {
                    // 合并模块：不显示价格
                    rows.push({
                        ...module,
                        unit: undefined,
                        subtotal: undefined,
                    })
                } else {
                    // 普通模块：从 normalModulesMap 中取（价格已更新）
                    const normalModule = normalModulesMap.get(module.key)
                    if (normalModule) {
                        rows.push(normalModule)
                    }
                }
            })
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
        // 如果模块已合并到基础报价，不计入高级模块价格
        // if (mergedToBasicModules.has(key as EAdvancedModules)) {
        //     return total
        // }
        const value = advancedModules[key];
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
        return total + price * (typeof value === 'number' ? value : 1)
    }, 0), [advancedModules, advancedPricing, advancedConfigs, museAITagOption, museCutTagOption])

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
        totalNumPerYear: totalPerYear,
        hasSSOType: hasSSOType
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
            value: `${isInChina ? '¥20,000' : '$4,000'}${t('per.year')}\n /100,000` + t('expansion.points'),
            unit: (isInChina ? '¥20,000' : '$4,000') + '/' + t("ai.AutoTagEngine.unit"),
            quantity: `1 ${t('year')}\n${t("ai.AutoTagEngine.quantity", { value: language === 'zh-CN' ? 10 : (100000).toLocaleString() })}`
        },

        {
            name: t('expansion.downloadData'),
            description: t('expansion.downloadData.desc'),
            value: isInChina ? '¥150/TB' : '$30/TB',
            unit: (isInChina ? '¥150' : '$30') + '/' + t('ai.AutoTagEngine.unit'),
            quantity: `1 ${t('ai.AutoTagEngine.unit')}${t('expand.download.quantity', { value: '1TB' })}`
        },
        {
            name: t('expansion.CDN'),
            description: t('expansion.CDN.desc'),
            value: (isInChina ? '¥600/TB' : '$120/TB'),
            unit: (isInChina ? '¥600' : '$120') + '/TB',
            quantity: `1TB${t('expand.download.quantity', { value: '1TB' })}`
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