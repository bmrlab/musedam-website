import { NextRequest, NextResponse } from 'next/server'

import {
  escapeHtml,
  forbiddenResponse,
  getDemoViewer,
  isMuseSale,
  loginRedirect,
  PAGE_HEADERS,
} from '../access'
import {
  buildCatalog,
  GROUPS,
  moduleFolder,
  moduleKey,
  parseModule,
  parseRelease,
  releaseFor,
  SKU_REGISTRY,
  type DemoModule,
  type ModuleRelease,
  type ReleaseInfo,
} from '../catalog'
import { MODULE_ICONS, moduleIcon, moduleIconId } from '../module-icons'
import {
  assembleTempUpload,
  deleteDemoFile,
  deleteTempUpload,
  isSafeSegment,
  listDemoFiles,
  listModuleReleases,
  MAX_DEMO_BYTES,
  parseDemoUrl,
  putDemoFile,
  putDemoLink,
  putModuleRelease,
  putTempChunk,
  UPLOAD_ID_RE,
  type DemoFile,
} from '../storage'
import {
  demoName,
  formatDate,
  HTML_FILE_RE,
  ICONS,
  parsePath,
  releaseTag,
  renderShell,
  scriptJson,
  skuTags,
  UI,
} from '../ui'

export const dynamic = 'force-dynamic'

const UPLOAD_PATH = '/demo-app/upload'

const UPLOAD_SCRIPT = `
  (function () {
    var form = document.getElementById('upload-form');
    var input = form.querySelector('[name="files"]');
    var drop = document.getElementById('drop');
    var list = document.getElementById('picked');
    var button = document.getElementById('submit');
    var source = form.querySelector('[name="source"]');
    var linkFields = document.getElementById('link-fields');
    var linkName = form.querySelector('[name="linkName"]'), linkUrl = form.querySelector('[name="url"]');
    function syncSource() {
      var isLink = source.value === 'link';
      drop.hidden = isLink; list.hidden = isLink; linkFields.hidden = !isLink;
      input.disabled = isLink; linkName.disabled = !isLink; linkUrl.disabled = !isLink;
      button.textContent = isLink ? '保存链接' : '开始上传';
      button.disabled = !isLink && !files.length;
    }
    source.addEventListener('change', syncSource);
    var CHUNK = 256 * 1024;
    var MAX = ${MAX_DEMO_BYTES};
    var files = [], uploading = false;

    function fmt(n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }

    function render() {
      list.innerHTML = '';
      files.forEach(function (f) {
        var li = document.createElement('li');
        li.className = 'flex flex-wrap items-center gap-3 rounded-md bg-[var(--bg)] p-3';
        li.innerHTML = '<span class="n min-w-0 flex-1 break-all"></span><span class="s text-xs text-[var(--sub)]"></span><progress class="bar h-2 w-24 accent-[var(--accent)]" max="100" value="0"></progress>';
        li.querySelector('.n').textContent = f.name;
        li.querySelector('.s').textContent = fmt(f.size);
        f._li = li;
        list.appendChild(li);
      });
      button.disabled = source.value !== 'link' && !files.length;
    }

    function pick(fileList) {
      if(uploading) return;
      files = Array.prototype.filter.call(fileList, function (f) { return f && f.size > 0 && /\\.html?$/i.test(f.name); });
      if (fileList.length && !files.length) toast('仅支持 .html / .htm 文件');
      render();
    }

    var modules = JSON.parse(document.getElementById('module-data').textContent);
    var groupInput = form.querySelector('[name="group"]'), moduleInput = form.querySelector('[name="module"]'), skuInput = form.querySelector('[name="skus"]');
    var statusInput=form.querySelector('[name="status"]'), dateInput=form.querySelector('[name="releaseDate"]');
    function syncRelease(){var roadmap=statusInput.value==='roadmap';document.getElementById('release-date-row').hidden=!roadmap;dateInput.disabled=!roadmap;if(!roadmap)dateInput.value='';}
    statusInput.addEventListener('change',syncRelease);
    var iconRegistry=JSON.parse(document.getElementById('icon-data').textContent);
    function syncIcon(){var selected=form.querySelector('[name="icon"]:checked').value;var current=modules.find(function(m){return m.group===groupInput.value && m.name===moduleInput.value.trim()});var id=selected || (current && current.resolvedIcon) || 'folder';document.getElementById('icon-preview').innerHTML=iconRegistry[id].svg;document.getElementById('icon-label').textContent=selected?iconRegistry[id].label:'自动匹配模块图标';}
    function setIcon(value){var radio=Array.from(form.querySelectorAll('[name="icon"]')).find(function(input){return input.value===(value||'')});if(radio)radio.checked=true;syncIcon();}
    form.querySelectorAll('[name="icon"]').forEach(function(input){input.addEventListener('change',syncIcon)});
    function syncModules(clear) {
      if(clear) { moduleInput.value='';skuInput.value='';setIcon('');statusInput.value='roadmap';dateInput.value='';syncRelease(); }
      document.getElementById('modules').replaceChildren();
      modules.filter(function(m) {return m.group===groupInput.value}).forEach(function(m) {var o=document.createElement('option');o.value=m.name;document.getElementById('modules').appendChild(o)});
      document.getElementById('sku-row').hidden=groupInput.value!=='拓展模块';
      skuInput.required=groupInput.value==='拓展模块';
      if(groupInput.value!=='拓展模块')skuInput.value='';
    }
    function appendModule(data) { data.append('group',groupInput.value);data.append('module',moduleInput.value.trim());data.append('skus',skuInput.value.trim());data.append('status',statusInput.value);data.append('releaseDate',dateInput.value);data.append('icon',form.querySelector('[name="icon"]:checked').value); }
    groupInput.addEventListener('change',function(){syncModules(true)});
    moduleInput.addEventListener('input',function(){var m=modules.find(function(m){return m.group===groupInput.value && m.name===moduleInput.value.trim()});if(m){setIcon(m.icon || '');skuInput.value=m.skus.join(', ');statusInput.value=(m.release||{}).status||'roadmap';dateInput.value=(m.release||{}).releaseDate||'';syncRelease();}});
    syncModules(false);syncRelease();syncIcon();
    syncSource();
    document.getElementById('save-module').addEventListener('click',async function(){
      var linkMode=source.value==='link';linkName.disabled=true;linkUrl.disabled=true;
      var valid=form.reportValidity();linkName.disabled=!linkMode;linkUrl.disabled=!linkMode;
      if(!valid)return;
      var saveButton=this;saveButton.disabled=true;
      try {var data=new FormData();data.append('action','save-module');appendModule(data);await postForm(data);location.href='${UPLOAD_PATH}?module='+encodeURIComponent(groupInput.value+'/'+moduleInput.value.trim())+'&msg='+encodeURIComponent('模块信息已保存');}
      catch(error){toast(error.message||'保存失败');saveButton.disabled=false;}
    });

    input.addEventListener('change', function () { pick(input.files); });
    ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.remove('over'); }); });
    drop.addEventListener('drop', function (e) { e.preventDefault(); pick(e.dataTransfer.files); });

    async function postForm(data) {
      var res = await fetch('${UPLOAD_PATH}', { method: 'POST', body: data, credentials: 'same-origin' });
      var body = {};
      try { body = await res.json(); } catch (e) {}
      if (!res.ok) {
        if (res.status === 413) throw new Error('文件过大，无法上传');
        throw new Error(body.error || '上传失败');
      }
      return body;
    }

    async function uploadOne(file) {
      if (file.size > MAX) throw new Error(file.name + ' 超过 64 MB');
      var bar = file._li.querySelector('progress');
      var total = Math.max(1, Math.ceil(file.size / CHUNK));
      var id = crypto.randomUUID();
      for (var i = 0; i < total; i++) {
        var data = new FormData();
        data.append('action', 'upload-chunk');
        data.append('id', id);
        data.append('index', String(i));
        data.append('total', String(total));
        data.append('name', file.name);
        appendModule(data);
        data.append('chunk', file.slice(i * CHUNK, Math.min(file.size, (i + 1) * CHUNK)), file.name);
        await postForm(data);
        bar.value = Math.round(((i + 1) / total) * 95);
      }
      var done = new FormData();
      done.append('action', 'upload-complete');
      done.append('id', id);
      done.append('total', String(total));
      done.append('name', file.name);
      appendModule(done);
      await postForm(done);
      bar.value = 100;
      file._li.classList.add('done');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isLink = source.value === 'link';
      if (!isLink && !files.length) return;
      if (!form.reportValidity()) return;
      var fieldset = document.getElementById('classification');
      var selectedGroup = groupInput.value;
      if (selectedGroup === '拓展模块' && !skuInput.value.trim()) { toast('拓展模块需要选择或填写 SKU'); skuInput.focus(); return; }
      fieldset.disabled = true;
      uploading = true; input.disabled = true; source.disabled = true; linkName.readOnly = true; linkUrl.readOnly = true;
      button.disabled = true;
      (async function () {
        if (isLink) {
          button.textContent = '保存中…';
          var data = new FormData();data.append('action','save-link');appendModule(data);data.append('name',linkName.value.trim());data.append('url',linkUrl.value.trim());
          await postForm(data);
          location.href = '${UPLOAD_PATH}?msg=' + encodeURIComponent('原型链接已保存');
          return;
        }
        for (var i = 0; i < files.length; i++) {
          button.textContent = '上传中 ' + (i + 1) + '/' + files.length;
          try { await uploadOne(files[i]); }
          catch (err) { files[i]._li.classList.add('fail'); throw err; }
        }
        location.href = '${UPLOAD_PATH}?msg=' + encodeURIComponent('已上传 ' + files.map(function (f) { return f.name; }).join('、'));
      })().catch(function (err) {
        button.disabled = false;
        fieldset.disabled = false;
        uploading = false; source.disabled = false; linkName.readOnly = false; linkUrl.readOnly = false; syncSource();
        toast(err.message || '上传失败');
      });
    });
  })();
`

function renderManage(files: DemoFile[], releases: ModuleRelease[]) {
  const catalog = buildCatalog(files, releases)
  return `<div class="overflow-x-auto"><table class="w-full text-left"><thead class="text-xs text-[var(--sub)]"><tr><th class="p-3">原型 / 功能模块</th><th class="p-3">SKU</th><th class="p-3">更新时间</th><th class="p-3">操作</th></tr></thead><tbody>${catalog.files
    .sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0))
    .map(
      (file) =>
        `<tr class="border-t border-[var(--line)]"><td class="p-3"><a class="font-medium hover:text-[var(--accent)]" href="/demo-app/view?path=${encodeURIComponent(file.path)}">${escapeHtml(demoName(file))}</a><p class="text-xs text-[var(--sub)]">${escapeHtml(moduleKey(file.module))}</p></td><td class="p-3"><span class="flex flex-wrap gap-1">${skuTags(file.module.skus)}${releaseTag(releaseFor(file.module))}</span></td><td class="whitespace-nowrap p-3 text-xs text-[var(--sub)]">${formatDate(file.lastModified)}</td><td class="p-3"><form method="post" data-name="${escapeHtml(file.path)}" onsubmit="return confirm('确定删除 ' + this.dataset.name + '？')"><input type="hidden" name="action" value="delete"><input type="hidden" name="path" value="${escapeHtml(file.path)}"><button class="text-[var(--danger)]">删除</button></form></td></tr>`,
    )
    .join('')}</tbody></table></div>`
}

function renderPage({
  files,
  message,
  selected,
  releases,
}: {
  files: DemoFile[]
  releases: ModuleRelease[]
  message?: string
  selected?: string
}) {
  const catalog = buildCatalog(files, releases)
  const initial = catalog.modules.find((module) => moduleKey(module) === selected)
  const registry = [
    ...new Map(
      [
        ...SKU_REGISTRY,
        ...catalog.modules.flatMap((module) =>
          module.skus.map((code) => ({ code, name: module.name })),
        ),
      ].map((sku) => [sku.code, sku]),
    ).values(),
  ]
  return renderShell({
    title: '添加原型 · MuseDAM',
    actions: `<a class="${UI.button}" href="/demo-app">${ICONS.back}返回原型库</a>`,
    body: `<main class="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8"><div><p class="mb-2 text-[13px] text-[var(--sub)]">产品原型库 / 添加</p><h1 class="text-[22px] font-semibold leading-8">添加原型</h1><p class="mt-2 text-[var(--sub)]">先选择所属模块，再上传 HTML 或填写原型链接。新模块和 SKU 会随原型保存。</p></div>
    ${message ? `<p role="status" class="rounded-lg bg-[var(--accent-soft)] p-4">${escapeHtml(message)}</p>` : ''}
    <section class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6"><form id="upload-form" class="flex flex-col gap-6">
      <fieldset id="classification" class="flex min-w-0 flex-col gap-5"><legend class="mb-4 text-base font-semibold">所属模块</legend>
      <div class="flex flex-wrap gap-4"><label class="flex min-w-48 flex-1 flex-col gap-2 font-medium">一级目录<select name="group" class="${UI.field}">${GROUPS.map((group) => `<option${initial?.group === group ? ' selected' : ''}>${group}</option>`).join('')}</select></label>
      <label class="flex min-w-48 flex-1 flex-col gap-2 font-medium">功能模块<input class="${UI.field}" name="module" list="modules" maxlength="80" required value="${escapeHtml(initial?.name ?? '')}" placeholder="选择已有模块，或输入新模块名称" autocomplete="off"><datalist id="modules"></datalist></label></div>
      <label id="sku-row" class="flex flex-col gap-2 font-medium" ${initial?.group === '拓展模块' ? '' : 'hidden'}>SKU<input class="${UI.field}" name="skus" list="skus" maxlength="520" value="${escapeHtml(initial?.skus.join(', ') ?? '')}" placeholder="选择 SKU 或输入新编码，如 DAM-META" autocomplete="off"><datalist id="skus">${registry.map((sku) => `<option value="${escapeHtml(sku.code)}">${escapeHtml(sku.name)}</option>`).join('')}</datalist><span class="text-xs font-normal text-[var(--sub)]">支持新增 SKU；多个编码用逗号分隔。标准版与对客 demo 无需 SKU。</span></label>
      <div class="flex flex-wrap gap-4"><label class="flex min-w-48 flex-1 flex-col gap-2 font-medium">上线状态<select class="${UI.field}" name="status"><option value="live"${initial && releaseFor(initial).status === 'live' ? ' selected' : ''}>已上线</option><option value="roadmap"${!initial || releaseFor(initial).status === 'roadmap' ? ' selected' : ''}>路线图中</option></select></label><label id="release-date-row" class="flex min-w-48 flex-1 flex-col gap-2 font-medium">预计上线时间（选填）<input class="${UI.field}" name="releaseDate" type="date" value="${escapeHtml(initial ? (releaseFor(initial).releaseDate ?? '') : '')}"></label></div>
      <details class="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-4"><summary class="cursor-pointer"><span class="inline-flex items-center gap-3"><span id="icon-preview" class="flex size-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--tag-ink)] [&_svg]:size-5">${moduleIcon(initial ?? { group: '企业标准版', name: '', skus: [] })}</span><span class="flex flex-col"><span class="font-medium">模块图标</span><span id="icon-label" class="text-xs text-[var(--sub)]">自动匹配模块图标</span></span></span></summary><div class="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="模块图标">${[{ id: '', label: '自动匹配', svg: MODULE_ICONS.folder.svg }, ...Object.entries(MODULE_ICONS).map(([id, icon]) => ({ id, ...icon }))].map((icon) => `<label class="relative min-w-0 w-[calc(25%-6px)] cursor-pointer sm:w-[calc(16.666%-7px)]"><input class="peer sr-only" type="radio" name="icon" value="${icon.id}"${(initial?.icon ?? '') === icon.id ? ' checked' : ''}><span class="flex h-20 flex-col items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 text-center hover:border-[var(--accent)] peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent-soft)] peer-checked:text-[var(--tag-ink)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--accent)]"><span class="[&_svg]:size-5">${icon.svg}</span><span class="text-xs leading-4">${icon.label}</span></span></label>`).join('')}</div><p class="mt-3 text-xs text-[var(--sub)]">复用素材库图标；同一模块的目录、卡片与详情同步更新。</p></details>
      <div class="flex items-center gap-3"><button class="${UI.button}" id="save-module" type="button">保存模块信息</button><span class="text-xs text-[var(--sub)]">图标和状态可单独保存，无需重新上传 HTML。</span></div></fieldset>
      <label class="flex flex-col gap-2 font-medium">添加方式<select name="source" class="${UI.field}"><option value="html">上传 HTML</option><option value="link">填写链接</option></select></label>
      <fieldset id="link-fields" hidden class="flex min-w-0 flex-col gap-5"><label class="flex flex-col gap-2 font-medium">原型名称<input name="linkName" class="${UI.field}" maxlength="120" required disabled placeholder="例如：审批中心"></label><label class="flex flex-col gap-2 font-medium">原型链接<input name="url" class="${UI.field}" type="url" maxlength="4096" required disabled placeholder="https://musedam-approval.bybee.dev/approval-center"><span class="text-xs font-normal text-[var(--sub)]">支持 HTTP / HTTPS。若目标网站不允许嵌入预览，请使用独立打开。</span></label></fieldset>
      <label id="drop" class="relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed border-[var(--input-line)] bg-[var(--bg)] p-8 text-center hover:border-[var(--accent)] [&_svg]:size-8 [&_svg]:text-[var(--accent)]">${ICONS.upload}<strong>点击或拖拽 HTML 文件到这里</strong><span class="text-xs text-[var(--sub)]">支持多选 · .html / .htm · 单文件不超过 64 MB</span><input class="absolute inset-0 cursor-pointer opacity-0" type="file" name="files" accept=".html,.htm" multiple aria-label="选择 HTML 原型文件"></label>
      <ul id="picked" class="flex flex-col gap-2"></ul><div class="flex flex-wrap items-center gap-4"><button class="${UI.primary}" id="submit" type="submit" disabled>开始上传</button><p class="text-xs text-[var(--sub)]">同模块同名文件或链接会覆盖；目录仅展示同一原型的最新版本。</p></div>
    </form></section><section class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6"><h2 class="mb-4 text-base font-semibold">已添加原型 <span class="ml-2 text-[13px] font-normal text-[var(--sub)]">${catalog.files.length} 个 · ${catalog.archived} 个重复旧版本已折叠</span></h2>${renderManage(files, releases)}</section>
    <script id="icon-data" type="application/json">${scriptJson(MODULE_ICONS)}</script><script id="module-data" type="application/json">${scriptJson(catalog.modules.map((demoModule) => ({ ...demoModule, release: releaseFor(demoModule), resolvedIcon: moduleIconId(demoModule) })))}</script></main>`,
    script: UPLOAD_SCRIPT,
  })
}

export async function GET(request: NextRequest) {
  const user = await getDemoViewer()
  if (!user) return loginRedirect(request)
  if (!isMuseSale(user)) return forbiddenResponse('仅【Muse】销售可上传原型或编辑模块信息。')

  const message = request.nextUrl.searchParams.get('msg') ?? undefined
  try {
    const [files, releases] = await Promise.all([listDemoFiles(), listModuleReleases()])
    return new NextResponse(
      renderPage({
        files,
        releases,
        message,
        selected: request.nextUrl.searchParams.get('module') ?? undefined,
      }),
      { headers: PAGE_HEADERS },
    )
  } catch (error) {
    console.error('demo-app list error:', error)
    return new NextResponse(
      renderShell({
        title: '上传原型暂不可用',
        body: '<main class="p-8"><p role="alert">原型列表加载失败，请稍后重试。</p></main>',
      }),
      { status: 502, headers: PAGE_HEADERS },
    )
  }
}

function redirectWithMessage(request: NextRequest, message: string) {
  const url = new URL(UPLOAD_PATH, request.url)
  url.searchParams.set('msg', message)
  return NextResponse.redirect(url, 303)
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

type UploadMeta = {
  uploadId: string
  total: number
  name: string
  folder: string[]
  module: DemoModule
  release: ReleaseInfo
}

function parseUploadMeta(form: FormData): UploadMeta | { error: string } {
  const uploadId = String(form.get('id') ?? '')
  const total = Number(form.get('total'))
  const name = String(form.get('name') ?? '')
  const demoModule = parseModule(form)
  if ('error' in demoModule) return demoModule
  const release = parseRelease(form)
  if ('error' in release) return release
  const folder = parsePath(moduleFolder(demoModule))
  if (!UPLOAD_ID_RE.test(uploadId)) return { error: '上传失败：会话无效' }
  if (!Number.isInteger(total) || total < 1 || total > 256)
    return { error: '上传失败：分片数量不合法' }
  if (!folder) return { error: '上传失败：目录名不合法' }
  if (!HTML_FILE_RE.test(name) || !isSafeSegment(name)) {
    return { error: '上传失败：仅支持 .html / .htm 文件' }
  }
  return { uploadId, total, name, folder, module: demoModule, release }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (origin && new URL(origin).host !== host) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  const user = await getDemoViewer()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
  if (!isMuseSale(user)) return new NextResponse('Forbidden', { status: 403 })

  let action = ''
  try {
    const form = await request.formData()
    action = String(form.get('action') ?? '')

    if (action === 'save-link') {
      const demoModule = parseModule(form)
      if ('error' in demoModule) return jsonError(demoModule.error)
      const release = parseRelease(form)
      if ('error' in release) return jsonError(release.error)
      const name = String(form.get('name') ?? '').trim()
      const url = parseDemoUrl(String(form.get('url') ?? ''))
      if (!name || name.length > 120 || !isSafeSegment(name) || /[\x00-\x1f\x7f]/.test(name))
        return jsonError('请输入有效的原型名称（1–120 个字符，不能包含斜杠或控制字符）')
      if (!url) return jsonError('请输入有效的 HTTP / HTTPS 原型链接，不能包含用户名或密码')
      const [files, releases] = await Promise.all([listDemoFiles(), listModuleReleases()])
      const existing = buildCatalog(files, releases).modules.find(
        (item) => moduleKey(item) === moduleKey(demoModule),
      )
      if (existing && [...existing.skus].sort().join(',') !== demoModule.skus.join(','))
        return jsonError('该模块已有不同的 SKU，请选择现有编码或使用新的模块名称')
      await putDemoLink([...moduleFolder(demoModule).split('/'), `${name}.url.json`], url)
      await putModuleRelease(demoModule, release)
      return NextResponse.json({ ok: true })
    }

    if (action === 'save-module') {
      const demoModule = parseModule(form)
      if ('error' in demoModule) return jsonError(demoModule.error)
      const release = parseRelease(form)
      if ('error' in release) return jsonError(release.error)
      const [files, releases] = await Promise.all([listDemoFiles(), listModuleReleases()])
      const existing = buildCatalog(files, releases).modules.find(
        (item) => moduleKey(item) === moduleKey(demoModule),
      )
      if (existing && [...existing.skus].sort().join(',') !== demoModule.skus.join(','))
        return jsonError('该模块已有不同的 SKU，请选择现有编码或使用新的模块名称')
      await putModuleRelease(demoModule, release)
      return NextResponse.json({ ok: true })
    }

    if (action === 'delete') {
      const segments = parsePath(String(form.get('path') ?? ''))
      if (!segments?.length) return redirectWithMessage(request, '删除失败：路径不合法')
      await deleteDemoFile(segments)
      return redirectWithMessage(request, `已删除 ${segments.join('/')}`)
    }

    if (action === 'upload-chunk') {
      const meta = parseUploadMeta(form)
      if ('error' in meta) return jsonError(meta.error)
      const index = Number(form.get('index'))
      if (!Number.isInteger(index) || index < 0 || index >= meta.total) {
        return jsonError('上传失败：分片序号不合法')
      }
      const chunk = form.get('chunk')
      if (!(chunk instanceof File) || chunk.size <= 0 || chunk.size > 512 * 1024) {
        return jsonError('上传失败：分片无效')
      }
      await putTempChunk(meta.uploadId, index, new Uint8Array(await chunk.arrayBuffer()))
      return NextResponse.json({ ok: true })
    }

    if (action === 'upload-complete') {
      const meta = parseUploadMeta(form)
      if ('error' in meta) return jsonError(meta.error)
      try {
        const existing = buildCatalog(
          await listDemoFiles(),
          await listModuleReleases(),
        ).modules.find((module) => moduleKey(module) === moduleKey(meta.module))
        if (existing && [...existing.skus].sort().join(',') !== meta.module.skus.join(','))
          return jsonError('该模块已有不同的 SKU，请选择现有编码或使用新的模块名称')
        const body = await assembleTempUpload(meta.uploadId, meta.total)
        if (body.byteLength > MAX_DEMO_BYTES) return jsonError('上传失败：文件超过 64 MB')
        await putDemoFile([...meta.folder, meta.name], body)
        await putModuleRelease(meta.module, meta.release)
      } finally {
        await deleteTempUpload(meta.uploadId).catch((error) => {
          console.error('demo-app temp cleanup error:', error)
        })
      }
      return NextResponse.json({ ok: true })
    }

    return new NextResponse('Bad Request', { status: 400 })
  } catch (error) {
    console.error('demo-app upload error:', error)
    if (
      action === 'upload-chunk' ||
      action === 'upload-complete' ||
      action === 'save-module' ||
      action === 'save-link'
    ) {
      return jsonError('操作失败，请稍后重试', 500)
    }
    return redirectWithMessage(request, '操作失败，请稍后重试')
  }
}
