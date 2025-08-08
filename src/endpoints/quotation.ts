import { MUSE_GLOBAL_SERVER_URL, MUSE_MAINLAND_SERVER_URL } from '@/constant/url'

import { EMuseProductType } from '@/components/Pricing/types/products'

export interface ProductItem {
  discountPrice: number
  id: number
  name: string
  price: number
  productType: EMuseProductType
  recommend: boolean
}
interface IQuotationInfo {
  annualPrice: number, // 单价
  contactEmail: string, // 销售邮箱
  content: string,// 报价单内容
  customerCompany: string,// 客户名称
  customerContact?: string,// 客户联系方式
  customerEmail?: string,// 客户联系方式
  discount?: number,//折扣
  subscriptionYears: number//订阅年限
  quotationNo?: string//报价单编号
  createTime?: number //创建日期
}
interface IHeaderInfo {
  userId: string, orgId: string, token: string
}

const getHeader = (country: string, userInfo: IHeaderInfo) => {
  return {
    'x-deploy-region': country,
    'x-org-id': userInfo.orgId,
    'x-token': userInfo.token,
    'x-user-id': userInfo.userId,
  }
}


export const saveQuotation = async (country: string, userInfo: IHeaderInfo, params: IQuotationInfo) => {
  try {
    const response = await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-user/org/quotation/save`,
      {
        body: JSON.stringify(params),
        headers: { ...getHeader(country, userInfo), 'Content-Type': 'application/json', 'x-asm-prefer-tag': 'version-env-06' },
        method: 'POST',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch pricing data')
    }
    const data = await response.json()
    if (data.code !== '0') {
      throw new Error(data.message)
    }
    return data.result

  } catch (error) {
    console.error('Error save quotation:', error)
    throw error
  }
}

export const getQuotation: (
  country: string,
  params: { quotationId: string, orgId: string, userId: string }
) => Promise<IQuotationInfo> = async (country, params) => {
  try {
    const response = await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-user/universal/admin/getQuotationDetailById?quotationId=${params.quotationId}&orgId=${params.orgId}&userId=${params.userId}`,
      {
        headers: {
          'x-deploy-region': country,
        }
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch pricing data')
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Error fetching quotation data:', error)
    throw error
  }
}