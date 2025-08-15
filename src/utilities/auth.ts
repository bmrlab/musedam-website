import { cache } from 'react'
import { cookies } from 'next/headers'
import {
  MUSE_GLOBAL_AUTH_URL,
  MUSE_GLOBAL_SERVER_URL,
  MUSE_MAINLAND_AUTH_URL,
  MUSE_MAINLAND_SERVER_URL,
} from '@/constant/url'
import type { SessionUser } from '@/types/user'


const getFetchUserUrl = (path: string) => {
  const host = process.env.DEPLOY_REGION === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL
  return `${host}/mini-dam-user${path}`
}

/**
 * (cached) 获取服务器端的用户会话信息
 */
export const getServerSession: () => Promise<SessionUser | null> = cache(async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')?.value
  // const sessionToken = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..uSXk-5Bs0D2BVwNE.7-5-_XxnpLVb1_mLYetqRNqmv9fT0ThPBU4o3NQuXxJW4tc2KclgBTx60jjWMK0NEidLtJxNwIn2cbJU4dwbNDK7ztmiEeEt4poDpSsXxRB-DLPz02GtZOP1_E1CZvFFcTfSz1spgVD1Q7zp8mkKUHzb1ncp9IsDWPwdEkCuW5prKv7HY_6D4A0-ZXO5vhF5vZ60t7ih51XNqYQPSyyWpMWWh2ZT5-a1NDLD_sca6QjBtJVPL4vXRZzLh6Jr8pblbRo0R9J7Z4Y0_apq0HGwUR1lox8MQKCNwBmhG9wBwuAvEwY.4XOJEGtr8ZX1Cbx9cZXxzw'

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
  const data: { userId: string; token: string, orgId?: string } = await response.json()
  // console.log("data-----", data)

  const requestHeader = {
    'Content-Type': 'application/json',
    'x-token': data.token,
    'x-user-id': data.userId,
  }

  // 用 token 和 user-id 获取用户信息
  // 构造符合需求的对象并返回
  const userResponse = await fetch(
    getFetchUserUrl('/user'),
    {
      headers: requestHeader,
    },
  )
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
    }
  } = await userResponse.json()

  if (userData.code !== '0' || !userData.result) return null

  const result: SessionUser = {
    userId: data.userId,
    orgId: data.orgId,
    token: data.token,
    isSale: false,
    isOrg: userData.result.config?.lastSpaceId !== undefined && userData.result.config.lastSpaceId > 0,
    hasOrg: false,
    isPro: userData.result.proInvalidDate
      ? new Date(userData.result.proInvalidDate) > new Date()
      : false,
  }

  // 获取用户团队列表
  const [orgResponse, orgMemberResponse] = await Promise.all([fetch(
    getFetchUserUrl('/org'),
    {
      headers: requestHeader,
    },
  ), data.orgId && fetch(
    getFetchUserUrl(`/org/members/${data.userId}`),
    {
      headers: { ...requestHeader, 'x-org-id': data.orgId },
    },
  )])

  if (orgResponse.ok) {
    const orgData: { code: string; message: string; result: { id: number }[] } = await orgResponse.json()
    result.hasOrg = orgData.code === '0' && orgData.result.length > 0
  }

  if (orgMemberResponse) {
    const orgMemberInfo: { code: string; message: string; result: { isSale: 0 | 1, email: string; } } = await orgMemberResponse.json()
    result.isSale = Boolean(orgMemberInfo.result.isSale)
    result.orgEmail = orgMemberInfo.result.email
  }
  return result
})
