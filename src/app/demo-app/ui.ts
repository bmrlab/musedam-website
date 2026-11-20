import { escapeHtml } from './access'
import type { ReleaseInfo } from './catalog'
import { isSafeSegment, LINK_FILE_RE, type DemoFile } from './storage'

export const RELEASE_CLASSES = {
  live: 'inline-flex items-center rounded bg-[var(--live-bg)] px-2 py-0.5 text-xs leading-4 text-[var(--live-ink)]',
  roadmap:
    'inline-flex items-center rounded bg-[var(--roadmap-bg)] px-2 py-0.5 text-xs leading-4 text-[var(--roadmap-ink)]',
}

export function releaseLabel(release: ReleaseInfo) {
  return release.status === 'live'
    ? '已上线'
    : `路线图中${release.releaseDate ? ` · 预计 ${release.releaseDate}` : ''}`
}

export function releaseTag(release: ReleaseInfo) {
  return `<span class="${RELEASE_CLASSES[release.status]}">${escapeHtml(releaseLabel(release))}</span>`
}

export const PAGE_TITLE = 'MuseDAM Demo Page'
export const HTML_FILE_RE = /\.html?$/i

export function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function formatDate(date?: Date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** `a/b` → ['a', 'b']；含非法片段时返回 null */
export function parsePath(value: string) {
  const segments = value
    .trim()
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean)
  return segments.every(isSafeSegment) ? segments : null
}

export function demoHref(file: DemoFile) {
  if (file.url) return file.url
  return `/demo-app/${file.path.split('/').map(encodeURIComponent).join('/')}`
}

export function demoName(file: DemoFile) {
  return file.path
    .slice(file.path.lastIndexOf('/') + 1)
    .replace(HTML_FILE_RE, '')
    .replace(LINK_FILE_RE, '')
}

export const UI = {
  button:
    'inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 font-medium text-[var(--ink)] transition-colors hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4',
  primary:
    'inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 font-semibold text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4',
  field:
    'h-9 min-w-0 rounded-md border border-[var(--input-line)] bg-[var(--surface)] px-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--sub)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]',
  tag: 'inline-flex shrink-0 items-center rounded bg-[var(--tag-bg)] px-2 py-0.5 font-mono text-xs leading-4 text-[var(--tag-ink)]',
}

export function skuTags(skus: string[]) {
  return skus.map((sku) => `<span class="${UI.tag}">${escapeHtml(sku)}</span>`).join('')
}

export function scriptJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, String.fromCharCode(92) + 'u003c')
}

export function renderShell({
  title,
  actions = '',
  body,
  script = '',
}: {
  title: string
  actions?: string
  body: string
  script?: string
}) {
  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>${escapeHtml(title)}</title><link rel="stylesheet" href="/demo-catalog.css"></head>
<body class="m-0 bg-[var(--bg)] text-sm leading-[22px] text-[var(--ink)] antialiased">
<header class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[var(--line)] bg-[var(--surface)] px-6">
<a class="flex min-w-0 items-center gap-3 font-semibold" href="/demo-app"><span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-white">M</span><span class="flex min-w-0 flex-col"><span class="truncate leading-5">MuseDAM 产品演示</span><span class="font-mono text-[10px] font-medium leading-4 tracking-[0.16em] text-[var(--sub)]">PROTOTYPE LIBRARY</span></span></a><span class="flex-1"></span>${actions}</header>
${body}<div role="status" id="toast" hidden class="fixed bottom-8 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-md bg-[var(--ink)] px-4 py-3 text-[var(--bg)]"></div>
<script>function toast(text) { var el = document.getElementById('toast'); el.textContent = text; el.hidden = false; clearTimeout(el._t); el._t = setTimeout(function () {el.hidden=true}, 3500); }
${script}</script></body></html>`
}

export const ICONS = {
  upload:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
}
