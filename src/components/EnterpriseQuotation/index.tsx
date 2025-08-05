'use client'
import { LeftContent } from './LeftContent'
import { RightContent } from './RightContent'
import { createContext, useContext, useState } from 'react'
import { QuotationPreviewContent } from './Preview'
import { SessionUser } from '@/types/user'

export enum TabEnum {
    BASIC = 'basic',
    ADVANCED = 'advanced',
    PRIVATE = 'private'
}

export interface ICustomerInfo {
    company: string,
    contact: string,
    email: string,
    yourEmail: string
}

export interface IAdvancedInfo {
    memberSeats: number,
    storageSpace: number,
    aiPoints: number
}

export interface IPrivateConfig {
    licenseType: 'saas' | 'perpetual'
    memberSeats: number
}

export interface IAdvancedModules {
    advancedFeatures: boolean,
    customSystemHomepage: boolean,
    approvalWorkflow: boolean,
    complianceCheck: boolean,
    customMetadataFields: boolean,
    watermark: boolean,
    enterpriseSSO: boolean,
    customerService: boolean,
    professionalServices: boolean
}

export type IPrivateModules = {
    privateImplementation: boolean,
    operationMaintenance: boolean,
    maintenanceYears: number
} & IAdvancedModules

export interface IBasicConfig {
    memberSeats: number,
    storageSpace: number,
    aiPoints: number
}
export enum EFeatureView {
    'OVERVIEW' = 'overview',
    'DETAIL' = 'detail'
}
interface QuotationContextType {
    customerInfo: ICustomerInfo,
    setCustomerInfo: (info: ICustomerInfo) => void,
    activeTab: TabEnum,
    setActiveTab: (tab: TabEnum) => void,
    advancedConfig: IAdvancedInfo
    setAdvancedConfig: (config: IAdvancedInfo) => void
    advancedModules: IAdvancedModules
    setAdvancedModules: (modules: IAdvancedModules) => void
    privateConfig: IPrivateConfig,
    setPrivateConfig: (config: IPrivateConfig) => void,
    privateModules: IPrivateModules,
    setPrivateModules: (modules: IPrivateModules) => void,
    basicConfig: IBasicConfig,
    setBasicConfig: (config: IBasicConfig) => void,
    showFeatureList: boolean,
    setShowFeatureList: (val: boolean) => void,
    subscriptionYears: number,
    setSubscriptionYears: (years: number) => void,
    featureView: EFeatureView,
    setFeatureView: (view: EFeatureView) => void
}

const initialContext: QuotationContextType = {
    customerInfo: {
        company: '',
        contact: '',
        email: '',
        yourEmail: ''
    },
    showFeatureList: false,
    setShowFeatureList: () => void 0,
    setCustomerInfo: () => void 0,
    activeTab: TabEnum.BASIC,
    setActiveTab: () => void 0,
    basicConfig: {
        memberSeats: 2,
        storageSpace: 1,
        aiPoints: 0
    },
    setBasicConfig: () => void 0,
    advancedConfig: {
        memberSeats: 15,
        storageSpace: 3,
        aiPoints: 2
    },
    setAdvancedConfig: () => void 0,
    advancedModules: {
        advancedFeatures: false,
        customSystemHomepage: false,
        approvalWorkflow: false,
        complianceCheck: false,
        customMetadataFields: false,
        watermark: false,
        enterpriseSSO: false,
        customerService: false,
        professionalServices: false
    },
    setAdvancedModules: () => void 0,
    privateConfig: {
        licenseType: 'saas', // 'saas' or 'perpetual'
        memberSeats: 30
    },
    setPrivateConfig: () => void 0,

    privateModules: {
        advancedFeatures: false,
        customSystemHomepage: false,
        approvalWorkflow: false,
        complianceCheck: false,
        customMetadataFields: false,
        watermark: false,
        enterpriseSSO: false,
        customerService: false,
        professionalServices: false,
        privateImplementation: false,
        operationMaintenance: false,
        maintenanceYears: 2,
    },
    setPrivateModules: () => void 0,
    subscriptionYears: 1,
    setSubscriptionYears: () => void 0,
    featureView: EFeatureView.OVERVIEW,
    setFeatureView: () => void 0,
}

const QuotationContext = createContext(initialContext)

export default function EnterpriseQuotation({ id, user }: { id?: string, user?: SessionUser | null }) {
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'

    // 當前選中的選項卡
    const [activeTab, setActiveTab] = useState<TabEnum>(initialContext.activeTab)
    // 表單狀態
    const [customerInfo, setCustomerInfo] = useState(initialContext.customerInfo)

    // Basic 配置狀態
    const [basicConfig, setBasicConfig] = useState(initialContext.basicConfig)

    // Advanced 配置狀態
    const [advancedConfig, setAdvancedConfig] = useState(isGlobal ? initialContext.advancedConfig : { memberSeats: 15, storageSpace: 3, aiPoints: 0 })

    // Advanced 模組狀態
    const [advancedModules, setAdvancedModules] = useState(initialContext.advancedModules)

    // Private Deployment 配置狀態
    const [privateConfig, setPrivateConfig] = useState(initialContext.privateConfig)

    // Private Deployment 模組狀態
    const [privateModules, setPrivateModules] = useState(initialContext.privateModules)

    const [showFeatureList, setShowFeatureList] = useState(false)
    const [subscriptionYears, setSubscriptionYears] = useState(1)

    // 功能顯示選項
    const [featureView, setFeatureView] = useState(initialContext.featureView)

    return (
        <QuotationContext.Provider value={{
            customerInfo,
            setCustomerInfo,
            activeTab,
            setActiveTab,
            advancedConfig,
            setAdvancedConfig,
            advancedModules,
            setAdvancedModules,
            privateConfig,
            setPrivateConfig,
            privateModules,
            setPrivateModules,
            basicConfig,
            setBasicConfig,
            showFeatureList,
            setShowFeatureList,
            subscriptionYears,
            setSubscriptionYears,
            featureView,
            setFeatureView
        }}>
            {!!id
                ? <QuotationPreviewContent id={id} userId={user?.userId} orgId={user?.orgId} />
                : (user ?
                    <div className="flex size-full">
                        <div className='h-screen flex-1'>
                            <LeftContent user={user} />
                        </div>
                        <div className='h-screen flex-1'>
                            <RightContent />
                        </div>
                    </div>
                    : <></>
                )

            }
        </QuotationContext.Provider>
    )
}
export const useQuotationContext = (): QuotationContextType => useContext(QuotationContext)
