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

export enum EShareAuth {
  'ONLY_VIEW' = 1,
  'CAN_DOWNLOAD' = 2
}
export interface IQuotationInfo {
  id: number
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
  uuid?: string // 用于分享的唯一id
  isShare?: 0 | 1
  password?: string
  shareAuth?: EShareAuth
  member?: { userId: string }
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


export const saveQuotation = async (country: string, userInfo: IHeaderInfo, params: Omit<IQuotationInfo, 'id'>) => {
  try {
    const response = await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-user/org/quotation/save`,
      {
        body: JSON.stringify(params),
        headers: { ...getHeader(country, userInfo), 'Content-Type': 'application/json' },
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


export const addQuotationDownloadRecord = async (country: string, userInfo: IHeaderInfo, params: { quotationId: string }) => {
  try {
    const response = await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-user/org/quotation/add-quotation-download-record?quotationId=${params.quotationId}`,
      {
        headers: { ...getHeader(country, userInfo), 'Content-Type': 'application/json' },
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
  params: { quotationId: string, userInfo: IHeaderInfo }
) => Promise<IQuotationInfo> = async (country, params) => {
  try {

    const response = await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-user/org/quotation/get-quotation-detail-by-id?quotationId=${params.quotationId}`,
      {
        headers: getHeader(country, params.userInfo)
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
    console.error('Error fetching quotation data:', error)
    throw error
  }
}

export const getQuotationForAdmin: (
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
    if (data.code !== '0') {
      throw new Error(data.message)
    }
    return data.result
  } catch (error) {
    console.error('Error fetching quotation data:', error)
    throw error
  }
}

export const getQuotationStatus: (country: string, params: { uuid: string }) => Promise<{
  isShare: 0 | 1	//报价单是否分享	integer(int32)	
  needPassword: boolean	//报价单是否需要密码访问	boolean	
  quotationNo: string	//报价单编号
}> = async (country, params) => {
  try {
    const response = await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-user/org/quotation/universal/share-quotation-state?uuid=${params.uuid}`,
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
    if (data.code !== '0') {
      throw new Error(data.message)
    }
    return data.result
  } catch (error) {
    console.error('Error fetching quotation data:', error)
    throw error
  }
}

/**
 * 编辑报价单
 */
export const editQuotation = async (country: string, userInfo: IHeaderInfo, params: Omit<IQuotationInfo, 'id'> & { quotationId: number }) => {
  try {
    const { quotationId, ...others } = params
    const response = await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-user/org/quotation/update/${params.quotationId}`,
      {
        body: JSON.stringify(others),
        headers: { ...getHeader(country, userInfo), 'Content-Type': 'application/json' },
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


/**
 * 
 */

export const getQuotationByUUid: (
  country: string,
  params: { uuid: string, userId?: string, password?: string }
) => Promise<IQuotationInfo> = async (country, params) => {
  try {
    let query = `uuid=${params.uuid}`
    if (params.password) {
      query = query + `&password=${params.password}`
    }
    if (params.userId) {
      query = query + `&userId=${params.userId}`
    }
    const response = await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-user/org/quotation/universal/get-quotation-by-uuid?${query}`,
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

    if (data.code !== '0') {
      throw new Error(data.message)
    }
    return data.result
  } catch (error) {
    console.error('Error fetching quotation data:', error)
    throw error
  }
}


export const addQuotationViewRecord = async (country: string, params: { device: string, uuid: string, deviceHash: string }) => {
  try {
    await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-user/org/quotation/universal/add-quotation-view-record`,
      {
        body: JSON.stringify(params),
        headers: {
          'x-deploy-region': country,
          'Content-Type': 'application/json'
        },
        method: 'POST',
      },
    )
    return true
  } catch (error) {
    console.error('Error fetching quotation data:', error)
    throw error
  }
}