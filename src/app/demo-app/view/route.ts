import { NextRequest, NextResponse } from 'next/server'

import { escapeHtml, getDemoViewer, loginRedirect, PAGE_HEADERS } from '../access'
import { classifyDemo, moduleKey, releaseFor } from '../catalog'
import { moduleIcon } from '../module-icons'
import { getModuleRelease } from '../storage'
import {
  demoHref,
  demoName,
  HTML_FILE_RE,
  ICONS,
  parsePath,
  releaseTag,
  renderShell,
  skuTags,
  UI,
} from '../ui'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!(await getDemoViewer())) return loginRedirect(request)
  const path = request.nextUrl.searchParams.get('path') ?? ''
  const segments = parsePath(path)
  if (!segments?.length || !HTML_FILE_RE.test(segments.at(-1)!))
    return new NextResponse('Invalid prototype path', { status: 400 })
  const file = { path: segments.join('/'), size: 0 }
  const demoModule = { ...classifyDemo(file.path) }
  const record = await getModuleRelease(demoModule)
  if (record) {
    demoModule.release = record.release
    demoModule.icon = record.module.icon
  }
  const name = demoName(file)
  return new NextResponse(
    renderShell({
      title: `${name} · MuseDAM`,
      actions: `<a class="${UI.button}" href="${demoHref(file)}" target="_blank" rel="noopener">${ICONS.open}独立打开</a>`,
      body: `<main class="flex h-[calc(100vh-64px)] flex-col"><div class="flex shrink-0 flex-col gap-2 border-b border-[var(--line)] bg-[var(--surface)] px-6 py-4"><a class="text-[13px] text-[var(--sub)] hover:text-[var(--accent)]" href="/demo-app?module=${encodeURIComponent(moduleKey(demoModule))}">${escapeHtml(moduleKey(demoModule))}</a><div class="flex flex-wrap items-center gap-3"><span class="flex size-10 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--tag-ink)] [&_svg]:size-5">${moduleIcon(demoModule)}</span><h1 class="text-[22px] font-semibold leading-8">${escapeHtml(name)}</h1>${skuTags(demoModule.skus)}${releaseTag(releaseFor(demoModule))}</div></div><iframe class="min-h-0 w-full flex-1 border-0 bg-[var(--surface)]" title="${escapeHtml(name)}" src="${escapeHtml(demoHref(file))}" allow="clipboard-write; fullscreen"></iframe></main>`,
    }),
    { headers: PAGE_HEADERS },
  )
}
