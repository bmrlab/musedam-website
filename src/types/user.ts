export type SessionUser = {
  userId: string
  isOrg: boolean
  hasOrg: boolean
  isPro: boolean
  isSale: boolean
  orgId?: string
  token?: string
  orgEmail?: string
  email?: string
  name?: string
}
