import { NextRequest, NextResponse } from 'next/server'

import {
  escapeHtml,
  forbiddenResponse,
  getDemoViewer,
  isMuseSale,
  loginRedirect,
  PAGE_HEADERS,
} from './access'
import {
  assembleTempUpload,
  deleteDemoFile,
  deleteTempUpload,
  isSafeSegment,
  listDemoFiles,
  MAX_DEMO_BYTES,
  putDemoFile,
  putTempChunk,
  UPLOAD_ID_RE,
  type DemoFile,
} from './storage'

export const dynamic = 'force-dynamic'

const HTML_FILE_RE = /\.html?$/i

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function formatDate(date?: Date) {
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
function parsePath(value: string) {
  const segments = value
    .trim()
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean)
  return segments.every(isSafeSegment) ? segments : null
}

function groupByFolder(files: DemoFile[]) {
  const groups = new Map<string, DemoFile[]>()
  for (const file of files) {
    const idx = file.path.lastIndexOf('/')
    const folder = idx === -1 ? '' : file.path.slice(0, idx)
    groups.set(folder, [...(groups.get(folder) ?? []), file])
  }
  return [...groups.entries()]
}

function renderList(files: DemoFile[]) {
  if (!files.length) return '<p class="empty">暂无 Demo。</p>'
  return groupByFolder(files)
    .map(([folder, items]) => {
      const rows = items
        .map((file) => {
          const name = file.path.slice(file.path.lastIndexOf('/') + 1).replace(HTML_FILE_RE, '')
          const href = `/demo-app/${file.path.split('/').map(encodeURIComponent).join('/')}`
          const del = `<form method="post" data-name="${escapeHtml(file.path)}" onsubmit="return confirm('确定删除 ' + this.dataset.name + '？')"><input type="hidden" name="action" value="delete"><input type="hidden" name="path" value="${escapeHtml(file.path)}"><button class="link danger">删除</button></form>`
          return `<li data-search="${escapeHtml(file.path.toLowerCase())}">
  <a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(name)}</a>
  <span class="meta">${formatSize(file.size)} · ${formatDate(file.lastModified)}${del}</span>
</li>`
        })
        .join('\n')
      return `<section>
  <h2>${escapeHtml(folder || '根目录')}<span>${items.length}</span></h2>
  <ul>${rows}</ul>
</section>`
    })
    .join('\n')
}

function renderUpload() {
  return `<form id="upload-form" class="upload" method="post" enctype="multipart/form-data">
  <input type="hidden" name="action" value="upload">
  <input type="file" name="files" accept=".html,.htm" multiple required>
  <input type="text" name="folder" placeholder="目录（可选，如 AI识别对象）">
  <button type="submit">上传</button>
  <p class="hint">仅支持 .html / .htm，单文件不超过 64 MB；同名文件会被覆盖。大文件会自动分片上传。</p>
</form>`
}

function renderPage({ files, message }: { files?: DemoFile[]; message?: string }) {
  const body = files ? renderList(files) : '<p class="empty">Demo 列表加载失败，请稍后重试。</p>'
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>MuseDAM Demo</title>
<style>
  :root { color-scheme: light; --bg: #f7f9fc; --card: #fff; --ink: #2e3a59; --sub: #8f9bb3; --line: #e4e9f2; --accent: #3366ff; --danger: #ff3d71; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 14px/1.6 -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; }
  main { max-width: 960px; margin: 0 auto; padding: 40px 16px 80px; }
  header { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 16px; }
  h1 { margin: 0; font-size: 24px; }
  h1 span { color: var(--sub); font-size: 14px; font-weight: 400; margin-left: 8px; }
  input[type="search"], input[type="text"] { height: 36px; padding: 0 12px; border: 1px solid var(--line); border-radius: 8px; font: inherit; background: #fff; }
  input:focus { outline: none; border-color: var(--accent); }
  #q { margin-left: auto; width: 260px; max-width: 100%; }
  button { height: 36px; padding: 0 16px; border: 0; border-radius: 8px; background: var(--accent); color: #fff; font: inherit; cursor: pointer; }
  button.link { height: auto; padding: 0; background: none; color: var(--accent); }
  button.danger { color: var(--danger); }
  .upload { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; background: var(--card); border: 1px dashed var(--line); border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; }
  .upload .hint { flex-basis: 100%; margin: 0; }
  .message { padding: 10px 16px; border-radius: 8px; background: #e6f0ff; margin-bottom: 16px; }
  section { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; }
  h2 { margin: 0 0 8px; font-size: 15px; }
  h2 span { color: var(--sub); font-weight: 400; margin-left: 8px; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 16px; padding: 10px 0; border-top: 1px solid var(--line); }
  li:first-child { border-top: 0; }
  li form { display: inline; margin-left: 12px; }
  a { color: var(--accent); text-decoration: none; word-break: break-all; }
  a:hover { text-decoration: underline; }
  .meta, .empty, .hint { color: var(--sub); }
  [hidden] { display: none !important; }
</style>
</head>
<body>
<main>
  <header>
    <h1>MuseDAM Demo${files ? `<span>共 ${files.length} 个</span>` : ''}</h1>
    <input id="q" type="search" placeholder="搜索 Demo" autocomplete="off">
  </header>
  ${message ? `<p class="message">${escapeHtml(message)}</p>` : ''}
  ${renderUpload()}
  ${body}
</main>
<script>
  document.getElementById('q').addEventListener('input', function (e) {
    var q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('section').forEach(function (s) {
      var shown = 0;
      s.querySelectorAll('li').forEach(function (li) {
        var hit = !q || li.dataset.search.indexOf(q) !== -1;
        li.hidden = !hit;
        if (hit) shown++;
      });
      s.hidden = shown === 0;
    });
  });

  (function () {
    var form = document.getElementById('upload-form');
    if (!form) return;
    var CHUNK = 256 * 1024;
    var MAX = 64 * 1024 * 1024;
    var button = form.querySelector('button[type="submit"]');

    async function postForm(data) {
      var res = await fetch('/demo-app', { method: 'POST', body: data, credentials: 'same-origin' });
      var body = {};
      try { body = await res.json(); } catch (e) {}
      if (!res.ok) {
        if (res.status === 413) throw new Error('文件过大，无法上传');
        throw new Error(body.error || '上传失败');
      }
      return body;
    }

    async function uploadOne(file, folder) {
      if (file.size > MAX) throw new Error(file.name + ' 超过 64 MB');
      var total = Math.max(1, Math.ceil(file.size / CHUNK));
      var id = crypto.randomUUID();
      for (var i = 0; i < total; i++) {
        var chunk = file.slice(i * CHUNK, Math.min(file.size, (i + 1) * CHUNK));
        var data = new FormData();
        data.append('action', 'upload-chunk');
        data.append('id', id);
        data.append('index', String(i));
        data.append('total', String(total));
        data.append('name', file.name);
        data.append('folder', folder);
        data.append('chunk', chunk, file.name);
        await postForm(data);
        if (button) button.textContent = '上传中 ' + (i + 1) + '/' + total;
      }
      var done = new FormData();
      done.append('action', 'upload-complete');
      done.append('id', id);
      done.append('total', String(total));
      done.append('name', file.name);
      done.append('folder', folder);
      await postForm(done);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var files = Array.prototype.slice.call(form.querySelector('[name="files"]').files);
      files = files.filter(function (f) { return f && f.size > 0; });
      if (!files.length) return;
      var folder = (form.querySelector('[name="folder"]') || {}).value || '';
      button.disabled = true;
      button.textContent = '上传中…';
      (async function () {
        for (var i = 0; i < files.length; i++) {
          button.textContent = '上传中 ' + (i + 1) + '/' + files.length;
          await uploadOne(files[i], folder);
        }
        location.href = '/demo-app?msg=' + encodeURIComponent('已上传 ' + files.map(function (f) { return f.name; }).join('、'));
      })().catch(function (err) {
        button.disabled = false;
        button.textContent = '上传';
        location.href = '/demo-app?msg=' + encodeURIComponent(err.message || '上传失败');
      });
    });
  })();
</script>
</body>
</html>`
}

export async function GET(request: NextRequest) {
  const user = await getDemoViewer()
  if (!user) return loginRedirect(request)
  if (!isMuseSale(user)) return forbiddenResponse()

  const message = request.nextUrl.searchParams.get('msg') ?? undefined
  try {
    const files = await listDemoFiles()
    return new NextResponse(renderPage({ files, message }), { headers: PAGE_HEADERS })
  } catch (error) {
    console.error('demo-app list error:', error)
    return new NextResponse(renderPage({ message }), {
      status: 502,
      headers: PAGE_HEADERS,
    })
  }
}

function redirectWithMessage(request: NextRequest, message: string) {
  const url = new URL('/demo-app', request.url)
  url.searchParams.set('msg', message)
  return NextResponse.redirect(url, 303)
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function parseUploadMeta(form: FormData) {
  const uploadId = String(form.get('id') ?? '')
  const total = Number(form.get('total'))
  const name = String(form.get('name') ?? '')
  const folder = parsePath(String(form.get('folder') ?? ''))
  if (!UPLOAD_ID_RE.test(uploadId)) return { error: '上传失败：会话无效' }
  if (!Number.isInteger(total) || total < 1 || total > 256) return { error: '上传失败：分片数量不合法' }
  if (!folder) return { error: '上传失败：目录名不合法' }
  if (!HTML_FILE_RE.test(name) || !isSafeSegment(name)) {
    return { error: '上传失败：仅支持 .html / .htm 文件' }
  }
  return { uploadId, total, name, folder }
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
        const body = await assembleTempUpload(meta.uploadId, meta.total)
        if (body.byteLength > MAX_DEMO_BYTES) return jsonError('上传失败：文件超过 64 MB')
        await putDemoFile([...meta.folder, meta.name], body)
      } finally {
        await deleteTempUpload(meta.uploadId).catch((error) => {
          console.error('demo-app temp cleanup error:', error)
        })
      }
      return NextResponse.json({ ok: true })
    }

    if (action === 'upload') {
      const folder = parsePath(String(form.get('folder') ?? ''))
      if (!folder) return redirectWithMessage(request, '上传失败：目录名不合法')
      const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
      if (!files.length) return redirectWithMessage(request, '上传失败：请选择文件')

      const invalid = files.filter((f) => !HTML_FILE_RE.test(f.name) || !isSafeSegment(f.name))
      if (invalid.length) {
        return redirectWithMessage(
          request,
          `上传失败：仅支持 .html / .htm 文件（${invalid.map((f) => f.name).join('、')}）`,
        )
      }
      if (files.some((f) => f.size > MAX_DEMO_BYTES)) {
        return redirectWithMessage(request, '上传失败：单文件不超过 64 MB')
      }

      for (const file of files) {
        await putDemoFile([...folder, file.name], new Uint8Array(await file.arrayBuffer()))
      }
      return redirectWithMessage(request, `已上传 ${files.map((f) => f.name).join('、')}`)
    }

    return new NextResponse('Bad Request', { status: 400 })
  } catch (error) {
    console.error('demo-app upload error:', error)
    if (action === 'upload-chunk' || action === 'upload-complete') {
      return jsonError('操作失败，请稍后重试', 500)
    }
    return redirectWithMessage(request, '操作失败，请稍后重试')
  }
}
