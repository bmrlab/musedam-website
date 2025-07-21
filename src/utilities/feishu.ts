
import axios from 'axios'
import { env } from 'process'
import { match } from 'ts-pattern'
import { z } from 'zod'

export enum EOrgSize {
  TEN = 1,//"2~10人"
  FIFTY,  //"11-50人"
  TWO_HUNDRED, //"51-200人"
  FIVE_HUNDRED,  //"201-500人"
  ONE_THOUSAND, //"501-1000人"
  MORE_THOUSAND, // "大于1000人"
}

export enum EExpectTime {
  ONE_MONTH = 1,
  THREE_MONTH,
  SIX_MONTH,
  ONE_YEAR,
  NOT_SURE
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
})

type FormData = z.infer<typeof bookDemoFormSchema>


const _getFeishuAuth = () => {
  return axios
    .post<{
      code: number
      expire: number
      msg: string
      tenant_access_token: string
    }>('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: env.MUSE_FEISHU_APP_ID,
      app_secret: env.MUSE_FEISHU_APP_SECRET,
    })
}

function _teamFormToFields(
  data: z.infer<typeof bookDemoFormSchema>,
): Record<string, any> {
  const result: Record<string, any> = {}
  result['来源'] = process.env.DEPLOY_REGION === 'global' ? '国外版' : '国内版'
  result['姓名'] = data.name
  result['邮箱'] = data.email
  result['手机号'] = data.phone
  result['公司全称'] = data.company
  result['职位'] = data.position
  result['微信号'] = data.wechat
  result['企业邮箱'] = data.companyEmail

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
  return result
}

export const saveFormToFeishu = async (formData: FormData) => {
  const fields = _teamFormToFields(formData)
  const res = await _getFeishuAuth()
  const token = res.data.tenant_access_token
  if (!token) {
    throw new Error(res.data.msg)
  }
  return axios
    .post(
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
