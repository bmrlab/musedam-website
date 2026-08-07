export enum EBasicConfigKey {
  MEMBER_SEATS = 'memberSeats',
  STORAGE_SPACE = 'storageSpace',
  AI_POINTS = 'aiPoints',
}

/** 业务角色：影响 DAM 定价与 AI 点数赠送额度 */
export type BusinessRole = 'muse' | 'pod'

/** GEA 基础区勾选模块 */
export enum EGeaBaseModules {
  DAM = 'geaDam',
  GEA_CONTEXT = 'geaContext',
  AI_POINTS_PACK = 'geaAiPointsPack',
}

/** 拓展模块归属的基础产品 */
export type ExtensionBaseProduct = 'dam' | 'gea'

/** AI 点数包计价单位：每份 1 万点 */
export const AI_POINTS_PER_PACK = 10000
/** 可选赠送点数；标签、价值和报价份数均由此值派生 */
export const AI_GIFT_POINTS = 50000
export const AI_GIFT_PACKS = AI_GIFT_POINTS / AI_POINTS_PER_PACK
export const AI_POINT_UNIT_PRICE = 0.2
/**
 * 赠送门槛（折后 SaaS 年价）：Pod 20 万；Muse 10 万。
 * Muse 下仅「元数据自定义字段」仍按 20 万计。
 */
export const POD_GIFT_THRESHOLD = 200000
export const MUSE_GIFT_THRESHOLD = 100000

/** AI 点数订阅可选规格：5 万 / 10 万 / 50 万点 */
export const AI_POINTS_OPTIONS = [50000, 100000, 500000] as const
export type AiPointsOption = (typeof AI_POINTS_OPTIONS)[number]
/** 私有化默认勾选 50 万点 */
export const PRIVATE_DEFAULT_AI_POINTS: AiPointsOption = 500000

export enum EAdvancedModules {
  // ① 资产管理与组织
  CUSTOM_SYSTEM_HOMEPAGE = 'customSystemHomepage',
  SMART_FOLDERS = 'smartFolders',
  CUSTOM_METADATA_FIELDS = 'customMetadataFields',
  BRAND_LIBRARY = 'brandLibrary',
  PRODUCT_LIBRARY = 'productLibrary',
  PROJECT_HUB = 'projectHub',
  /** 素材统计分析 */
  ASSET_ANALYTICS = 'assetAnalytics',
  // legacy aliases kept for history quotes
  STANDARD_PROJECT_HUB = 'standardProjectHub',
  ADVANCED_PROJECT_HUB = 'advancedProjectHub',
  ADVANCED_FEATURES = 'advancedFeatures',

  // ② AI 与智能化
  AI_AUTO_TAG = 'aiAutoTag',
  AI_AUTO_TAG_MODULE = 'aiAutoTagModule',
  AI_AUTO_TAG_POINTS = 'aiAutoTagPoints',
  FEATURE_LIBRARY = 'featureLibrary',
  FEATURE_BRAND = 'featureBrand',
  FEATURE_PRODUCT = 'featureProduct',
  FEATURE_PERSON = 'featurePerson',
  FEATURE_IP = 'featureIp',
  AI_FEATURE_RECOGNITION = 'aiFeatureRecognition',
  AI_FEATURE_POINTS = 'aiFeaturePoints',

  // ③ 创意与内容生产
  MUSE_AI = 'museAI',
  MUSE_AI_BASIC = 'museAIBasic',
  MUSE_AI_STANDARD = 'museAIStandard',
  MUSE_AI_ADVANCED = 'museAIAdvanced',
  BATCH_TEMPLATING = 'batchTemplating',
  PROFESSIONAL_PRINT = 'professionalPrint',
  HTML_EXPORT = 'htmlExport',
  MUSE_CUT = 'museCUT',
  CLIPO_REMIX = 'clipoRemix',
  CLIPO_REMIX_BEE = 'clipoRemixBee',
  CLIPO_REMIX_PANDA = 'clipoRemixPanda',
  CLIPO_REMIX_LION = 'clipoRemixLion',
  /** 创意分组标题：智能成片（容器，不计价） */
  SMART_FILM = 'smartFilm',
  /** 创意与内容生产共用 AI 点数包 */
  CREATIVE_AI_POINTS = 'creativeAiPoints',

  // ④ 协作与工作流
  FILE_COLLECTION = 'fileCollection',
  APPROVAL_CENTER = 'approvalCenter',
  DELIVERY_APPROVAL_CENTER = 'deliveryApprovalCenter',
  TASK_WORKFLOW = 'taskWorkflow',
  TASK_WORKFLOW_BASIC = 'taskWorkflowBasic',
  TASK_WORKFLOW_ADVANCED = 'taskWorkflowAdvanced',
  AUTOMATION_CENTER = 'automationCenter',

  // ⑤ 合规与版权
  COMPLIANCE_CHECK = 'complianceCheck',
  REGIONAL_COMPLIANCE = 'regionalCompliance',
  COMPLIANCE_EU = 'complianceEu',
  COMPLIANCE_US = 'complianceUs',
  BRAND_COMPLIANCE_AGENT = 'brandComplianceAgent',
  STORE_INSPECTION_AGENT = 'storeInspectionAgent',
  COPYRIGHT_MANAGEMENT = 'copyrightManagement',
  WATERMARK = 'watermark',

  // ⑥ 分发与交付
  PUBLIC_ASSETS_AND_DERIVATIVES = 'publicAssetsAndDerivatives',
  DAT = 'dat',
  PORTAL = 'portal',
  PORTAL_THEME = 'portalTheme',
  /** 社媒分发分组容器（无价格） */
  SOCIAL_DISTRIBUTION = 'socialDistribution',
  SOCIAL_ARTICLE = 'socialArticle',
  SOCIAL_ATTRIBUTION = 'socialAttribution',
  SOCIAL_CHANNELS = 'socialChannels',
  SOCIAL_ACCOUNT_PACK = 'socialAccountPack',
  ECOM_CHANNELS = 'ecomChannels',
  ECOM_ACCOUNT_PACK = 'ecomAccountPack',
  ECOM_ATTRIBUTION = 'ecomAttribution',

  // ⑦ 集成与基础设施
  NOTION_SYNC = 'notionSync',
  FEISHU_DRIVE = 'feishuDrive',
  FEISHU_BITABLE = 'feishuBitable',
  FEISHU_APPROVAL = 'feishuApproval',
  ENTERPRISE_SSO = 'enterpriseSSO',
  PROFESSIONAL_SERVICES = 'professionalServices',
  CUSTOMER_SERVICE = 'customerService',
  SSO_SAML = 'ssoSaml',
  SSO_FEISHU = 'ssoFeishu',
  SSO_WECOM = 'ssoWecom',
  SSO_DINGTALK = 'ssoDingTalk',
  SSO_Teams = 'ssoTeams',
  SSO_GOOGLE = 'ssoGoogle',
  GA_CONTAINER = 'gaContainer',
  GA = 'GA',
  /** 国内 CDN 流量包 */
  CDN_TRAFFIC = 'cdnTraffic',
  /** CDN/OSS 全球公网加速 */
  CDN_GLOBAL = 'cdnGlobal',
}

export enum EModuleGroupId {
  ASSET_ORG = 'assetOrg',
  AI = 'ai',
  CREATIVE = 'creative',
  COLLAB = 'collab',
  COMPLIANCE = 'compliance',
  DISTRIBUTION = 'distribution',
  INTEGRATION = 'integration',
  SERVICE_SUPPORT = 'serviceSupport',
}

export enum EPrivateModules {
  PRIVATE_IMPLEMENTATION = 'privateImplementation',
  OPERATION_MAINTENANCE = 'operationMaintenance',
}

/** 私有化授权方式 */
export type PrivateLicenseType = 'encrypted' | 'source' | 'perpetual'

/** 私有化云厂商 */
export type PrivateCloudProvider = 'aliyun' | 'aws' | 'tencent' | 'huawei'

/** 版本迭代频次 */
export type PrivateIterationFrequency = 1 | 4

/** MuseAI 互斥版本 */
export const MUSE_AI_VARIANT_KEYS = [
  EAdvancedModules.MUSE_AI_BASIC,
  EAdvancedModules.MUSE_AI_STANDARD,
  EAdvancedModules.MUSE_AI_ADVANCED,
] as const

/** Clipo Remix 互斥版本 */
export const CLIPO_REMIX_VARIANT_KEYS = [
  EAdvancedModules.CLIPO_REMIX_BEE,
  EAdvancedModules.CLIPO_REMIX_PANDA,
  EAdvancedModules.CLIPO_REMIX_LION,
] as const

/** 私有化实施产品（与 SaaS 联动） */
export enum EPrivateImplProducts {
  DAM = 'implDam',
  GEA_CONTEXT = 'implGeaContext',
  MUSE_AI = 'implMuseAI',
  INGEN_OPS = 'implIngenOps',
  CLIPO_REMIX = 'implClipoRemix',
}

export type BillingMode = 'paid' | 'discount' | 'gift'
