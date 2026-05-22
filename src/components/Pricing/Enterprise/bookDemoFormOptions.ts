import {
  EAssetManagement,
  EIndustry,
  EInterestedFeature,
  EPurchasingRole,
} from '@/utilities/feishu'

export const INDUSTRY_OPTIONS = [
  { value: EIndustry.E_COMMERCE, key: 'eCommerce' },
  { value: EIndustry.CPG, key: 'cpg' },
  { value: EIndustry.BEAUTY, key: 'beauty' },
  { value: EIndustry.FASHION, key: 'fashion' },
  { value: EIndustry.CONSUMER_ELECTRONICS, key: 'consumerElectronics' },
  { value: EIndustry.AI_SMART_DEVICES, key: 'aiSmartDevices' },
  { value: EIndustry.GAMING, key: 'gaming' },
  { value: EIndustry.AUTOMOTIVE, key: 'automotive' },
  { value: EIndustry.FOOD_BEVERAGE, key: 'foodBeverage' },
  { value: EIndustry.HEALTHCARE, key: 'healthcare' },
  { value: EIndustry.FINANCIAL, key: 'financial' },
  { value: EIndustry.MANUFACTURING, key: 'manufacturing' },
  { value: EIndustry.ARCHITECTURE, key: 'architecture' },
  { value: EIndustry.ENERGY, key: 'energy' },
  { value: EIndustry.TRAVEL, key: 'travel' },
  { value: EIndustry.EDUCATION, key: 'education' },
  { value: EIndustry.REAL_ESTATE, key: 'realEstate' },
  { value: EIndustry.TECH_SAAS, key: 'techSaaS' },
  { value: EIndustry.MEDIA, key: 'media' },
  { value: EIndustry.OTHER, key: 'other' },
] as const

export const PURCHASING_ROLE_OPTIONS = [
  { value: EPurchasingRole.RECOMMEND, key: 'recommend' },
  { value: EPurchasingRole.DECIDE, key: 'decide' },
  { value: EPurchasingRole.BROWSING, key: 'browsing' },
] as const

export const ASSET_MANAGEMENT_OPTIONS = [
  { value: EAssetManagement.OTHER_DAM, key: 'otherDam' },
  { value: EAssetManagement.IN_HOUSE, key: 'inHouse' },
  { value: EAssetManagement.CLOUD, key: 'cloud' },
  { value: EAssetManagement.LOCAL, key: 'local' },
  { value: EAssetManagement.NONE, key: 'none' },
  { value: EAssetManagement.OTHER, key: 'other' },
] as const

export const INTERESTED_FEATURE_OPTIONS = [
  { value: EInterestedFeature.AI_SEARCH, key: 'aiSearch' },
  { value: EInterestedFeature.AI_TAGGING, key: 'aiTagging' },
  { value: EInterestedFeature.AI_RECOGNITION, key: 'aiRecognition' },
  { value: EInterestedFeature.AI_GENERATION, key: 'aiGeneration' },
  { value: EInterestedFeature.RBAC, key: 'rbac' },
  { value: EInterestedFeature.COLLABORATION, key: 'collaboration' },
  { value: EInterestedFeature.RANKINGS, key: 'rankings' },
  { value: EInterestedFeature.BRAND_LIBRARY, key: 'brandLibrary' },
  { value: EInterestedFeature.PRODUCT_MANAGEMENT, key: 'productManagement' },
  { value: EInterestedFeature.APPROVAL, key: 'approval' },
  { value: EInterestedFeature.COMPLIANCE, key: 'compliance' },
  { value: EInterestedFeature.COPYRIGHT, key: 'copyright' },
  { value: EInterestedFeature.SOCIAL, key: 'social' },
  { value: EInterestedFeature.PUBLIC_CDN, key: 'publicCdn' },
  { value: EInterestedFeature.BULK_EXPORT, key: 'bulkExport' },
  { value: EInterestedFeature.API, key: 'api' },
  { value: EInterestedFeature.GLOBALIZATION, key: 'globalization' },
] as const
