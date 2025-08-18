'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react'
import { SessionUser } from '@/types/user'
import { EAdvancedModules, EPrivateModules } from '@/components/EnterpriseQuotation/config'
import {
    TabEnum,
    ICustomerInfo,
    IAdvancedInfo,
    IPrivateConfig,
    IAdvancedModules,
    IPrivateModules,
    IBasicConfig,
    EFeatureView
} from '@/components/EnterpriseQuotation/types'
import { IQuotationInfo } from '@/endpoints/quotation'
import { useCountry } from '../Country'

// 辅助函数：生成 advancedModules 的初始值
const getInitialAdvancedModules = (): IAdvancedModules => {
    const enumValues = Object.values(EAdvancedModules || {}) as EAdvancedModules[]
    return enumValues.reduce((acc, key) => {
        if (key === EAdvancedModules.AI_AUTO_TAG_POINTS) {
            acc[key] = 0
        } else if (key === EAdvancedModules.GA) {
            acc[key] = 0
        } else {
            acc[key as EAdvancedModules] = [EAdvancedModules.ADVANCED_FEATURES, EAdvancedModules.CUSTOMER_SERVICE].includes(key) ? true : false;
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

interface QuotationStoreType {
    // 客户信息
    customerInfo: ICustomerInfo
    setCustomerInfo: (info: ICustomerInfo) => void

    // 当前选中的选项卡
    activeTab: TabEnum
    setActiveTab: (tab: TabEnum) => void

    // Basic 配置
    basicConfig: IBasicConfig
    setBasicConfig: (config: IBasicConfig) => void

    // Advanced 配置
    advancedConfig: IAdvancedInfo
    setAdvancedConfig: (config: IAdvancedInfo) => void
    advancedModules: IAdvancedModules
    setAdvancedModules: React.Dispatch<React.SetStateAction<IAdvancedModules>>

    // Private Deployment 配置
    privateConfig: IPrivateConfig
    setPrivateConfig: (config: IPrivateConfig) => void
    privateModules: IPrivateModules
    setPrivateModules: React.Dispatch<React.SetStateAction<IPrivateModules>>

    // 订阅年限
    subscriptionYears: number
    setSubscriptionYears: (years: number) => void

    // 功能显示选项
    featureView: EFeatureView
    setFeatureView: (view: EFeatureView) => void

    // 折扣
    discount: number | undefined
    setDiscount: React.Dispatch<React.SetStateAction<number | undefined>>

    // 显示未购买功能
    showNoBuyFeature: boolean
    setShowNoBuyFeature: React.Dispatch<React.SetStateAction<boolean>>

    // 初始化用户邮箱
    initializeUserEmail: (user: SessionUser | null) => void

    // 重置所有状态到初始值
    resetToInitial: () => void

    // 编辑ID
    editInfo: IQuotationInfo | undefined
    setEditInfo: React.Dispatch<React.SetStateAction<IQuotationInfo | undefined>>
}

const initialCustomerInfo: ICustomerInfo = {
    company: '',
    contact: '',
    email: '',
    yourEmail: ''
}

const initialBasicConfig: IBasicConfig = {
    memberSeats: 2,
    storageSpace: 1,
    aiPoints: 0
}

const initialPrivateConfig: IPrivateConfig = {
    licenseType: 'saas',
    memberSeats: 30
}

const QuotationStoreContext = createContext<QuotationStoreType | undefined>(undefined)

export const QuotationStoreProvider = ({ children }: { children: ReactNode }) => {
    const { isInChina } = useCountry()

    const initialAdvancedConfig: IAdvancedInfo = useMemo(() => ({
        memberSeats: 10,
        storageSpace: isInChina ? 4 : 3,
        aiPoints: 0
    }), [isInChina])

    // 客户信息
    const [customerInfo, setCustomerInfo] = useState<ICustomerInfo>(initialCustomerInfo)

    // 当前选中的选项卡
    const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.ADVANCED)

    // Basic 配置状态
    const [basicConfig, setBasicConfig] = useState<IBasicConfig>(initialBasicConfig)

    // Advanced 配置状态
    const [advancedConfig, setAdvancedConfig] = useState<IAdvancedInfo>(initialAdvancedConfig)

    // Advanced 模組狀態
    const [advancedModules, setAdvancedModules] = useState<IAdvancedModules>(getInitialAdvancedModules())

    // Private Deployment 配置状态
    const [privateConfig, setPrivateConfig] = useState<IPrivateConfig>(initialPrivateConfig)

    // Private Deployment 模組狀態
    const [privateModules, setPrivateModules] = useState<IPrivateModules>(getInitialPrivateModules())

    // 订阅年限
    const [subscriptionYears, setSubscriptionYears] = useState(1)

    // 折扣
    const [discount, setDiscount] = useState<number | undefined>(undefined)

    // 功能显示选项
    const [featureView, setFeatureView] = useState<EFeatureView>(EFeatureView.OVERVIEW)

    // 显示未购买功能
    const [showNoBuyFeature, setShowNoBuyFeature] = useState(false)

    const [editInfo, setEditInfo] = useState<IQuotationInfo | undefined>()

    // 初始化用户邮箱
    const initializeUserEmail = useCallback((user: SessionUser | null) => {
        if (user?.orgEmail && customerInfo.yourEmail.length === 0) {
            setCustomerInfo(prev => ({
                ...prev,
                yourEmail: user.orgEmail || ''
            }))
        }
    }, [customerInfo.yourEmail.length])

    // 重置所有状态到初始值
    const resetToInitial = useCallback(() => {
        setCustomerInfo(initialCustomerInfo)
        setActiveTab(TabEnum.ADVANCED)
        setBasicConfig(initialBasicConfig)
        setAdvancedConfig(initialAdvancedConfig)
        setAdvancedModules(getInitialAdvancedModules())
        setPrivateConfig(initialPrivateConfig)
        setPrivateModules(getInitialPrivateModules())
        setSubscriptionYears(1)
        setDiscount(undefined)
        setFeatureView(EFeatureView.OVERVIEW)
        setShowNoBuyFeature(false)
        setEditInfo(undefined)
    }, [])

    const value: QuotationStoreType = {
        customerInfo,
        setCustomerInfo,
        activeTab,
        setActiveTab,
        basicConfig,
        setBasicConfig,
        advancedConfig,
        setAdvancedConfig,
        advancedModules,
        setAdvancedModules,
        privateConfig,
        setPrivateConfig,
        privateModules,
        setPrivateModules,
        subscriptionYears,
        setSubscriptionYears,
        featureView,
        setFeatureView,
        discount,
        setDiscount,
        showNoBuyFeature,
        setShowNoBuyFeature,
        initializeUserEmail,
        resetToInitial,
        editInfo,
        setEditInfo
    }

    return (
        <QuotationStoreContext.Provider value={value}>
            {children}
        </QuotationStoreContext.Provider>
    )
}

export const useQuotationStore = (): QuotationStoreType => {
    const context = useContext(QuotationStoreContext)
    if (!context) {
        throw new Error('useQuotationStore must be used within a QuotationStoreProvider')
    }
    return context
} 