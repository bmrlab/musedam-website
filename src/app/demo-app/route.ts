import { NextRequest, NextResponse } from 'next/server'

import {
  escapeHtml,
  forbiddenResponse,
  getDemoViewer,
  isMuseSale,
  loginRedirect,
  PAGE_HEADERS,
} from './access'
import { listDemoFiles, type DemoFile } from './storage'
import {
  demoFolder,
  demoHref,
  demoName,
  formatDate,
  formatSize,
  ICONS,
  PAGE_TITLE,
  renderShell,
} from './ui'

export const dynamic = 'force-dynamic'

const RECENT_MS = 7 * 24 * 60 * 60 * 1000

/** 按路径生成稳定的封面色相 */
function coverHue(path: string) {
  let hash = 0
  for (const char of path) hash = (hash * 31 + char.codePointAt(0)!) | 0
  return Math.abs(hash) % 360
}

function shortDate(date?: Date) {
  return date ? formatDate(date).slice(0, 10) : ''
}

function renderCard(file: DemoFile, now: number) {
  const name = demoName(file)
  const folder = demoFolder(file)
  const href = demoHref(file)
  const time = file.lastModified?.getTime() ?? 0
  const isNew = time && now - time < RECENT_MS
  return `<article class="card" data-folder="${escapeHtml(folder)}" data-name="${escapeHtml(name.toLowerCase())}" data-search="${escapeHtml(file.path.toLowerCase())}" data-time="${time}">
  <a class="cover" href="${escapeHtml(href)}" target="_blank" rel="noopener" style="--h:${coverHue(file.path)}">
    <span class="window">
      <span class="window-bar"><i></i><i></i><i></i></span>
      <span class="window-title">${escapeHtml(name)}</span>
    </span>
    ${isNew ? '<span class="badge">NEW</span>' : ''}
    <span class="cover-open">${ICONS.open}打开</span>
  </a>
  <div class="card-body">
    <div class="card-text">
      <a class="card-title" href="${escapeHtml(href)}" target="_blank" rel="noopener" title="${escapeHtml(file.path)}">${escapeHtml(name)}</a>
      <div class="card-meta">
        ${folder ? `<span class="chip">${escapeHtml(folder)}</span>` : ''}
        <span>${formatSize(file.size)}</span><span class="dot"></span><span title="${formatDate(file.lastModified)}">${shortDate(file.lastModified)}</span>
      </div>
    </div>
    <button class="copy" type="button" data-href="${escapeHtml(href)}" title="复制链接" aria-label="复制链接">${ICONS.link}</button>
  </div>
</article>`
}

function renderFolders(files: DemoFile[]) {
  const counts = new Map<string, number>()
  for (const file of files) {
    const folder = demoFolder(file)
    counts.set(folder, (counts.get(folder) ?? 0) + 1)
  }
  if (counts.size < 2) return ''
  const chips = [...counts.entries()]
    .sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b, 'zh-CN')))
    .map(
      ([folder, n]) =>
        `<button class="tab" type="button" data-folder="${escapeHtml(folder)}">${escapeHtml(folder || '未分组')}<span>${n}</span></button>`,
    )
    .join('')
  return `<div class="tabs"><button class="tab active" type="button" data-folder="*">全部<span>${files.length}</span></button>${chips}</div>`
}

const LIST_CSS = `
  .hero { padding: 48px 0 24px; }
  .hero h1 { margin: 0; font-size: 32px; line-height: 1.25; letter-spacing: -.02em; color: var(--ink); }
  .hero p { margin: 8px 0 0; color: var(--sub); font-size: 15px; }
  .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 28px; }
  .search { position: relative; flex: 1 1 280px; max-width: 420px; }
  .search svg { position: absolute; left: 12px; top: 50%; width: 16px; height: 16px; transform: translateY(-50%); color: var(--sub); }
  .search .field { width: 100%; padding-left: 36px; }
  .toolbar select.field { padding-right: 32px; }
  .tabs { display: flex; gap: 8px; overflow-x: auto; margin-top: 16px; padding-bottom: 4px; scrollbar-width: none; }
  .tab { flex: none; height: 32px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface); color: var(--ink-2); cursor: pointer; transition: all .15s; }
  .tab span { margin-left: 6px; color: var(--sub); font-size: 12px; }
  .tab:hover { border-color: var(--accent); }
  .tab.active { background: var(--ink); border-color: var(--ink); color: var(--bg); }
  .tab.active span { color: inherit; opacity: .7; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; padding: 24px 0 80px; }
  .card { position: relative; display: flex; flex-direction: column; border-radius: 16px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); overflow: hidden; transition: transform .2s, box-shadow .2s, border-color .2s; }
  .card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); border-color: transparent; }
  .cover { position: relative; display: grid; place-items: center; aspect-ratio: 16 / 9; overflow: hidden;
    background:
      radial-gradient(120% 90% at 0% 0%, hsl(var(--h) 90% 72% / .95), transparent 60%),
      radial-gradient(120% 90% at 100% 100%, hsl(calc(var(--h) + 50) 85% 62% / .95), transparent 60%),
      hsl(calc(var(--h) + 20) 70% 55%); }
  .cover::after { content: ""; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,.22) 1px, transparent 1px); background-size: 14px 14px; mask-image: linear-gradient(to bottom, #000, transparent); }
  .window { position: relative; z-index: 1; width: 76%; height: 64%; display: flex; flex-direction: column; border-radius: 10px; background: rgba(255,255,255,.9); box-shadow: 0 12px 32px rgba(16,20,38,.18); overflow: hidden; transform: translateY(10%); transition: transform .3s; }
  .card:hover .window { transform: translateY(4%); }
  .window-bar { display: flex; gap: 5px; padding: 8px 10px; background: rgba(255,255,255,.7); border-bottom: 1px solid rgba(34,43,69,.06); }
  .window-bar i { width: 7px; height: 7px; border-radius: 50%; background: hsl(var(--h) 60% 70%); }
  .window-bar i:nth-child(2) { background: hsl(calc(var(--h) + 40) 60% 72%); }
  .window-bar i:nth-child(3) { background: hsl(calc(var(--h) + 80) 60% 74%); }
  .window-title { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: auto 14px; color: hsl(var(--h) 45% 28%); font-size: 15px; font-weight: 700; line-height: 1.35; text-align: center; word-break: break-all; }
  .badge { position: absolute; z-index: 2; top: 12px; left: 12px; padding: 2px 8px; border-radius: 6px; background: rgba(255,255,255,.92); color: #222b45; font-size: 11px; font-weight: 700; letter-spacing: .04em; }
  .cover-open { position: absolute; z-index: 2; right: 12px; bottom: 12px; display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 8px; background: rgba(16,20,38,.55); color: #fff; font-size: 12px; opacity: 0; transform: translateY(4px); transition: opacity .2s, transform .2s; backdrop-filter: blur(6px); }
  .cover-open svg { width: 14px; height: 14px; }
  .card:hover .cover-open { opacity: 1; transform: none; }
  .card-body { display: flex; align-items: flex-start; gap: 8px; padding: 14px 12px 16px 16px; }
  .card-text { flex: 1; min-width: 0; }
  .card-title { display: block; font-size: 15px; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .copy { flex: none; width: 30px; height: 30px; margin-top: -3px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; color: var(--sub); cursor: pointer; transition: background .15s, color .15s; }
  .card-title:hover { color: var(--accent); }
  .card-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin-top: 6px; color: var(--sub); font-size: 12px; }
  .chip { max-width: 100%; padding: 1px 8px; border-radius: 6px; background: var(--surface-2); color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dot { width: 3px; height: 3px; border-radius: 50%; background: currentColor; opacity: .6; }
  .copy svg { width: 16px; height: 16px; }
  .copy:hover { background: var(--accent-soft); color: var(--accent); }
  .no-result { grid-column: 1 / -1; }
  @media (max-width: 640px) {
    .hero { padding-top: 32px; }
    .hero h1 { font-size: 26px; }
    .grid { grid-template-columns: 1fr; gap: 16px; }
    .search { max-width: none; }
  }
`

const LIST_SCRIPT = `
  (function () {
    var grid = document.getElementById('grid');
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
    var q = document.getElementById('q');
    var sort = document.getElementById('sort');
    var noResult = document.getElementById('no-result');
    var folder = '*';

    function apply() {
      var text = q.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var hit = (folder === '*' || c.dataset.folder === folder) && (!text || c.dataset.search.indexOf(text) !== -1);
        c.hidden = !hit;
        if (hit) shown++;
      });
      noResult.hidden = shown !== 0;
    }

    function reorder() {
      var by = sort.value;
      cards.sort(function (a, b) {
        if (by === 'name') return a.dataset.name.localeCompare(b.dataset.name, 'zh-CN');
        return Number(b.dataset.time) - Number(a.dataset.time);
      });
      cards.forEach(function (c) { grid.insertBefore(c, noResult); });
    }

    q.addEventListener('input', apply);
    sort.addEventListener('change', reorder);
    document.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t === tab); });
        folder = tab.dataset.folder;
        apply();
      });
    });
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.copy');
      if (!btn) return;
      var url = location.origin + btn.dataset.href;
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
        .then(function () { toast('链接已复制'); })
        .catch(function () { window.prompt('复制链接', url); });
    });
    reorder();
  })();
`

function renderPage(files?: DemoFile[]) {
  const now = Date.now()
  const content = !files
    ? '<p class="empty">Demo 列表加载失败，请稍后重试。</p>'
    : !files.length
      ? `<div class="empty">还没有 Demo，<a href="/demo-app/upload" style="color:var(--accent)">去上传</a>。</div>`
      : `${renderFolders(files)}
  <div class="grid" id="grid">
    ${files.map((file) => renderCard(file, now)).join('\n')}
    <p class="empty no-result" id="no-result" hidden>没有匹配的 Demo</p>
  </div>`

  return renderShell({
    title: PAGE_TITLE,
    css: LIST_CSS,
    actions: `<a class="btn primary" href="/demo-app/upload">${ICONS.upload}上传 Demo</a>`,
    body: `<main class="wrap">
  <section class="hero">
    <h1>${escapeHtml(PAGE_TITLE)}</h1>
    <p>MuseDAM 产品演示原型合集${files ? ` · 共 ${files.length} 个` : ''}，点击卡片在新标签页打开。</p>
    ${
      files?.length
        ? `<div class="toolbar">
      <label class="search">${ICONS.search}<input class="field" id="q" type="search" placeholder="搜索 Demo 名称或目录" autocomplete="off"></label>
      <select class="field" id="sort" aria-label="排序">
        <option value="time">最近更新</option>
        <option value="name">按名称</option>
      </select>
    </div>`
        : ''
    }
  </section>
  ${content}
</main>`,
    script: files?.length ? LIST_SCRIPT : '',
  })
}

export async function GET(request: NextRequest) {
  const user = await getDemoViewer()
  if (!user) return loginRedirect(request)
  if (!isMuseSale(user)) return forbiddenResponse()

  try {
    const files = await listDemoFiles()
    return new NextResponse(renderPage(files), { headers: PAGE_HEADERS })
  } catch (error) {
    console.error('demo-app list error:', error)
    return new NextResponse(renderPage(), { status: 502, headers: PAGE_HEADERS })
  }
}
