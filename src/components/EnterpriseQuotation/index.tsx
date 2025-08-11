'use client'
import { LeftContent } from './LeftContent'
import { RightContent } from './RightContent'
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { QuotationPreviewContent } from './Preview/index'
import { SessionUser } from '@/types/user'
import { EAdvancedModules, EPrivateModules } from './config'

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
    aiPoints: number,
}

export interface IPrivateConfig {
    licenseType: 'saas' | 'perpetual'
    memberSeats: number
}

export type IAdvancedModules = Record<EAdvancedModules, boolean | number>

export type IPrivateModules = Record<EAdvancedModules | EPrivateModules, boolean> & {
    maintenanceYears: number
}

export interface IBasicConfig {
    memberSeats: number,
    storageSpace: number,
    aiPoints: number
}
export enum EFeatureView {
    'OVERVIEW' = 'overview',
    'DETAIL' = 'detail'
}

// 辅助函数：生成 advancedModules 的初始值
const getInitialAdvancedModules = (): IAdvancedModules => {
    const enumValues = Object.values(EAdvancedModules || {}) as EAdvancedModules[]
    return enumValues.reduce((acc, key) => {
        if (key === EAdvancedModules.AI_AUTO_TAG_POINTS) {
            acc[key] = 0
        } else if (key === EAdvancedModules.GA) {
            acc[key] = 0
        } else {
            acc[key as EAdvancedModules] = key === EAdvancedModules.ADVANCED_FEATURES ? true : false;
        }
        return acc;
    }, {} as IAdvancedModules);
}

// 辅助函数：生成 privateModules 的初始值
const getInitialPrivateModules = (): IPrivateModules => {
    const allKeys = [
        ...Object.values(EAdvancedModules || {}),
        ...Object.values(EPrivateModules || {}),
    ];
    const modules = allKeys.reduce((acc, key) => {
        acc[key as EAdvancedModules | EPrivateModules] = false;
        return acc;
    }, {} as Record<EAdvancedModules | EPrivateModules, boolean>);

    return {
        ...modules,
        maintenanceYears: 2,
    };
}

interface QuotationContextType {
    customerInfo: ICustomerInfo,
    setCustomerInfo: (info: ICustomerInfo) => void,
    activeTab: TabEnum,
    setActiveTab: (tab: TabEnum) => void,
    advancedConfig: IAdvancedInfo
    setAdvancedConfig: (config: IAdvancedInfo) => void
    advancedModules: IAdvancedModules
    setAdvancedModules: Dispatch<SetStateAction<IAdvancedModules>>
    privateConfig: IPrivateConfig,
    setPrivateConfig: (config: IPrivateConfig) => void,
    privateModules: IPrivateModules,
    setPrivateModules: Dispatch<SetStateAction<IPrivateModules>>
    basicConfig: IBasicConfig,
    setBasicConfig: (config: IBasicConfig) => void,
    subscriptionYears: number,
    setSubscriptionYears: (years: number) => void,
    featureView: EFeatureView,
    discount: number | undefined,
    setDiscount: Dispatch<SetStateAction<number | undefined>>
    setFeatureView: (view: EFeatureView) => void
    showNoBuyFeature: boolean,
    setShowNoBuyFeature: Dispatch<SetStateAction<boolean>>
}

const initialContext: QuotationContextType = {
    customerInfo: {
        company: '',
        contact: '',
        email: '',
        yourEmail: ''
    },
    showNoBuyFeature: false,
    setShowNoBuyFeature: () => void 0,
    discount: undefined,
    setDiscount: () => void 0,
    setCustomerInfo: () => void 0,
    activeTab: TabEnum.ADVANCED,
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
    advancedModules: getInitialAdvancedModules(),
    setAdvancedModules: () => void 0,
    privateConfig: {
        licenseType: 'saas', // 'saas' or 'perpetual'
        memberSeats: 30
    },
    setPrivateConfig: () => void 0,
    privateModules: getInitialPrivateModules(),
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

    const [subscriptionYears, setSubscriptionYears] = useState(1)
    const [discount, setDiscount] = useState<number | undefined>(initialContext.discount)

    // 功能顯示選項
    const [featureView, setFeatureView] = useState(initialContext.featureView)
    const [showNoBuyFeature, setShowNoBuyFeature] = useState(initialContext.showNoBuyFeature)

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
            subscriptionYears,
            setSubscriptionYears,
            featureView,
            setFeatureView,
            discount, setDiscount,
            showNoBuyFeature, setShowNoBuyFeature
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
