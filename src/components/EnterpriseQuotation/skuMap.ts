/**
 * 国内版刊例价 SKU 映射（与产品价格库 CSV 对齐）
 * 前端可不展示，但报价配置 / 明细需保留该值
 */
import { EAdvancedModules, EGeaBaseModules, EBasicConfigKey } from './enums'
import { EPrivateImplProducts } from './enums'

/** 模块 / 基础项 / 变体 / 多选项 → SKU */
export const MODULE_SKU_MAP: Record<string, string> = {
  // 基础
  [EGeaBaseModules.DAM]: 'DAM-CORE',
  [EGeaBaseModules.GEA_CONTEXT]: 'GEA-OS',
  [EGeaBaseModules.AI_POINTS_PACK]: 'CR-50K',
  [EBasicConfigKey.MEMBER_SEATS]: 'SEAT-UNIT',
  [EBasicConfigKey.STORAGE_SPACE]: 'STORAGE-CN-HOT',
  [EBasicConfigKey.AI_POINTS]: 'CR-100K',
  'seat.lte200': 'SEAT-200',
  'seat.lte500': 'SEAT-500',
  'seat.lte1000': 'SEAT-1K',
  'seat.unlimited': 'SEAT-INF',
  coldHotStorage: 'DAM-HOTCOLD',
  coldHotStorageFee: 'DAM-HOTCOLD',
  chinaHotStorage: 'STORAGE-CN-HOT',
  chinaColdStorage: 'STORAGE-CN-COLD',
  chinaStorage: 'STORAGE-CN-HOT',
  overseasHotStorage: 'STORAGE-INTL-HOT',
  overseasColdStorage: 'STORAGE-INTL-COLD',
  overseasStorage: 'STORAGE-INTL-HOT',
  'aiPoints.cr50k': 'CR-50K',
  'aiPoints.cr100k': 'CR-100K',
  'aiPoints.cr500k': 'CR-500K',
  'traffic.cnDl': 'TRAFFIC-CN-DL',
  'traffic.baidu': 'TRAFFIC-BAIDU',
  'service.migrate': 'SVC-MIGRATE',
  privateAiPoints: 'CR-500K',

  // ① 资产管理与组织
  [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: 'DAM-HOME',
  [EAdvancedModules.SMART_FOLDERS]: 'DAM-FOLDER',
  [EAdvancedModules.CUSTOM_METADATA_FIELDS]: 'DAM-META',
  [EAdvancedModules.ASSET_ANALYTICS]: 'DAM-STATS',
  [EAdvancedModules.BRAND_LIBRARY]: 'DAM-BRAND',
  [EAdvancedModules.PRODUCT_LIBRARY]: 'DAM-GOODS',
  [EAdvancedModules.PROJECT_HUB]: 'DAM-PJT',
  [EAdvancedModules.STANDARD_PROJECT_HUB]: 'DAM-PJT',
  [EAdvancedModules.ADVANCED_PROJECT_HUB]: 'DAM-PJT',

  // ② AI 与智能化
  [EAdvancedModules.AI_AUTO_TAG]: 'DAM-TAG',
  [EAdvancedModules.AI_AUTO_TAG_MODULE]: 'DAM-TAG',
  [EAdvancedModules.FEATURE_LIBRARY]: 'DAM-TAG-LOGO', // 父级占位；子项有独立 SKU
  'feature.brand': 'DAM-TAG-LOGO',
  'feature.product': 'DAM-TAG-GOODS',
  'feature.person': 'DAM-TAG-FACE',
  'feature.ip': 'DAM-TAG-IP',
  [EAdvancedModules.AI_FEATURE_RECOGNITION]: 'DAM-FEAT',
  [EAdvancedModules.AI_AUTO_TAG_POINTS]: 'CR-50K',
  [EAdvancedModules.AI_FEATURE_POINTS]: 'CR-50K',
  [EAdvancedModules.CREATIVE_AI_POINTS]: 'CR-50K',

  // ③ 创意与内容生产
  [EAdvancedModules.MUSE_AI_BASIC]: 'MAI-BASE',
  [EAdvancedModules.MUSE_AI_STANDARD]: 'MAI-STD',
  [EAdvancedModules.MUSE_AI_ADVANCED]: 'MAI-PRO',
  [EAdvancedModules.BATCH_TEMPLATING]: 'IGO-BATCH',
  [EAdvancedModules.PROFESSIONAL_PRINT]: 'IGO-PRINT',
  [EAdvancedModules.HTML_EXPORT]: 'IGO-HTML',
  [EAdvancedModules.CLIPO_REMIX_BEE]: 'CLR-BASE',
  [EAdvancedModules.CLIPO_REMIX_PANDA]: 'CLR-STD',
  [EAdvancedModules.CLIPO_REMIX_LION]: 'CLR-PRO',
  [EAdvancedModules.CLIPO_REMIX]: 'CLR-STD',

  // ④ 协作与工作流
  [EAdvancedModules.FILE_COLLECTION]: 'DAM-INBOX',
  [EAdvancedModules.APPROVAL_CENTER]: 'DAM-APPR',
  [EAdvancedModules.DELIVERY_APPROVAL_CENTER]: 'DAM-DLVR',
  [EAdvancedModules.TASK_WORKFLOW]: 'DAM-FLOW-BASE',
  [EAdvancedModules.TASK_WORKFLOW_BASIC]: 'DAM-FLOW-BASE',
  'taskWorkflow.basic': 'DAM-FLOW-BASE',
  'taskWorkflow.advanced': 'DAM-FLOW-PRO',
  [EAdvancedModules.TASK_WORKFLOW_ADVANCED]: 'DAM-FLOW-PRO',
  [EAdvancedModules.AUTOMATION_CENTER]: 'DAM-AUTO',

  // ⑤ 合规与版权
  [EAdvancedModules.COMPLIANCE_CHECK]: 'DAM-COMP',
  [EAdvancedModules.REGIONAL_COMPLIANCE]: 'DAM-COMP-EU', // 父级；子项独立
  'compliance.eu': 'DAM-COMP-EU',
  'compliance.us': 'DAM-COMP-US',
  [EAdvancedModules.BRAND_COMPLIANCE_AGENT]: 'DAM-AGENT-BRAND',
  [EAdvancedModules.STORE_INSPECTION_AGENT]: 'DAM-AGENT-STORE',
  [EAdvancedModules.COPYRIGHT_MANAGEMENT]: 'DAM-RIGHTS',
  [EAdvancedModules.WATERMARK]: 'DAM-WMARK',

  // ⑥ 分发与交付
  [EAdvancedModules.PUBLIC_ASSETS_AND_DERIVATIVES]: 'DAM-SHARE',
  [EAdvancedModules.DAT]: 'DAM-DAT',
  [EAdvancedModules.PORTAL]: 'DAM-PORTAL',
  [EAdvancedModules.PORTAL_THEME]: 'SVC-MANDAY-L1',
  [EAdvancedModules.SOCIAL_ARTICLE]: 'SOCIAL-EDIT',
  [EAdvancedModules.SOCIAL_CHANNELS]: 'SOCIAL-XHS', // 父级；渠道有独立 SKU
  'channel.xiaohongshu': 'SOCIAL-XHS',
  'channel.douyin': 'SOCIAL-DY',
  'channel.wechat': 'SOCIAL-MP',
  'channel.channels': 'SOCIAL-SPH',
  'channel.weibo': 'SOCIAL-WB',
  'channel.youtube': 'SOCIAL-YT',
  'channel.tiktok': 'SOCIAL-TT',
  'channel.facebook': 'SOCIAL-FBPAGE',
  'channel.instagram': 'SOCIAL-IGBIZ',
  'channel.linkedin': 'SOCIAL-LIPROF',
  'channel.linkedinCompany': 'SOCIAL-LIPAGE',
  'channel.twitter': 'SOCIAL-X',
  [EAdvancedModules.SOCIAL_ACCOUNT_PACK]: 'SOCIAL-ACCT-50',
  [EAdvancedModules.SOCIAL_ATTRIBUTION]: 'SOCIAL-ATTR',
  [EAdvancedModules.ECOM_CHANNELS]: 'ECOM-AMZ',
  'ecom.amazon': 'ECOM-AMZ',
  'ecom.lazada': 'ECOM-LAZ',
  'ecom.shopee': 'ECOM-SHOPEE',
  'ecom.tiktokShop': 'ECOM-TTSHOP',
  'ecom.shopify': 'ECOM-SHOPIFY',
  [EAdvancedModules.ECOM_ACCOUNT_PACK]: 'ECOM-ACCT-50',
  [EAdvancedModules.ECOM_ATTRIBUTION]: 'ECOM-ATTR',

  // ⑦ 集成与基础设施
  [EAdvancedModules.NOTION_SYNC]: 'DAM-NOTION',
  [EAdvancedModules.FEISHU_DRIVE]: 'LARK-DRIVE-BASE',
  'feishuDrive.basic': 'LARK-DRIVE-BASE',
  'feishuDrive.advanced': 'LARK-DRIVE-PRO',
  [EAdvancedModules.FEISHU_BITABLE]: 'LARK-BITABLE-1WAY',
  'feishuBitable.oneWay': 'LARK-BITABLE-1WAY',
  'feishuBitable.twoWay': 'LARK-BITABLE-2WAY',
  [EAdvancedModules.FEISHU_APPROVAL]: 'LARK-APPR',
  [EAdvancedModules.SSO_SAML]: 'SSO-SAML',
  [EAdvancedModules.SSO_FEISHU]: 'SSO-LARK',
  [EAdvancedModules.SSO_WECOM]: 'SSO-WECOM',
  [EAdvancedModules.SSO_DINGTALK]: 'SSO-DING',
  [EAdvancedModules.SSO_Teams]: 'SSO-TEAMS',
  [EAdvancedModules.CDN_TRAFFIC]: 'CDN-CN-10TB',
  [EAdvancedModules.CDN_GLOBAL]: 'CDN-INTL-10TB',
  [EAdvancedModules.GA]: 'GA-INTL-10TB',

  // ⑧ 服务与支持
  [EAdvancedModules.CUSTOMER_SERVICE]: 'SVC-TICKET',
  [EAdvancedModules.PROFESSIONAL_SERVICES]: 'SVC-SUPPORT',

  // 私有化实施
  [EPrivateImplProducts.DAM]: 'SVC-DEPLOY-DAM',
  [EPrivateImplProducts.GEA_CONTEXT]: 'SVC-DEPLOY-GEA',
  [EPrivateImplProducts.MUSE_AI]: 'SVC-DEPLOY-MAI',
  [EPrivateImplProducts.INGEN_OPS]: 'SVC-DEPLOY-IGO',
  [EPrivateImplProducts.CLIPO_REMIX]: 'SVC-DEPLOY-CLR',
  'private.ops.basic': 'SVC-OPS',
  'private.ops.iteration.1': 'SVC-UPGRADE-1X',
  'private.ops.iteration.4': 'SVC-UPGRADE-4X',

  // 定制人天
  'custom.role.developer': 'SVC-MANDAY-L1',
  'custom.role.fde': 'SVC-MANDAY-L2',
  'custom.role.aiEngineer': 'SVC-MANDAY-L3',
  'custom.role.aiConsultant': 'SVC-MANDAY-L4',
  'custom.role.founder': 'SVC-MANDAY-L5',
  // Pod 客户成功服务人天
  'custom.role.csCustom': 'OPS-ENT',
  'custom.role.csOnsite': 'OPS-ONS',
  'custom.role.csOnsiteTravel': 'OPS-ONST',
}

export const getModuleSku = (key: string): string | undefined => MODULE_SKU_MAP[key]
