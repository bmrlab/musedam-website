import { env } from 'process'
import axios from 'axios'
import { match } from 'ts-pattern'
import { z } from 'zod'

export enum EOrgSize {
  TEN = 1, //"2~10人"
  FIFTY, //"11-50人"
  TWO_HUNDRED, //"51-200人"
  FIVE_HUNDRED, //"201-500人"
  ONE_THOUSAND, //"501-1000人"
  MORE_THOUSAND, // "大于1000人"
}

export enum EExpectTime {
  ONE_MONTH = 1,
  THREE_MONTH,
  SIX_MONTH,
  ONE_YEAR,
  NOT_SURE,
}

export enum EIndustry {
  E_COMMERCE = 1,
  CPG,
  BEAUTY,
  FASHION,
  CONSUMER_ELECTRONICS,
  AI_SMART_DEVICES,
  GAMING,
  AUTOMOTIVE,
  FOOD_BEVERAGE,
  HEALTHCARE,
  FINANCIAL,
  MANUFACTURING,
  ARCHITECTURE,
  ENERGY,
  TRAVEL,
  EDUCATION,
  REAL_ESTATE,
  TECH_SAAS,
  MEDIA,
  OTHER,
}

export enum EPurchasingRole {
  RECOMMEND = 1,
  DECIDE,
  BROWSING,
}

export enum EAssetManagement {
  OTHER_DAM = 1,
  IN_HOUSE,
  CLOUD,
  LOCAL,
  NONE,
  OTHER,
}

export enum EInterestedFeature {
  AI_SEARCH = 1,
  AI_TAGGING,
  AI_RECOGNITION,
  AI_GENERATION,
  RBAC,
  COLLABORATION,
  RANKINGS,
  BRAND_LIBRARY,
  PRODUCT_MANAGEMENT,
  APPROVAL,
  COMPLIANCE,
  COPYRIGHT,
  SOCIAL,
  PUBLIC_CDN,
  BULK_EXPORT,
  API,
  GLOBALIZATION,
}

export const emailSchema = z.string().email()

export function isValidEmail(value: string): boolean {
  return emailSchema.safeParse(value).success
}

export const bookDemoFormSchema = z.object({
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  name: z.string().max(50).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  position: z.string().max(200).optional().nullable(),
  wechat: z.string().max(400).optional().nullable(),
  companyEmail: z.string().max(200).optional().nullable(),
  teamSize: z.nativeEnum(EOrgSize).transform((value) => Number(value)),
  expectTime: z.nativeEnum(EExpectTime).transform((value) => Number(value)),
  industry: z.nativeEnum(EIndustry).transform((value) => Number(value)),
  purchasingRole: z.nativeEnum(EPurchasingRole).transform((value) => Number(value)),
  assetManagement: z
    .array(z.nativeEnum(EAssetManagement))
    .min(1)
    .transform((values) => values.map((v) => Number(v))),
  interestedFeatures: z
    .array(z.nativeEnum(EInterestedFeature))
    .min(1)
    .transform((values) => values.map((v) => Number(v))),
  entrance: z.string().optional().nullable(),
})

type FormData = z.infer<typeof bookDemoFormSchema>

const _industryToZh = (value: EIndustry) =>
  match(value)
    .with(EIndustry.E_COMMERCE, () => '电商与零售')
    .with(EIndustry.CPG, () => '快消品')
    .with(EIndustry.BEAUTY, () => '美妆与个护')
    .with(EIndustry.FASHION, () => '鞋服与时尚')
    .with(EIndustry.CONSUMER_ELECTRONICS, () => '3C 电子与消费科技')
    .with(EIndustry.AI_SMART_DEVICES, () => 'AI 智能硬件')
    .with(EIndustry.GAMING, () => '游戏与互动娱乐')
    .with(EIndustry.AUTOMOTIVE, () => '汽车与出行')
    .with(EIndustry.FOOD_BEVERAGE, () => '食品与饮料')
    .with(EIndustry.HEALTHCARE, () => '医疗与健康')
    .with(EIndustry.FINANCIAL, () => '金融与保险')
    .with(EIndustry.MANUFACTURING, () => '制造业')
    .with(EIndustry.ARCHITECTURE, () => '建筑 / 室内设计')
    .with(EIndustry.ENERGY, () => '能源与化工')
    .with(EIndustry.TRAVEL, () => '旅游与酒店')
    .with(EIndustry.EDUCATION, () => '学校与教育')
    .with(EIndustry.REAL_ESTATE, () => '房地产')
    .with(EIndustry.TECH_SAAS, () => '科技与 SaaS')
    .with(EIndustry.MEDIA, () => '媒体与广告')
    .with(EIndustry.OTHER, () => '其他')
    .otherwise(() => String(value))

const _purchasingRoleToZh = (value: EPurchasingRole) =>
  match(value)
    .with(EPurchasingRole.RECOMMEND, () => '采购建议权')
    .with(EPurchasingRole.DECIDE, () => '采购决定权')
    .with(EPurchasingRole.BROWSING, () => '以上均不是，只是了解一下')
    .otherwise(() => String(value))

const _assetManagementToZh = (value: EAssetManagement) =>
  match(value)
    .with(EAssetManagement.OTHER_DAM, () => '其他 DAM 系统')
    .with(EAssetManagement.IN_HOUSE, () => '企业自建系统')
    .with(EAssetManagement.CLOUD, () => '云盘 / 网盘')
    .with(EAssetManagement.LOCAL, () => '本地文件夹 / NAS / 硬盘')
    .with(EAssetManagement.NONE, () => '暂无统一管理')
    .with(EAssetManagement.OTHER, () => '其他')
    .otherwise(() => String(value))

const _interestedFeatureToZh = (value: EInterestedFeature) =>
  match(value)
    .with(EInterestedFeature.AI_SEARCH, () => 'AI 智能搜索与问答')
    .with(EInterestedFeature.AI_TAGGING, () => 'AI 智能打标与解析')
    .with(EInterestedFeature.AI_RECOGNITION, () => 'AI 智能识别（商品、IP、人物、Logo）')
    .with(EInterestedFeature.AI_GENERATION, () => 'AI 图片/视频生产')
    .with(EInterestedFeature.RBAC, () => '多层级权限管控')
    .with(EInterestedFeature.COLLABORATION, () => '协作、订阅与分享')
    .with(EInterestedFeature.RANKINGS, () => '活跃资产、用户排行榜')
    .with(EInterestedFeature.BRAND_LIBRARY, () => '品牌库管理')
    .with(EInterestedFeature.PRODUCT_MANAGEMENT, () => '商品管理')
    .with(EInterestedFeature.APPROVAL, () => '审批中心')
    .with(EInterestedFeature.COMPLIANCE, () => '品牌合规检测')
    .with(EInterestedFeature.COPYRIGHT, () => '品牌版权管理')
    .with(EInterestedFeature.SOCIAL, () => '社媒平台分发')
    .with(EInterestedFeature.PUBLIC_CDN, () => '公开资产链接与 CDN 加速')
    .with(EInterestedFeature.BULK_EXPORT, () => '批量导出材料规格清单')
    .with(EInterestedFeature.API, () => 'API 与系统集成')
    .with(EInterestedFeature.GLOBALIZATION, () => '全球化与多语言')
    .otherwise(() => String(value))

const _getFeishuAuth = () => {
  return axios.post<{
    code: number
    expire: number
    msg: string
    tenant_access_token: string
  }>('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: env.MUSE_FEISHU_APP_ID,
    app_secret: env.MUSE_FEISHU_APP_SECRET,
  })
}

function _teamFormToFields(data: z.infer<typeof bookDemoFormSchema>): Record<string, any> {
  const result: Record<string, any> = {}
  result['来源'] = process.env.DEPLOY_REGION === 'global' ? '国外版' : '国内版'
  result['姓名'] = data.name
  result['邮箱'] = data.email
  result['手机号'] = data.phone
  result['公司全称'] = data.company
  result['职位'] = data.position
  result['微信号'] = data.wechat
  result['企业邮箱'] = data.companyEmail
  result['留资入口'] = data.entrance

  result['团队规模'] = match(data.teamSize)
    .with(EOrgSize.TEN, () => '2-10')
    .with(EOrgSize.FIFTY, () => '11-30')
    .with(EOrgSize.TWO_HUNDRED, () => '31-100')
    .with(EOrgSize.FIVE_HUNDRED, () => '101-300')
    .with(EOrgSize.ONE_THOUSAND, () => '301-1,000')
    .with(EOrgSize.MORE_THOUSAND, () => '1,000+')
    .otherwise(() => data.teamSize)
  result['预计采购时间'] = match(data.expectTime)
    .with(EExpectTime.ONE_MONTH, () => '一个月内')
    .with(EExpectTime.THREE_MONTH, () => '三个月内')
    .with(EExpectTime.SIX_MONTH, () => '半年内')
    .with(EExpectTime.ONE_YEAR, () => '一年内')
    .with(EExpectTime.NOT_SURE, () => '暂不确定，只是期望了解')
    .otherwise(() => data.expectTime)
  result['所属行业'] = _industryToZh(data.industry)
  result['采购权限'] = _purchasingRoleToZh(data.purchasingRole)
  result['目前资产管理方式'] = data.assetManagement.map(_assetManagementToZh)
  result['感兴趣的功能'] = data.interestedFeatures.map(_interestedFeatureToZh)
  return result
}

export const saveFormToFeishu = async (formData: FormData) => {
  const fields = _teamFormToFields(formData)
  const res = await _getFeishuAuth()
  const token = res.data.tenant_access_token
  if (!token) {
    throw new Error(res.data.msg)
  }
  return axios.post(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${env.FEISHU_BOOK_DEMO_TABLE_APP_TOKEN}/tables/${env.FEISHU_ONBOARDING_FORM_TABLE_ID}/records`,
    {
      fields,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}
