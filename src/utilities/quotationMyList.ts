import { getFetchUserUrl } from '@/utilities/auth'

import { SessionUser } from '@/types/user'

/**
 * `/org/quotation/my-list` 列表项：与接口文档对齐，并兼容报价单摘要字段。
 */
export type QuotationMyListItem = {
  id: number
  /** 客户名称等展示名（部分环境字段名为 name） */
  name?: string
  customerCompany?: string
  quotationNo?: string
  content?: string
  createTime?: number
  updateTime?: number
  modifiedTime?: string | number
  createdTime?: string | number
  orgFeeType?: number
  orgNo?: string
  icon?: string
  valid?: boolean
  invalidTime?: string
  memberTotal?: number
  roleId?: number
  logo?: string
  packType?: number
  seatCount?: number
  isVisitor?: number
}

function deployRegionHeader(): string {
  return process.env.DEPLOY_REGION === 'global' ? 'global' : 'cn'
}

/** Bash 单引号字符串转义，便于拼出可直接复制的 curl */
function shellSingleQuoted(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

function buildMyListReplayCurl(url: string, headerLines: [string, string][]): string {
  const parts = ['curl -sS -X GET', shellSingleQuoted(url)]
  for (const [k, v] of headerLines) {
    parts.push(`-H ${shellSingleQuoted(`${k}: ${v}`)}`)
  }
  return `${parts.join(' \\\n  ')}`
}

function shouldLogQuotationMyListCurl(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.DEBUG_QUOTATION_CURL === '1'
}

export async function fetchQuotationMyListServer(
  user: SessionUser,
): Promise<QuotationMyListItem[]> {
  const token = user.token
  if (!token) return []

  const url = getFetchUserUrl('/org/quotation/my-list')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-token': token,
    'x-user-id': user.userId,
    'x-org-id': user.orgId ?? '',
    'x-deploy-region': deployRegionHeader(),
  }

  if (shouldLogQuotationMyListCurl()) {
    const headerLines = Object.entries(headers) as [string, string][]
    console.log(
      '[fetchQuotationMyListServer] replay curl:\n',
      buildMyListReplayCurl(url, headerLines),
    )
  }

  const res = await fetch(url, {
    headers,
    cache: 'no-store',
  })

  if (!res.ok) return []

  const data: {
    code: string
    message?: string
    result?: { records: QuotationMyListItem[] }
  } = await res.json()

  if (data.code !== '0' || !Array.isArray(data.result?.records)) return []

  return data.result.records
}
