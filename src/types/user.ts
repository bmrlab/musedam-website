export type SessionUser = {
  userId: string
  isOrg: boolean
  hasOrg: boolean
  isPro: boolean
  isSale: boolean
  isEnterpriseUser: boolean
  /** 当前销售角色（报价业务角色） */
  businessRole?: 'muse' | 'pod'
  /** 该销售可切换的业务角色列表 */
  businessRoles?: ('muse' | 'pod')[]
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
