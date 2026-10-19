import { NextRequest, NextResponse } from 'next/server'

import { getDemoViewer, loginRedirect } from '../access'
import { getDemoFile, isSafeSegment } from '../storage'

function candidatePaths(segments: string[]) {
  const last = segments[segments.length - 1]
  const candidates = [segments]
  if (last && !last.includes('.')) {
    candidates.push([...segments.slice(0, -1), `${last}.html`])
    candidates.push([...segments, 'index.html'])
  }
  return candidates
}

async function findDemo(segments: string[]) {
  if (!segments.length || !segments.every(isSafeSegment)) return null
  for (const candidate of candidatePaths(segments)) {
    const file = await getDemoFile(candidate)
    if (file) return { file, segments: candidate }
  }
  return null
}

function resolveContentType(storedType: string | undefined, filename: string) {
  if (/\.html?$/i.test(filename)) {
    // 导出的 demo HTML 没有 <meta charset>，不声明 charset 时浏览器会按系统语言回退成 GBK 解码，
    // 导致内联脚本中的中文变成乱码、脚本报错。
    return 'text/html; charset=utf-8'
  }
  return storedType || 'application/octet-stream'
}

async function serveDemo(request: NextRequest, path: string[]) {
  // 任意已登录的 MuseDAM 用户均可访问单个 demo
  if (!(await getDemoViewer())) return loginRedirect(request)

  const matched = await findDemo(path)
  if (!matched) {
    return new NextResponse('Demo not found', { status: 404 })
  }

  const lastRequested = path[path.length - 1]
  const lastFetched = matched.segments[matched.segments.length - 1]
  const servedIndex =
    lastFetched === 'index.html' && lastRequested !== 'index.html' && !lastRequested?.includes('.')
  if (servedIndex) {
    const dest = `/demo-app/${matched.segments.map(encodeURIComponent).join('/')}${request.nextUrl.search}`
    return NextResponse.redirect(new URL(dest, request.url), 302)
  }

  const { file } = matched
  const headers = new Headers({
    'Content-Type': resolveContentType(file.contentType, lastFetched ?? ''),
    'Content-Disposition': 'inline',
    'X-Content-Type-Options': 'nosniff',
    // 需登录才能访问，禁止 CDN 等共享缓存
    'Cache-Control': 'private, no-store',
    'X-Robots-Tag': 'noindex, nofollow',
  })
  if (file.lastModified) headers.set('Last-Modified', file.lastModified.toUTCString())
  if (file.etag) headers.set('ETag', file.etag)

  return new NextResponse(file.body, { headers })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params
    return await serveDemo(request, path)
  } catch (error) {
    console.error('demo-app serve error:', error)
    return new NextResponse('Failed to load demo', { status: 502 })
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params
    const response = await serveDemo(request, path)
    return new NextResponse(null, { status: response.status, headers: response.headers })
  } catch (error) {
    console.error('demo-app serve error:', error)
    return new NextResponse(null, { status: 502 })
  }
}
