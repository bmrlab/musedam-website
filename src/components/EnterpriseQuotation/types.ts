import {
  BillingMode,
  BusinessRole,
  EAdvancedModules,
  EGeaBaseModules,
  EPrivateImplProducts,
  EPrivateModules,
  ExtensionBaseProduct,
  PrivateCloudProvider,
  PrivateIterationFrequency,
  PrivateLicenseType,
} from './enums'

export type {
  BillingMode,
  BusinessRole,
  ExtensionBaseProduct,
  PrivateCloudProvider,
  PrivateIterationFrequency,
  PrivateLicenseType,
}
export {
  EAdvancedModules,
  EGeaBaseModules,
  EPrivateImplProducts,
  EPrivateModules,
} from './enums'

export enum TabEnum {
  BASIC = 'basic',
  /** 企业版 SaaS */
  ADVANCED = 'advanced',
  /** 私有化部署 */
  PRIVATE = 'private',
  /** 定制服务（占位） */
  CUSTOM = 'custom',
}

export interface ICustomerInfo {
  company: string
  contact: string
  email: string
  yourEmail: string
}

/** 成员席位计价方式 */
export type SeatPricingMode = 'bySeat' | 'byTier'

/** 按档位席位档 */
export type SeatTier = 'lte200' | 'lte500' | 'lte1000' | 'unlimited'

export interface IAdvancedInfo {
  memberSeats: number
  /** 席位计价：按席位 / 按档位 */
  seatPricingMode?: SeatPricingMode
  /** 按档位时选中的档位 */
  seatTier?: SeatTier
  storageSpace: number
  /** 启用冷热库 */
  enableColdHotStorage?: boolean
  /** 启用多区域分桶存储 */
  enableMultiRegionStorage?: boolean
  /** 中国热库 TB */
  chinaHotStorage?: number
  /** 中国冷库 TB */
  chinaColdStorage?: number
  /** 海外热库 TB */
  overseasHotStorage?: number
  /** 海外冷库 TB */
  overseasColdStorage?: number
  /** AI 点数订阅份数 */
  aiPoints: number
  /** AI 点数订阅规格（点数/份），可选 5 万 / 10 万 / 50 万 */
  aiPointsOption?: number
  /** GEA 基础：DAM 数字资产管理 */
  geaDam: boolean
  /** GEA+Context 智能体基座 */
  geaContext: boolean
  /** 基础区 AI 点数包份数（1万点/份），固定 5 万点 */
  geaAiPointsPack: number
  /** @deprecated 规格选择已移至 AI 点数订阅（aiPointsOption），点数包固定 5 万点 */
  geaAiPointsOption?: number
}

export interface IPrivateConfig {
  /** 私有化总开关 */
  enabled: boolean
  /** 软件授权费开关 */
  licenseEnabled: boolean
  licenseType: PrivateLicenseType
  /** 产品运营及维护开关 */
  opsEnabled: boolean
  /** 基础维护 */
  basicMaintenance: boolean
  /** 版本迭代 */
  versionIteration: boolean
  iterationFrequency: PrivateIterationFrequency
  /** 私有化部署实施开关 */
  implementationEnabled: boolean
  cloudProvider: PrivateCloudProvider
  /** API 点数费用开关 */
  aiPointsEnabled?: boolean
  /** API 点数规格（点数），可选 5 万 / 10 万 / 50 万 */
  aiPointsOption?: number
  /** API 点数份数 */
  aiPointsQty?: number
  /** @deprecated 兼容历史报价 */
  memberSeats?: number
}

export type CustomServiceRole =
  | 'operations' // legacy
  | 'developer' // legacy → 现作 L1 产品设计师/开发工程师
  | 'architect' // legacy
  | 'algorithm' // legacy
  | 'fde'
  | 'aiEngineer'
  | 'aiConsultant'
  | 'founder'
  /** Pod 客户成功服务人天 */
  | 'csCustom'
  | 'csOnsite'
  | 'csOnsiteTravel'
  | 'custom'

export interface ICustomServiceDetail {
  id: string
  description: string
}

export interface ICustomServiceRoleLine {
  id: string
  /** 角色按细分项时，对应的细分项 */
  detailId?: string
  role: CustomServiceRole
  customRoleName?: string
  quantity: number
}

export interface ICustomService {
  id: string
  name: string
  roleByDetail: boolean
  details: ICustomServiceDetail[]
  roleLines: ICustomServiceRoleLine[]
}

export type IAdvancedModules = Record<EAdvancedModules, boolean | number>

/** @deprecated 兼容历史报价结构 */
export type IPrivateModules = Record<EAdvancedModules | EPrivateModules, boolean> & {
  maintenanceYears: number
}

export type IPrivateImplProducts = Record<EPrivateImplProducts, boolean>

export interface IBasicConfig {
  memberSeats: number
  storageSpace: number
  aiPoints: number
}

export enum EFeatureView {
  OVERVIEW = 'overview',
  DETAIL = 'detail',
}

export type ModuleBillingModes = Partial<Record<EAdvancedModules | EGeaBaseModules, BillingMode>>

/** 版本类子选项（基础版 / 高阶版等） */
export type ModuleVariantSelections = Partial<Record<EAdvancedModules, string>>

/** 渠道 / 特征等多选 */
export type ModuleMultiSelections = Partial<Record<EAdvancedModules, string[]>>

/**
 * 报价单 content 的结构版本：
 * 1 = 无刊例价快照（打开时按当前刊例价重算）；
 * 2 = 含 pricingSnapshot，价格在保存时冻结。
 */
export const QUOTATION_CONTENT_VERSION = 2

/**
 * 报价规则调整日（2026-08-14 00:00 本地时区）：
 * 此前生成的报价单只读，不再提供编辑入口。
 */
export const EDITABLE_SINCE = new Date(2026, 7, 14).getTime()
