// 價格配置
export const pricing = {}



export const usePricing = () => {
    const { t } = useTranslation('quotation')
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'
    const prefix = isGlobal ? '$' : '¥'

    const pricing = {
        basic: isGlobal ? {
            baseCost: 0,
            memberSeatPrice: 300,// 席位年费
            storageSpacePrice: 120,
            aiPointsPrice: 1000
        } : {
            baseCost: 0,
            memberSeatPrice: 1000, // 席位年费
            storageSpacePrice: 600,
            aiPointsPrice: 3600
        },
        advanced: isGlobal ? {
            baseCost: 0,
            memberSeatPrice: 300,
            storageSpacePrice: 1000,
            aiPointsPrice: 1000,
            modules: {
                advancedFeatures: 5000,
                customSystemHomepage: 5000,
                approvalWorkflow: 15000,
                complianceCheck: 15000,
                customMetadataFields: 15000,
                watermark: 2000,
                enterpriseSSO: 1000,
                customerService: 0,
                professionalServices: 15000,
                privateImplementation: 18000,
                operationMaintenance: 5000
            }
        } : {
            baseCost: 0,
            memberSeatPrice: 1000,
            storageSpacePrice: 5000,
            aiPointsPrice: 3600,
            modules: {
                advancedFeatures: 20000,
                customSystemHomepage: 10000,
                approvalWorkflow: 30000,
                complianceCheck: 30000,
                customMetadataFields: 30000,
                watermark: 30000,
                enterpriseSSO: 2000,
                customerService: 0,
                professionalServices: 50000
            }
        },
        private: isGlobal ? {
            saasBaseCost: 9000,
            perpetualBaseCost: 9000,
            memberSeatPrice: 300,
            modules: {
                advancedFeatures: 5000,
                customSystemHomepage: 5000,
                approvalWorkflow: 15000,
                complianceCheck: 15000,
                customMetadataFields: 15000,
                watermark: 2000,
                enterpriseSSO: 1000,
                customerService: 0,
                professionalServices: 15000,
                privateImplementation: 18000,
                operationMaintenance: 5000
            }
        } : {
            saasBaseCost: 9000,
            perpetualBaseCost: 9000,
            memberSeatPrice: 300,
            modules: {
                advancedFeatures: 5000,
                customSystemHomepage: 5000,
                approvalWorkflow: 15000,
                complianceCheck: 15000,
                customMetadataFields: 15000,
                watermark: 2000,
                enterpriseSSO: 1000,
                customerService: 0,
                professionalServices: 15000,
                privateImplementation: 18000,
                operationMaintenance: 5000
            }
        }
    }

    const moduleNames = {
        advancedFeatures: t('module.advancedFeatures'),
        customSystemHomepage: t('module.customSystemHomepage'),
        approvalWorkflow: t('module.approvalWorkflow'),
        complianceCheck: t('module.complianceCheck'),
        customMetadataFields: t('module.customMetadataFields'),
        watermark: t('module.watermark'),
        enterpriseSSO: t('module.enterpriseSSO'),
        customerService: t('module.customerService'),
        professionalServices: t('module.professionalServices'),
        privateImplementation: t('private.implementation'),
        operationMaintenance: t('operation.maintenance')
    }
    return { pricing, moduleNames, prefix }
}

import { useTranslation } from '@/app/i18n/client'
import { formatWithToLocaleString } from '@/utilities/formatPrice'

export const useBasicConfigs = () => {
    const { t } = useTranslation('quotation')
    const { pricing, prefix } = usePricing()
    const basicPricing = pricing['basic']
    return [
        {
            key: 'memberSeats',
            title: t('member.seat'),
            min: 1,
            hint: [t('basic.memberSeats.hint')],
            des: `${prefix}${basicPricing.memberSeatPrice}${t("memberSeats.perYear")}` + ` (${prefix}${Math.ceil(basicPricing.memberSeatPrice / 12)}${t("memberSeats.perMonth")})`
        },
        {
            key: 'storageSpace',
            title: t('storage.space'),
            min: 1,
            hint: [t('basic.storageSpace.hint')],
            des: `${prefix} ${basicPricing.storageSpacePrice}/GB${t("per.year")}` + ` (${prefix}${Math.ceil(basicPricing.storageSpacePrice / 12)}/GB${t("per.year")})`

        },
        {
            key: 'aiPoints',
            title: t('ai.points'),
            min: 0,
            hint: [t('basic.aiPoints.hint1'), t('basic.aiPoints.hint2')],
            des: t('basic.aiPoints.des')
        },
    ]
}

export const useAdvancedConfigs = () => {
    const { t } = useTranslation('quotation')
    const { pricing, prefix } = usePricing()
    const advancedPricing = pricing['advanced']
    return [
        {
            key: 'memberSeats',
            title: t('member.seat'),
            hint: [t('advanced.memberSeats.hint')],
            des: t('advanced.memberSeats.des'),
            min: 1,
            price: pricing['advanced'].memberSeatPrice
        },
        {
            key: 'storageSpace',
            min: 1,
            title: t('storage.space'),
            hint: [t('advanced.storageSpace.hint')],
            des: `${prefix} ${formatWithToLocaleString(advancedPricing.storageSpacePrice)}/TB${t("per.year")}` + ` ( ${prefix} ${Math.ceil(advancedPricing.storageSpacePrice / 12)}/TB${t("per.year")})`
        },
        {
            key: 'aiPoints',
            title: t('ai.points'),
            min: 0,
            hint: [t('advanced.aiPoints.hint1'), t('advanced.aiPoints.hint2')],
            des: t('advanced.aiPoints.des'),
            price: pricing['advanced'].aiPointsPrice
        },
    ]
}
