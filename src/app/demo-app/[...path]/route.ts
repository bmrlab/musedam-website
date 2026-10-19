import { NextRequest, NextResponse } from 'next/server'

import { getDemoViewer, loginRedirect } from '../access'
import { getDemoFile, isSafeSegment } from '../storage'

/** 回退源：oss://musedam-assets/public/testAssets/Demo HTML/ */
const OSS_BASE = 'https://musedam-assets.oss-cn-beijing.aliyuncs.com/public/testAssets/Demo%20HTML'

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'content-encoding',
  'content-length',
  'content-disposition',
  'accept-ranges',
  'x-oss-force-download',
])

function toOssUrl(segments: string[]) {
  if (!segments.length || !segments.every(isSafeSegment)) return null
  const url = new URL(segments.map(encodeURIComponent).join('/'), `${OSS_BASE}/`)
  if (!url.href.startsWith(`${OSS_BASE}/`)) return null
  return url
}

function candidatePaths(segments: string[]) {
  const last = segments[segments.length - 1]
  const candidates = [segments]
  if (last && !last.includes('.')) {
    candidates.push([...segments.slice(0, -1), `${last}.html`])
    candidates.push([...segments, 'index.html'])
  }
  return candidates
}

async function fetchOssUrl(url: URL) {
  let current = url
  for (let hop = 0; hop < 5; hop++) {
    const response = await fetch(current, {
      redirect: 'manual',
      cache: 'no-store',
    })
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location) return null
      const next = new URL(location, current)
      if (!next.href.startsWith(`${OSS_BASE}/`)) return null
      current = next
      continue
    }
    return response.ok ? response : null
  }
  return null
}

function demoFileResponse(file: NonNullable<Awaited<ReturnType<typeof getDemoFile>>>) {
  const headers = new Headers()
  if (file.contentType) headers.set('content-type', file.contentType)
  if (file.lastModified) headers.set('last-modified', file.lastModified.toUTCString())
  if (file.etag) headers.set('etag', file.etag)
  return new Response(file.body, { headers })
}

/** 先读上传到 S3 的 demo，没有再回退到阿里云 OSS */
async function fetchDemo(segments: string[]) {
  for (const candidate of candidatePaths(segments)) {
    if (!candidate.length || !candidate.every(isSafeSegment)) continue
    const file = await getDemoFile(candidate)
    if (file) return { response: demoFileResponse(file), segments: candidate }
  }
  for (const candidate of candidatePaths(segments)) {
    const url = toOssUrl(candidate)
    if (!url) continue
    const response = await fetchOssUrl(url)
    if (response) return { response, segments: candidate }
  }
  return null
}

function passthroughHeaders(source: Headers, contentType?: string) {
  const headers = new Headers()
  source.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value)
    }
  })
  if (contentType) {
    headers.set('Content-Type', contentType)
  }
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Content-Disposition', 'inline')
  // 需登录才能访问，禁止 CDN 等共享缓存
  headers.set('Cache-Control', 'private, no-store')
  headers.set('X-Robots-Tag', 'noindex, nofollow')
  return headers
}

function resolveContentType(ossType: string | null, filename: string) {
  if (filename.endsWith('.html') || filename.endsWith('.htm')) {
    // OSS 返回的是不带 charset 的 text/html，且导出的 demo HTML 没有 <meta charset>，
    // 浏览器会按系统语言回退成 GBK 解码，导致内联脚本中的中文变成乱码、脚本报错。
    return 'text/html; charset=utf-8'
  }
  return ossType || undefined
}

async function proxyDemoAsset(request: NextRequest, path: string[]) {
  // 任意已登录的 MuseDAM 用户均可访问单个 demo
  if (!(await getDemoViewer())) return loginRedirect(request)

  const matched = await fetchDemo(path)
  if (!matched) {
    return new NextResponse('Demo asset not found', { status: 404 })
  }

  const lastRequested = path[path.length - 1]
  const lastFetched = matched.segments[matched.segments.length - 1]
  const servedIndex =
    lastFetched === 'index.html' && lastRequested !== 'index.html' && !lastRequested?.includes('.')
  if (servedIndex) {
    const dest = `/demo-app/${matched.segments.map(encodeURIComponent).join('/')}${request.nextUrl.search}`
    return NextResponse.redirect(new URL(dest, request.url), 302)
  }

  const filename = matched.segments[matched.segments.length - 1] ?? ''
  const contentType = resolveContentType(matched.response.headers.get('content-type'), filename)
  const headers = passthroughHeaders(matched.response.headers, contentType)

  return new NextResponse(matched.response.body, {
    status: matched.response.status,
    headers,
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params
    return await proxyDemoAsset(request, path)
  } catch (error) {
    console.error('demo-app proxy error:', error)
    return new NextResponse('Failed to load demo asset', { status: 502 })
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params
    const response = await proxyDemoAsset(request, path)
    return new NextResponse(null, { status: response.status, headers: response.headers })
  } catch (error) {
    console.error('demo-app proxy error:', error)
    return new NextResponse(null, { status: 502 })
  }
}
