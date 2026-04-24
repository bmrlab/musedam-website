'use server'

import { revalidatePath } from 'next/cache'
import { getFetchUserUrl, getServerSession } from '@/utilities/auth'

function deployRegionHeader(): string {
  return process.env.DEPLOY_REGION === 'global' ? 'global' : 'cn'
}

/**
 * 删除报价单（与下载记录等接口风格一致：POST + quotationId 查询参数）。
 * 若后端路径不同，仅需改此处的 path。
 */
export async function deleteQuotationHistoryItem(quotationId: number, lng: string) {
  const user = await getServerSession()
  if (!user?.token) return { ok: false as const, message: 'unauthorized' }

  const res = await fetch(getFetchUserUrl(`/org/quotation/delete/${quotationId}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-token': user.token,
      'x-user-id': user.userId,
      'x-org-id': user.orgId ?? '',
      'x-deploy-region': deployRegionHeader(),
    },
  })

  if (!res.ok) return { ok: false as const, message: 'request_failed' }

  const data: { code: string; message?: string } = await res.json().catch(() => ({ code: '' }))
  if (data.code !== '0') {
    return { ok: false as const, message: data.message ?? 'api_error' }
  }

  revalidatePath(`/${lng}/quotation/history`, 'page')
  return { ok: true as const }
}
