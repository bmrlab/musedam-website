import { NextRequest, NextResponse } from 'next/server'

import {
  canViewDemoCatalog,
  escapeHtml,
  forbiddenResponse,
  getDemoViewer,
  isMuseSale,
  loginRedirect,
  PAGE_HEADERS,
} from './access'
import { buildCatalog, GROUPS, moduleKey, releaseFor, type CatalogFile } from './catalog'
import { MODULE_ICONS, moduleIcon, moduleIconId } from './module-icons'
import { listDemoFiles, listModuleReleases } from './storage'
import {
  demoHref,
  demoName,
  formatDate,
  formatSize,
  ICONS,
  RELEASE_CLASSES,
  releaseLabel,
  releaseTag,
  renderShell,
  scriptJson,
  skuTags,
  UI,
} from './ui'

export const dynamic = 'force-dynamic'

function row(file: CatalogFile) {
  const title = demoName(file)
  const href = escapeHtml(demoHref(file))
  const iconColors = [
    'from-cyan-400/20 to-blue-500/15 text-cyan-300 ring-cyan-300/20',
    'from-violet-400/20 to-fuchsia-500/15 text-violet-300 ring-violet-300/20',
    'from-pink-400/20 to-rose-500/15 text-pink-300 ring-pink-300/20',
    'from-amber-400/20 to-orange-500/15 text-amber-300 ring-amber-300/20',
    'from-teal-400/20 to-cyan-500/15 text-teal-300 ring-teal-300/20',
  ]
  const iconColor =
    iconColors[
      Array.from(moduleKey(file.module)).reduce((sum, c) => sum + c.charCodeAt(0), 0) %
        iconColors.length
    ]
  const skus = file.module.skus.join(' · ')
  return `<article role="row" class="group flex w-full bg-[var(--surface)] items-center gap-4 border-t border-[var(--line)] px-4 py-3 transition-colors hover:bg-[var(--hover)] focus-within:bg-[var(--hover)]" data-card data-module="${escapeHtml(moduleKey(file.module))}" data-group="${file.module.group}" data-search="${escapeHtml([title, file.module.name, file.module.group, ...file.module.skus].join(' ').toLowerCase())}" data-time="${file.lastModified?.getTime() ?? 0}">
    <div role="cell" class="flex min-w-0 flex-1 items-center gap-3"><span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ring-1 ring-inset ${iconColor} [&_svg]:size-5">${moduleIcon(file.module)}</span><div class="min-w-0 flex-1"><a class="block truncate font-medium hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2" href="${href}" data-preview data-title="${escapeHtml(title)}" title="${escapeHtml(title)}">${escapeHtml(title)}</a><p class="truncate text-xs leading-5 text-[var(--sub)]">${escapeHtml(file.module.name)}<span class="xl:hidden">${skus ? ` · ${escapeHtml(skus)}` : ''}</span></p><span class="lg:hidden">${releaseTag(releaseFor(file.module))}</span></div></div>
    <div role="cell" class="hidden w-44 shrink-0 flex-wrap gap-1 xl:flex">${file.module.skus.length ? skuTags(file.module.skus) : '<span class="text-xs text-[var(--sub)]">—</span>'}</div>
    <div role="cell" class="hidden w-36 shrink-0 lg:block">${releaseTag(releaseFor(file.module))}</div>
    <div role="cell" class="hidden w-24 shrink-0 text-xs leading-5 text-[var(--sub)] lg:block"><time>${formatDate(file.lastModified).slice(0, 10)}</time><p>${formatSize(file.size)}</p></div>
    <div role="cell" class="flex w-16 shrink-0 items-center justify-end gap-1"><button class="flex size-8 items-center justify-center rounded-md text-[var(--sub)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] [&_svg]:size-4" data-copy="${href}" title="复制独立链接" aria-label="复制 ${escapeHtml(title)} 的独立链接">${ICONS.link}</button><a class="flex size-8 items-center justify-center rounded-md text-[var(--sub)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] [&_svg]:size-4" href="${href}" target="_blank" rel="noopener" title="独立打开" aria-label="独立打开 ${escapeHtml(title)}">${ICONS.open}</a></div>
  </article>`
}

const SCRIPT = `
(function () {
  var q = document.getElementById('q'), grid = document.getElementById('grid'), cards = Array.from(document.querySelectorAll('[data-card]'));
  var links = Array.from(document.querySelectorAll('[data-filter]')), title = document.getElementById('module-title'), tags = document.getElementById('module-skus');
  var selection = '', group = '', current = null;
  var moduleIcons=JSON.parse(document.getElementById('module-icon-data').textContent);
  var nav = document.getElementById('catalog-nav'), navToggle = document.getElementById('toggle-navigation');
  navToggle.addEventListener('click',function(){var open=nav.classList.contains('hidden');nav.classList.toggle('hidden',!open);navToggle.setAttribute('aria-expanded',String(open));});
  function apply() {
    var query = q.value.trim().toLowerCase(), count = 0;
    cards.forEach(function(card) { card.hidden = !!((selection && card.dataset.module !== selection) || (group && card.dataset.group !== group) || (query && !card.dataset.search.includes(query))); if (!card.hidden) count++; });
    document.getElementById('count').textContent = count + ' 个原型';
    document.getElementById('empty').hidden = count !== 0;
    document.getElementById('empty-title').textContent = query ? '没有找到匹配的原型' : '该模块还没有原型';
    links.forEach(function(link) { var active = link === current; link.setAttribute('aria-current', active ? 'page' : 'false'); });
    document.querySelectorAll('[data-module-node]').forEach(function(node) { node.hidden = !!(query && !node.dataset.search.includes(query) && !cards.some(function(c) {return c.dataset.module === node.dataset.moduleNode && c.dataset.search.includes(query)})); });
    document.querySelectorAll('[data-category]').forEach(function(node) { node.hidden = !!(query && !Array.from(node.querySelectorAll('[data-module-node]')).some(function(m) {return !m.hidden})); if(query) node.open=true; });
  }
  links.forEach(function(link) { link.addEventListener('click', function() {
    if(window.innerWidth<768){nav.classList.add('hidden');navToggle.setAttribute('aria-expanded','false');}
    document.getElementById('module-icon').innerHTML=moduleIcons[link.dataset.icon || 'grid'].svg;
    current=link; selection=link.dataset.module || ''; group=link.dataset.group || ''; title.textContent=link.dataset.title; tags.textContent='';
    (link.dataset.skus || '').split(',').filter(Boolean).forEach(function(sku) { var tag=document.createElement('span'); tag.className='${UI.tag}';tag.textContent=sku;tags.appendChild(tag); });
    var release=document.getElementById('module-release');release.textContent='';
    if(link.dataset.status){var badge=document.createElement('span');badge.className=link.dataset.status==='live'?'${RELEASE_CLASSES.live}':'${RELEASE_CLASSES.roadmap}';badge.textContent=link.dataset.releaseLabel;release.appendChild(badge);}
    var edit=document.getElementById('edit-release');if(edit){edit.hidden=!selection;edit.href='/demo-app/upload?module='+encodeURIComponent(selection);}
    document.getElementById('breadcrumb').textContent=group || (selection ? selection.split('/')[0] : '产品原型库');
    var url=new URL(location.href); if(selection)url.searchParams.set('module',selection); else url.searchParams.delete('module'); if(group)url.searchParams.set('group',group);else url.searchParams.delete('group'); history.replaceState(null,'',url);
    var upload=document.getElementById('upload-link');if(upload){upload.href='/demo-app/upload' + (selection ? '?module='+encodeURIComponent(selection) : '');document.querySelector('#empty a').href=upload.href;} apply();
  }); });
  q.addEventListener('input',apply);
  document.getElementById('sort').addEventListener('change',function(e) { cards.sort(function(a,b) {return e.target.value==='name' ? a.dataset.search.localeCompare(b.dataset.search,'zh-CN') : Number(b.dataset.time)-Number(a.dataset.time)});cards.forEach(function(c){grid.insertBefore(c,document.getElementById('empty'))}); });
  var preview=document.getElementById('prototype-preview'), frame=document.getElementById('preview-frame'), previousFocus=null, previousOverflow='';
  document.getElementById('close-preview').addEventListener('click',function(){preview.close();});
  preview.addEventListener('close',function(){frame.src='about:blank';document.body.style.overflow=previousOverflow;if(previousFocus)previousFocus.focus({preventScroll:true});});
  grid.addEventListener('click',function(e){var link=e.target.closest('[data-preview]');if(!link || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)return;e.preventDefault();previousFocus=link;previousOverflow=document.body.style.overflow;document.getElementById('preview-title').textContent=link.dataset.title;frame.title=link.dataset.title;frame.src=link.getAttribute('href');document.getElementById('preview-open').href=link.getAttribute('href');document.body.style.overflow='hidden';preview.showModal();});
  grid.addEventListener('click',function(e) { var button=e.target.closest('[data-copy]'); if(button) navigator.clipboard.writeText(location.origin+button.dataset.copy).then(function(){toast('链接已复制')}).catch(function(){toast('复制失败，请从地址栏复制链接')}); });
  var params=new URL(location.href).searchParams;
  var initial=links.find(function(link){return params.get('module') ? link.dataset.module===params.get('module') : params.get('group') ? link.dataset.group===params.get('group') : link.dataset.filter==='all'});
  if(initial)initial.click();else apply();
})();`

export async function GET(request: NextRequest) {
  const user = await getDemoViewer()
  if (!user) return loginRedirect(request)
  if (!canViewDemoCatalog(user)) return forbiddenResponse()
  const canEdit = isMuseSale(user)
  try {
    const [files, releases] = await Promise.all([listDemoFiles(), listModuleReleases()])
    const catalog = buildCatalog(files, releases)
    const nav = GROUPS.map((group) => {
      const modules = catalog.modules.filter((module) => module.group === group)
      return `<details open data-category class="group/category border-t border-[var(--line)] pt-3"><summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 font-semibold [&::-webkit-details-marker]:hidden"><span class="inline-flex items-center gap-2 [&_svg]:size-4">${MODULE_ICONS[group === '企业标准版' ? 'home' : group === '拓展模块' ? 'grid' : 'team'].svg}${group}</span><svg class="size-4 shrink-0 text-[var(--sub)] transition-transform group-open/category:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></summary><div class="ml-3 flex flex-col border-l border-[var(--line)] pb-2 pl-1"><button class="px-3 py-2 text-left text-[13px] text-[var(--sub)] hover:bg-[var(--hover)]" data-filter="group" data-group="${group}" data-title="${group}">查看全部</button>${modules
        .map((module) => {
          const count = catalog.files.filter(
            (file) => moduleKey(file.module) === moduleKey(module),
          ).length
          return `<div data-module-node="${escapeHtml(moduleKey(module))}" data-search="${escapeHtml([module.name, ...module.skus].join(' ').toLowerCase())}"><button class="group flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left hover:bg-[var(--hover)] aria-[current=page]:bg-[var(--accent-soft)] aria-[current=page]:text-[var(--accent)]" data-filter="module" data-module="${escapeHtml(moduleKey(module))}" data-title="${escapeHtml(module.name)}" data-icon="${moduleIconId(module)}" data-skus="${module.skus.join(',')}" data-status="${releaseFor(module).status}" data-release-label="${escapeHtml(releaseLabel(releaseFor(module)))}"><span class="flex w-full items-center gap-2"><span class="flex size-4 shrink-0 items-center justify-center text-[var(--sub)] group-aria-[current=page]:text-[var(--accent)] [&_svg]:size-4">${moduleIcon(module)}</span><span class="flex-1">${escapeHtml(module.name)}</span><span class="size-1.5 shrink-0 rounded-full ${releaseFor(module).status === 'live' ? 'bg-[var(--live-dot)]' : 'bg-[var(--roadmap-dot)]'}" title="${escapeHtml(releaseLabel(releaseFor(module)))}" aria-label="${escapeHtml(releaseLabel(releaseFor(module)))}"></span><span class="w-4 text-right text-xs text-[var(--sub)]">${count}</span></span><span class="flex flex-wrap gap-1 pl-6">${module.skus.length ? skuTags(module.skus) : ''}</span></button></div>`
        })
        .join('')}</div></details>`
    }).join('')
    return new NextResponse(
      renderShell({
        title: '产品原型库 · MuseDAM',
        actions: canEdit
          ? `<a id="upload-link" class="${UI.primary}" href="/demo-app/upload">${ICONS.upload}上传原型</a>`
          : '',
        body: `<div class="flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
      <aside class="border-b border-[var(--line)] bg-[var(--surface)] p-4 md:sticky md:top-16 md:h-[calc(100vh-64px)] md:w-64 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r"><button id="toggle-navigation" class="${UI.button} w-full md:hidden" aria-controls="catalog-nav" aria-expanded="false">浏览原型目录</button><nav id="catalog-nav" aria-label="原型目录" class="hidden flex-col gap-3 md:flex"><p class="px-3 text-xs text-[var(--sub)]">原型目录</p><button class="rounded-md px-3 py-2 text-left font-medium hover:bg-[var(--hover)] aria-[current=page]:bg-[var(--accent-soft)] aria-[current=page]:text-[var(--accent)]" data-filter="all" data-title="全部原型"><span class="inline-flex items-center gap-2 [&_svg]:size-4">${MODULE_ICONS.grid.svg}全部原型</span> <span class="float-right text-xs text-[var(--sub)]">${catalog.files.length}</span></button>${nav}</nav></aside>
      <main class="flex min-w-0 flex-1 flex-col gap-5 bg-[var(--bg)] p-4 md:p-6"><div class="flex items-start gap-3"><span id="module-icon" class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--accent-soft)] text-[var(--accent)] [&_svg]:size-5">${MODULE_ICONS.grid.svg}</span><div class="flex min-w-0 flex-1 flex-col gap-2"><p id="breadcrumb" class="text-[13px] leading-[18px] text-[var(--sub)]">产品原型库</p><div class="flex flex-wrap items-center gap-3"><h1 id="module-title" class="text-[22px] font-semibold leading-8">全部原型</h1><div id="module-skus" class="flex flex-wrap gap-1"></div><span id="module-release"></span>${canEdit ? `<a id="edit-release" hidden class="text-[13px] text-[var(--accent)]" href="/demo-app/upload">编辑状态</a>` : ''}</div></div></div>
      <div class="flex flex-wrap items-center gap-3"><label class="relative flex min-w-0 flex-1 items-center [&_svg]:absolute [&_svg]:left-3 [&_svg]:size-4 [&_svg]:text-[var(--sub)]">${ICONS.search}<input id="q" class="${UI.field} w-full pl-9" type="search" aria-label="搜索原型、功能模块或 SKU" placeholder="搜索原型、功能模块或 SKU" autocomplete="off"></label><select id="sort" aria-label="排序" class="${UI.field}"><option value="time">最近更新</option><option value="name">按名称</option></select><span id="count" class="whitespace-nowrap text-[13px] text-[var(--sub)]"></span></div>
      <div role="table" aria-label="交互原型列表" class="overflow-hidden rounded-lg border border-[var(--line)]"><div role="row" class="flex items-center gap-4 bg-[var(--bg)] px-4 py-3 text-xs text-[var(--sub)]"><div role="columnheader" class="min-w-0 flex-1">原型名称</div><div role="columnheader" class="hidden w-44 shrink-0 xl:block">SKU</div><div role="columnheader" class="hidden w-36 shrink-0 lg:block">状态</div><div role="columnheader" class="hidden w-24 shrink-0 lg:block">更新时间</div><div role="columnheader" class="w-16 shrink-0 text-right">操作</div></div><div id="grid" role="rowgroup">${[
        ...catalog.files,
      ]
        .sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0))
        .map(row)
        .join(
          '',
        )}<div id="empty" hidden class="flex w-full flex-col items-center gap-3 px-6 py-12"><h2 id="empty-title" class="font-semibold">该模块还没有原型</h2><p class="text-[var(--sub)]">${canEdit ? '试试其他关键词，或上传该模块的 HTML 原型。' : '试试其他关键词，或联系 Muse 销售上传原型。'}</p>${canEdit ? `<a class="${UI.button}" href="/demo-app/upload">上传原型</a>` : ''}</div></div></div></main></div><dialog id="prototype-preview" aria-labelledby="preview-title" class="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-[var(--surface)] p-0 text-[var(--ink)] backdrop:bg-black/40"><div class="flex h-full flex-col"><header class="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--line)] px-4"><h2 id="preview-title" class="min-w-0 flex-1 truncate font-semibold"></h2><a id="preview-open" class="${UI.button}" target="_blank" rel="noopener">${ICONS.open}<span class="hidden sm:inline">独立打开</span></a><button id="close-preview" autofocus class="flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--sub)] hover:bg-[var(--hover)] hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2" aria-label="关闭预览" title="关闭预览（Esc）"><svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><iframe id="preview-frame" class="min-h-0 w-full flex-1 border-0 bg-white" title="原型预览" allow="clipboard-write; fullscreen"></iframe></div></dialog><script id="module-icon-data" type="application/json">${scriptJson(MODULE_ICONS)}</script>`,
        script: SCRIPT,
      }),
      { headers: PAGE_HEADERS },
    )
  } catch (error) {
    console.error('demo-app list error:', error)
    return new NextResponse(
      renderShell({
        title: '原型库暂不可用',
        body: '<main class="p-8"><p role="alert">原型列表加载失败，请稍后重试。</p><a class="underline" href="/demo-app">重新加载</a></main>',
      }),
      { status: 502, headers: PAGE_HEADERS },
    )
  }
}
