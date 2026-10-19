import { escapeHtml } from './access'
import { isSafeSegment, type DemoFile } from './storage'

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
  return `/demo-app/${file.path.split('/').map(encodeURIComponent).join('/')}`
}

export function demoName(file: DemoFile) {
  return file.path.slice(file.path.lastIndexOf('/') + 1).replace(HTML_FILE_RE, '')
}

export function demoFolder(file: DemoFile) {
  const idx = file.path.lastIndexOf('/')
  return idx === -1 ? '' : file.path.slice(0, idx)
}

const BASE_CSS = `
  :root {
    color-scheme: light;
    --bg: #f7f9fc; --surface: #ffffff; --surface-2: #edf1f7;
    --ink: #222b45; --ink-2: #2e3a59; --sub: #8f9bb3; --line: #e4e9f2;
    --accent: #3366ff; --accent-ink: #ffffff; --accent-soft: #e6eeff;
    --danger: #ff3d71; --danger-soft: #ffe8ef; --ok: #00b383;
    --shadow: 0 1px 2px rgba(34, 43, 69, .04), 0 4px 16px rgba(34, 43, 69, .06);
    --shadow-hover: 0 2px 4px rgba(34, 43, 69, .06), 0 12px 32px rgba(34, 43, 69, .12);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      color-scheme: dark;
      --bg: #101426; --surface: #192038; --surface-2: #222b45;
      --ink: #f7f9fc; --ink-2: #c5cee0; --sub: #8f9bb3; --line: #2e3a59;
      --accent: #598bff; --accent-soft: rgba(89, 139, 255, .16);
      --danger-soft: rgba(255, 61, 113, .16);
      --shadow: 0 1px 2px rgba(0, 0, 0, .3); --shadow-hover: 0 12px 32px rgba(0, 0, 0, .45);
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink-2); font: 14px/1.6 -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif; -webkit-font-smoothing: antialiased; }
  a { color: inherit; text-decoration: none; }
  button, input, select { font: inherit; color: inherit; }
  .wrap { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
  .topbar { position: sticky; top: 0; z-index: 10; backdrop-filter: saturate(180%) blur(12px); background: color-mix(in srgb, var(--bg) 82%, transparent); border-bottom: 1px solid var(--line); }
  .topbar .wrap { display: flex; align-items: center; gap: 12px; height: 60px; }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 600; color: var(--ink); }
  .brand-mark { width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: var(--accent); color: var(--accent-ink); font-size: 13px; font-weight: 700; letter-spacing: -.02em; }
  .spacer { flex: 1; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 36px; padding: 0 16px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; white-space: nowrap; transition: border-color .15s, background .15s, color .15s; }
  .btn:hover { border-color: var(--accent); color: var(--accent); }
  .btn.primary { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
  .btn.primary:hover { filter: brightness(1.08); color: var(--accent-ink); }
  .btn:disabled { opacity: .6; cursor: default; }
  .btn svg { width: 16px; height: 16px; }
  .field { height: 40px; padding: 0 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); outline: none; transition: border-color .15s, box-shadow .15s; }
  .field:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .message { margin: 24px 0 0; padding: 12px 16px; border-radius: 10px; background: var(--accent-soft); color: var(--ink); }
  .empty { padding: 64px 16px; text-align: center; color: var(--sub); }
  .toast { position: fixed; left: 50%; bottom: 32px; transform: translate(-50%, 16px); padding: 10px 18px; border-radius: 10px; background: var(--ink); color: var(--bg); opacity: 0; pointer-events: none; transition: opacity .2s, transform .2s; }
  .toast.show { opacity: 1; transform: translate(-50%, 0); }
  [hidden] { display: none !important; }
`

export function renderShell({
  title,
  css = '',
  actions = '',
  body,
  script = '',
}: {
  title: string
  css?: string
  actions?: string
  body: string
  script?: string
}) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)}</title>
<style>${BASE_CSS}${css}</style>
</head>
<body>
<header class="topbar"><div class="wrap">
  <a class="brand" href="/demo-app"><span class="brand-mark">M</span>${escapeHtml(PAGE_TITLE)}</a>
  <span class="spacer"></span>
  ${actions}
</div></header>
${body}
<div class="toast" id="toast"></div>
<script>
  function toast(text) {
    var el = document.getElementById('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }
${script}
</script>
</body>
</html>`
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
