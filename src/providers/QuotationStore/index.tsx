'use client'

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from 'react'
import { SessionUser } from '@/types/user'
import {
  BillingMode,
  BusinessRole,
  EAdvancedModules,
  EGeaBaseModules,
  EPrivateImplProducts,
  EPrivateModules,
} from '@/components/EnterpriseQuotation/enums'
import {
  TabEnum,
  ICustomerInfo,
  IAdvancedInfo,
  IPrivateConfig,
  IAdvancedModules,
  IPrivateModules,
  IPrivateImplProducts,
  IBasicConfig,
  EFeatureView,
  ModuleBillingModes,
  ModuleVariantSelections,
  ModuleMultiSelections,
  ICustomService,
} from '@/components/EnterpriseQuotation/types'
import { IQuotationInfo } from '@/endpoints/quotation'
import { useCountry } from '../Country'

const NUMERIC_MODULE_DEFAULTS: Partial<Record<EAdvancedModules, number>> = {
  [EAdvancedModules.PORTAL_THEME]: 0,
  [EAdvancedModules.SOCIAL_ACCOUNT_PACK]: 0,
  [EAdvancedModules.ECOM_ACCOUNT_PACK]: 0,
  [EAdvancedModules.GA]: 0,
  [EAdvancedModules.CDN_TRAFFIC]: 0,
  [EAdvancedModules.CDN_GLOBAL]: 0,
  [EAdvancedModules.MUSE_CUT]: 0,
}

const getInitialAdvancedModules = (): IAdvancedModules => {
  const enumValues = Object.values(EAdvancedModules) as EAdvancedModules[]
  return enumValues.reduce((acc, key) => {
    if (NUMERIC_MODULE_DEFAULTS[key] !== undefined) {
      acc[key] = NUMERIC_MODULE_DEFAULTS[key]!
    } else {
      acc[key] = [EAdvancedModules.CUSTOMER_SERVICE].includes(key)
    }
    return acc
  }, {} as IAdvancedModules)
}

const getInitialPrivateModules = (): IPrivateModules => {
  const allKeys = [...Object.values(EAdvancedModules), ...Object.values(EPrivateModules)]
  const modules = allKeys.reduce(
    (acc, key) => {
      acc[key as EAdvancedModules | EPrivateModules] = false
      return acc
    },
    {} as Record<EAdvancedModules | EPrivateModules, boolean>,
  )

  return {
    ...modules,
    maintenanceYears: 2,
  }
}

const getInitialPrivateImplProducts = (): IPrivateImplProducts => ({
  [EPrivateImplProducts.DAM]: false,
  [EPrivateImplProducts.GEA_CONTEXT]: false,
  [EPrivateImplProducts.MUSE_AI]: false,
  [EPrivateImplProducts.INGEN_OPS]: false,
  [EPrivateImplProducts.CLIPO_REMIX]: false,
})

interface QuotationStoreType {
  customerInfo: ICustomerInfo
  setCustomerInfo: (info: ICustomerInfo) => void

  activeTab: TabEnum
  setActiveTab: (tab: TabEnum) => void

  /** 业务角色：Pod / Muse */
  businessRole: BusinessRole
  setBusinessRole: (role: BusinessRole) => void

  basicConfig: IBasicConfig
  setBasicConfig: (config: IBasicConfig) => void

  advancedConfig: IAdvancedInfo
  setAdvancedConfig: (config: IAdvancedInfo) => void
  advancedModules: IAdvancedModules
  setAdvancedModules: React.Dispatch<React.SetStateAction<IAdvancedModules>>

  privateConfig: IPrivateConfig
  setPrivateConfig: (config: IPrivateConfig) => void
  privateModules: IPrivateModules
  setPrivateModules: React.Dispatch<React.SetStateAction<IPrivateModules>>
  privateImplProducts: IPrivateImplProducts
  setPrivateImplProducts: React.Dispatch<React.SetStateAction<IPrivateImplProducts>>

  customServices: ICustomService[]
  setCustomServices: React.Dispatch<React.SetStateAction<ICustomService[]>>

  subscriptionYears: number
  setSubscriptionYears: (years: number) => void

  featureView: EFeatureView
  setFeatureView: (view: EFeatureView) => void

  discount: number | undefined
  setDiscount: React.Dispatch<React.SetStateAction<number | undefined>>

  showNoBuyFeature: boolean
  setShowNoBuyFeature: React.Dispatch<React.SetStateAction<boolean>>

  initializeUserEmail: (user: SessionUser | null) => void
  resetToInitial: () => void

  editInfo: IQuotationInfo | undefined
  setEditInfo: React.Dispatch<React.SetStateAction<IQuotationInfo | undefined>>

  museAITagOption: string
  setMuseAITagOption: (value: string) => void
  museCutTagOption: string
  setMuseCutTagOption: (value: string) => void
  gaTagOption: string
  setGaTagOption: (value: string) => void
  cdnTagOption: string
  setCdnTagOption: (value: string) => void

  /** @deprecated 保留兼容历史报价 */
  mergedToBasicModules: Set<EAdvancedModules>
  setMergedToBasicModules: React.Dispatch<React.SetStateAction<Set<EAdvancedModules>>>
  toggleMergeToBasic: (module: EAdvancedModules) => void

  advancedModulePriceOverrides: Partial<Record<EAdvancedModules | EGeaBaseModules, number>>
  setAdvancedModulePriceOverride: (
    module: EAdvancedModules | EGeaBaseModules,
    price?: number,
  ) => void
  setAdvancedModulePriceOverrides: React.Dispatch<
    React.SetStateAction<Partial<Record<EAdvancedModules | EGeaBaseModules, number>>>
  >

  moduleBillingModes: ModuleBillingModes
  setModuleBillingMode: (module: EAdvancedModules | EGeaBaseModules, mode: BillingMode) => void
  setModuleBillingModes: React.Dispatch<React.SetStateAction<ModuleBillingModes>>

  moduleVariants: ModuleVariantSelections
  setModuleVariant: (module: EAdvancedModules, value: string) => void
  setModuleVariants: React.Dispatch<React.SetStateAction<ModuleVariantSelections>>

  moduleMultiSelections: ModuleMultiSelections
  setModuleMultiSelection: (module: EAdvancedModules, values: string[]) => void
  setModuleMultiSelections: React.Dispatch<React.SetStateAction<ModuleMultiSelections>>
}

const initialCustomerInfo: ICustomerInfo = {
  company: '',
  contact: '',
  email: '',
  yourEmail: '',
}

const initialBasicConfig: IBasicConfig = {
  memberSeats: 2,
  storageSpace: 1,
  aiPoints: 0,
}

const initialPrivateConfig: IPrivateConfig = {
  enabled: false,
  licenseEnabled: true,
  licenseType: 'encrypted',
  opsEnabled: true,
  basicMaintenance: true,
  versionIteration: true,
  iterationFrequency: 1,
  implementationEnabled: true,
  cloudProvider: 'aliyun',
}

const initialCustomServices: ICustomService[] = [
  {
    id: 'custom-service-1',
    name: '',
    roleByDetail: false,
    details: [{ id: 'custom-detail-1', description: '' }],
    roleLines: [
      {
        id: 'custom-role-1',
        role: 'developer',
        quantity: 1,
      },
    ],
  },
]

const QuotationStoreContext = createContext<QuotationStoreType | undefined>(undefined)

export const QuotationStoreProvider = ({ children }: { children: ReactNode }) => {
  const { isInChina } = useCountry()

  const initialAdvancedConfig: IAdvancedInfo = useMemo(
    () => ({
      memberSeats: isInChina ? 10 : 10,
      seatPricingMode: 'bySeat',
      seatTier: 'lte200',
      storageSpace: 2,
      enableColdHotStorage: false,
      enableMultiRegionStorage: false,
      chinaHotStorage: 1,
      chinaColdStorage: 1,
      overseasHotStorage: 1,
      overseasColdStorage: 1,
      aiPoints: 0,
      geaDam: true,
      geaContext: false,
      geaAiPointsPack: 0,
    }),
    [isInChina],
  )

  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo>(initialCustomerInfo)
  const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.ADVANCED)
  const [businessRole, setBusinessRole] = useState<BusinessRole>('pod')
  const [basicConfig, setBasicConfig] = useState<IBasicConfig>(initialBasicConfig)
  const [advancedConfig, setAdvancedConfig] = useState<IAdvancedInfo>(initialAdvancedConfig)
  const [advancedModules, setAdvancedModules] = useState<IAdvancedModules>(getInitialAdvancedModules())
  const [privateConfig, setPrivateConfig] = useState<IPrivateConfig>(initialPrivateConfig)
  const [privateModules, setPrivateModules] = useState<IPrivateModules>(getInitialPrivateModules())
  const [privateImplProducts, setPrivateImplProducts] = useState<IPrivateImplProducts>(
    getInitialPrivateImplProducts(),
  )
  const [customServices, setCustomServices] = useState<ICustomService[]>(initialCustomServices)
  const [subscriptionYears, setSubscriptionYears] = useState(1)
  const [discount, setDiscount] = useState<number | undefined>(undefined)
  const [featureView, setFeatureView] = useState<EFeatureView>(EFeatureView.OVERVIEW)
  const [showNoBuyFeature, setShowNoBuyFeature] = useState(false)
  const [editInfo, setEditInfo] = useState<IQuotationInfo | undefined>()
  const [museAITagOption, setMuseAITagOption] = useState<string>('500000')
  const [museCutTagOption, setMuseCutTagOption] = useState<string>('500000')
  const [gaTagOption, setGaTagOption] = useState<string>('10TB')
  const [cdnTagOption, setCdnTagOption] = useState<string>('10TB')
  const [mergedToBasicModules, setMergedToBasicModules] = useState<Set<EAdvancedModules>>(new Set())
  const [advancedModulePriceOverrides, setAdvancedModulePriceOverrides] = useState<
    Partial<Record<EAdvancedModules | EGeaBaseModules, number>>
  >({})
  const [moduleBillingModes, setModuleBillingModes] = useState<ModuleBillingModes>({})
  const [moduleVariants, setModuleVariants] = useState<ModuleVariantSelections>({
    [EAdvancedModules.MUSE_AI]: 'basic',
    [EAdvancedModules.TASK_WORKFLOW]: 'basic',
    [EAdvancedModules.FEISHU_DRIVE]: 'basic',
    [EAdvancedModules.FEISHU_BITABLE]: 'oneWay',
  })
  const [moduleMultiSelections, setModuleMultiSelections] = useState<ModuleMultiSelections>({})

  const toggleMergeToBasic = useCallback((module: EAdvancedModules) => {
    setMergedToBasicModules((prev) => {
      const next = new Set(prev)
      if (next.has(module)) next.delete(module)
      else next.add(module)
      return next
    })
  }, [])

  const setAdvancedModulePriceOverride = useCallback(
    (module: EAdvancedModules | EGeaBaseModules, price?: number) => {
      setAdvancedModulePriceOverrides((prev) => {
        const next = { ...prev }
        if (typeof price === 'number') next[module] = price
        else delete next[module]
        return next
      })
    },
    [],
  )

  const setModuleBillingMode = useCallback(
    (module: EAdvancedModules | EGeaBaseModules, mode: BillingMode) => {
      setModuleBillingModes((prev) => ({ ...prev, [module]: mode }))
    },
    [],
  )

  const setModuleVariant = useCallback((module: EAdvancedModules, value: string) => {
    setModuleVariants((prev) => ({ ...prev, [module]: value }))
  }, [])

  const setModuleMultiSelection = useCallback((module: EAdvancedModules, values: string[]) => {
    setModuleMultiSelections((prev) => ({ ...prev, [module]: values }))
  }, [])

  const initializeUserEmail = useCallback(
    (user: SessionUser | null) => {
      if (user?.orgEmail && customerInfo.yourEmail.length === 0) {
        setCustomerInfo((prev) => ({
          ...prev,
          yourEmail: user.orgEmail || '',
        }))
      }
    },
    [customerInfo.yourEmail.length],
  )

  const resetToInitial = useCallback(() => {
    setCustomerInfo(initialCustomerInfo)
    setActiveTab(TabEnum.ADVANCED)
    setBusinessRole('muse')
    setBasicConfig(initialBasicConfig)
    setAdvancedConfig(initialAdvancedConfig)
    setAdvancedModules(getInitialAdvancedModules())
    setPrivateConfig(initialPrivateConfig)
    setPrivateModules(getInitialPrivateModules())
    setPrivateImplProducts(getInitialPrivateImplProducts())
    setCustomServices(initialCustomServices)
    setSubscriptionYears(1)
    setDiscount(undefined)
    setFeatureView(EFeatureView.OVERVIEW)
    setShowNoBuyFeature(false)
    setEditInfo(undefined)
    setMuseAITagOption('500000')
    setMuseCutTagOption('500000')
    setGaTagOption('10TB')
    setCdnTagOption('10TB')
    setMergedToBasicModules(new Set())
    setAdvancedModulePriceOverrides({})
    setModuleBillingModes({})
    setModuleVariants({
      [EAdvancedModules.MUSE_AI]: 'basic',
      [EAdvancedModules.TASK_WORKFLOW]: 'basic',
      [EAdvancedModules.FEISHU_DRIVE]: 'basic',
      [EAdvancedModules.FEISHU_BITABLE]: 'oneWay',
    })
    setModuleMultiSelections({})
  }, [initialAdvancedConfig])

  const value: QuotationStoreType = {
    customerInfo,
    setCustomerInfo,
    activeTab,
    setActiveTab,
    businessRole,
    setBusinessRole,
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
    privateImplProducts,
    setPrivateImplProducts,
    customServices,
    setCustomServices,
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
    setEditInfo,
    museAITagOption,
    setMuseAITagOption,
    museCutTagOption,
    setMuseCutTagOption,
    gaTagOption,
    setGaTagOption,
    cdnTagOption,
    setCdnTagOption,
    mergedToBasicModules,
    setMergedToBasicModules,
    toggleMergeToBasic,
    advancedModulePriceOverrides,
    setAdvancedModulePriceOverride,
    setAdvancedModulePriceOverrides,
    moduleBillingModes,
    setModuleBillingMode,
    setModuleBillingModes,
    moduleVariants,
    setModuleVariant,
    setModuleVariants,
    moduleMultiSelections,
    setModuleMultiSelection,
    setModuleMultiSelections,
  }

  return (
    <QuotationStoreContext.Provider value={value}>{children}</QuotationStoreContext.Provider>
  )
}

export const useQuotationStore = (): QuotationStoreType => {
  const context = useContext(QuotationStoreContext)
  if (!context) {
    throw new Error('useQuotationStore must be used within a QuotationStoreProvider')
  }
  return context
}
