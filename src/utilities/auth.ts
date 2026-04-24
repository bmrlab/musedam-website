import { cache } from 'react'
import { cookies } from 'next/headers'
import {
  MUSE_GLOBAL_AUTH_URL,
  MUSE_GLOBAL_SERVER_URL,
  MUSE_MAINLAND_AUTH_URL,
  MUSE_MAINLAND_SERVER_URL,
} from '@/constant/url'

import { ESpaceRule, SessionUser } from '@/types/user'

export const getFetchUserUrl = (path: string) => {
  const host =
    process.env.DEPLOY_REGION === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL
  return `${host}/mini-dam-user${path}`
}

/**
 * (cached) 获取服务器端的用户会话信息
 */
export const getServerSession: () => Promise<SessionUser | null> = cache(async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')?.value
  // const sessionToken =
  //   'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..EugHy2WwI8tQj71Q.prRlcpTaPGsFE8FHEEtVd3vy9LJZXzpgL7lfPO0iqfqniuDWUJ_FM7J55NtY_XI2hwqHu40LA53IQhGbWX6jz3bk6iZmUyZJld3QHfmQ3bSA-whsCEW8pooeIAQNHBxUMepl0RaclHufYIPgZzOZ93HitRzAqEmDTWAEKiqyJIyNrJpDxYSpNjqo4K3-ylz9BBl0yiDjaQ8dHSn-GcTQcQt-YErrIfHeQyeDIs4aVMSNXepHEuNblgZt78TLvZu8TtiTNlYRE17FrSbPpHzUB2AmZA21ouf7KEIV9wgurxkkNfY.OHkz3E9mLKdKMHImvnpnSg'

  if (!sessionToken) return null

  // 用 session 请求 auth 服务，得到 token 和 user-id
  const response = await fetch(
    `${process.env.DEPLOY_REGION === 'global' ? MUSE_GLOBAL_AUTH_URL : MUSE_MAINLAND_AUTH_URL}/code`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: sessionToken }),
    },
  )
  if (!response.ok) return null
  const data: { userId: string; token: string; orgId?: string } = await response.json()

  const requestHeader = {
    'Content-Type': 'application/json',
    'x-token': data.token,
    'x-user-id': data.userId,
  }

  // 用 token 和 user-id 获取用户信息
  // 构造符合需求的对象并返回
  const userResponse = await fetch(getFetchUserUrl('/user'), {
    headers: requestHeader,
  })
  if (!userResponse.ok) return null

  const userData: {
    code: string
    message: string
    // NOTE 代码里没写很多不必要的参数，但是返回数据里是完整的，具体参考 mini-dam-user 的接口文档
    result: {
      config:
        | {
            lastSpaceId?: number
            language?: string
          }
        | null
        | undefined
      proInvalidDate?: string
      realName?: string
      nickName?: string
      email?: string
    }
  } = await userResponse.json()

  if (userData.code !== '0' || !userData.result) return null

  const orgId = cookieStore.get('ajs_group_id')?.value ?? data.orgId

  const result: SessionUser = {
    userId: data.userId,
    name: userData.result.realName || userData.result.nickName,
    email: userData.result.email,
    orgId: orgId,
    token: data.token,
    isSale: false,
    isOrg:
      userData.result.config?.lastSpaceId !== undefined && userData.result.config.lastSpaceId > 0,
    hasOrg: false,
    isPro: userData.result.proInvalidDate
      ? new Date(userData.result.proInvalidDate) > new Date()
      : false,
    isEnterpriseUser: false,
  }

  // 获取用户团队列表
  const [orgResponse, userSaleInfo] = await Promise.all([
    fetch(getFetchUserUrl('/org'), {
      headers: requestHeader,
    }),
    fetch(getFetchUserUrl(`/org/members/queryUserIsSaleMember`), {
      headers: requestHeader,
    }),
  ])

  if (orgResponse.ok) {
    const orgData: {
      code: string
      message: string
      result: { id: number; orgFeeType: ESpaceRule }[]
    } = await orgResponse.json()
    const isEnterpriseUser =
      orgData.result.findIndex((v) => v.orgFeeType === ESpaceRule.ENTERPRISE) > -1

    result.hasOrg = orgData.code === '0' && orgData.result.length > 0
    result.isEnterpriseUser = isEnterpriseUser
  }

  if (userSaleInfo) {
    const orgMemberInfo: {
      code: string
      message: string
      result: { isSale: 0 | 1; email: string }
    } = await userSaleInfo.json()
    result.isSale = Boolean(orgMemberInfo.result.isSale)
    result.orgEmail = orgMemberInfo.result.email
  }
  return result
})
