import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/utilities/auth'

import type { SessionUser } from '@/types/user'

export const PAGE_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

/** 当前 MuseDAM 登录用户；未登录或会话校验失败时返回 null */
export async function getDemoViewer() {
  try {
    return await getServerSession()
  } catch (error) {
    console.error('demo-app session error:', error)
    return null
  }
}

/** 【Muse】销售：可查看 demo 列表、上传和删除 */
export function isMuseSale(user: SessionUser | null) {
  return Boolean(user?.isSale && user.businessRoles?.includes('muse'))
}

/** 对外访问的完整地址；服务在反向代理后，request.url 可能是内部地址 */
function publicUrl(request: NextRequest) {
  const path = request.nextUrl.pathname + request.nextUrl.search
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto')?.split(',')[0].trim()
  if (!host) return new URL(path, request.url)
  return new URL(path, `${proto || request.nextUrl.protocol.replace(':', '')}://${host}`)
}

/** 未登录：跳转登录，登录后回到当前页面 */
export function loginRedirect(request: NextRequest) {
  const current = publicUrl(request)
  const login = new URL('/auth', current)
  login.searchParams.set('redirect', current.href)
  return NextResponse.redirect(login, 302)
}

/** 已登录但不是【Muse】销售 */
export function forbiddenResponse() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>MuseDAM Demo</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; padding: 0 16px; background: #000; color: #fff; text-align: center; font: 16px/1.6 -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
  a { padding: 12px 32px; border-radius: 12px; background: #fff; color: #000; font-size: 14px; text-decoration: none; }
</style>
</head>
<body>
  <img src="/assets/logo-dark.svg" width="100" alt="Muse">
  <p>仅【Muse】销售可访问 Demo 列表。</p>
  <a href="/">返回首页</a>
</body>
</html>`
  return new NextResponse(html, { status: 403, headers: PAGE_HEADERS })
}
