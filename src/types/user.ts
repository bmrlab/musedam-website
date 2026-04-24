export type SessionUser = {
  userId: string
  isOrg: boolean
  hasOrg: boolean
  isPro: boolean
  isSale: boolean
  isEnterpriseUser: boolean
  orgId?: string
  token?: string
  orgEmail?: string
  email?: string
  name?: string
}

export enum ESpaceRule {
  /** 个人 */
  FREE = 0,
  /** 付费 */
  PAID,
  /** 试用 */
  TRIAL,
  /** 白板 */
  WHITEBOARD,
  /** 企业版 */
  ENTERPRISE,
}
