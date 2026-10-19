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
} from '../storage'
import {
  demoFolder,
  demoHref,
  demoName,
  formatDate,
  formatSize,
  HTML_FILE_RE,
  ICONS,
  parsePath,
  renderShell,
} from '../ui'

export const dynamic = 'force-dynamic'

const UPLOAD_PATH = '/demo-app/upload'

const UPLOAD_CSS = `
  .page { padding-top: 40px; padding-bottom: 80px; }
  .page h1 { margin: 0; font-size: 26px; color: var(--ink); letter-spacing: -.01em; }
  .page > p { margin: 6px 0 0; color: var(--sub); }
  .panel { margin-top: 24px; padding: 24px; border-radius: 16px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); }
  .panel h2 { margin: 0 0 16px; font-size: 16px; color: var(--ink); }
  .panel h2 span { margin-left: 8px; color: var(--sub); font-weight: 400; font-size: 13px; }
  .drop { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 40px 16px; border: 1.5px dashed var(--line); border-radius: 14px; background: var(--bg); text-align: center; cursor: pointer; transition: border-color .15s, background .15s; }
  .drop:hover, .drop.over { border-color: var(--accent); background: var(--accent-soft); }
  .drop svg { width: 32px; height: 32px; color: var(--accent); }
  .drop strong { color: var(--ink); font-size: 15px; }
  .drop small { color: var(--sub); }
  .drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .picked { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 8px; }
  .picked li { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; background: var(--bg); }
  .picked .n { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink); }
  .picked .s { color: var(--sub); font-size: 12px; }
  .picked .bar { width: 120px; height: 6px; border-radius: 3px; background: var(--line); overflow: hidden; }
  .picked .bar i { display: block; height: 100%; width: 0; background: var(--accent); transition: width .2s; }
  .picked li.done .bar i { background: var(--ok); }
  .picked li.fail .bar i { background: var(--danger); width: 100%; }
  .row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
  .row .field { flex: 1 1 260px; }
  .hint { margin: 12px 0 0; color: var(--sub); font-size: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 12px 8px; border-top: 1px solid var(--line); text-align: left; vertical-align: middle; }
  th { border-top: 0; color: var(--sub); font-weight: 400; font-size: 12px; }
  td.name a { color: var(--ink); font-weight: 500; word-break: break-all; }
  td.name a:hover { color: var(--accent); }
  td.name small { display: block; color: var(--sub); font-size: 12px; }
  td.num { color: var(--sub); white-space: nowrap; font-size: 13px; }
  td.ops { text-align: right; white-space: nowrap; }
  .del { height: 30px; padding: 0 12px; border-radius: 8px; border: 0; background: transparent; color: var(--danger); cursor: pointer; }
  .del:hover { background: var(--danger-soft); }
  @media (max-width: 640px) {
    .panel { padding: 16px; }
    th.num, td.num { display: none; }
    .picked .bar { width: 64px; }
  }
`

const UPLOAD_SCRIPT = `
  (function () {
    var form = document.getElementById('upload-form');
    var input = form.querySelector('[name="files"]');
    var drop = document.getElementById('drop');
    var list = document.getElementById('picked');
    var button = document.getElementById('submit');
    var CHUNK = 256 * 1024;
    var MAX = ${MAX_DEMO_BYTES};
    var files = [];

    function fmt(n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }

    function render() {
      list.innerHTML = '';
      files.forEach(function (f) {
        var li = document.createElement('li');
        li.innerHTML = '<span class="n"></span><span class="s"></span><span class="bar"><i></i></span>';
        li.querySelector('.n').textContent = f.name;
        li.querySelector('.s').textContent = fmt(f.size);
        f._li = li;
        list.appendChild(li);
      });
      button.disabled = !files.length;
    }

    function pick(fileList) {
      files = Array.prototype.filter.call(fileList, function (f) { return f && f.size > 0 && /\\.html?$/i.test(f.name); });
      if (fileList.length && !files.length) toast('仅支持 .html / .htm 文件');
      render();
    }

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

    async function uploadOne(file, folder) {
      if (file.size > MAX) throw new Error(file.name + ' 超过 64 MB');
      var bar = file._li.querySelector('.bar i');
      var total = Math.max(1, Math.ceil(file.size / CHUNK));
      var id = crypto.randomUUID();
      for (var i = 0; i < total; i++) {
        var data = new FormData();
        data.append('action', 'upload-chunk');
        data.append('id', id);
        data.append('index', String(i));
        data.append('total', String(total));
        data.append('name', file.name);
        data.append('folder', folder);
        data.append('chunk', file.slice(i * CHUNK, Math.min(file.size, (i + 1) * CHUNK)), file.name);
        await postForm(data);
        bar.style.width = Math.round(((i + 1) / total) * 95) + '%';
      }
      var done = new FormData();
      done.append('action', 'upload-complete');
      done.append('id', id);
      done.append('total', String(total));
      done.append('name', file.name);
      done.append('folder', folder);
      await postForm(done);
      bar.style.width = '100%';
      file._li.classList.add('done');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!files.length) return;
      var folder = form.querySelector('[name="folder"]').value || '';
      button.disabled = true;
      (async function () {
        for (var i = 0; i < files.length; i++) {
          button.textContent = '上传中 ' + (i + 1) + '/' + files.length;
          try { await uploadOne(files[i], folder); }
          catch (err) { files[i]._li.classList.add('fail'); throw err; }
        }
        location.href = '${UPLOAD_PATH}?msg=' + encodeURIComponent('已上传 ' + files.map(function (f) { return f.name; }).join('、'));
      })().catch(function (err) {
        button.disabled = false;
        button.textContent = '开始上传';
        toast(err.message || '上传失败');
      });
    });
  })();
`

function renderManage(files?: DemoFile[]) {
  if (!files) return '<p class="empty">Demo 列表加载失败，请稍后重试。</p>'
  if (!files.length) return '<p class="empty">还没有上传任何 Demo。</p>'
  const rows = [...files]
    .sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0))
    .map((file) => {
      const folder = demoFolder(file)
      return `<tr>
  <td class="name"><a href="${escapeHtml(demoHref(file))}" target="_blank" rel="noopener">${escapeHtml(demoName(file))}</a>${folder ? `<small>${escapeHtml(folder)}</small>` : ''}</td>
  <td class="num">${formatSize(file.size)}</td>
  <td class="num">${formatDate(file.lastModified)}</td>
  <td class="ops"><form method="post" data-name="${escapeHtml(file.path)}" onsubmit="return confirm('确定删除 ' + this.dataset.name + '？')"><input type="hidden" name="action" value="delete"><input type="hidden" name="path" value="${escapeHtml(file.path)}"><button class="del">删除</button></form></td>
</tr>`
    })
    .join('\n')
  return `<table>
  <thead><tr><th>名称</th><th class="num">大小</th><th class="num">更新时间</th><th></th></tr></thead>
  <tbody>${rows}</tbody>
</table>`
}

function renderPage({ files, message }: { files?: DemoFile[]; message?: string }) {
  const folders = [...new Set((files ?? []).map(demoFolder).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'zh-CN'),
  )
  return renderShell({
    title: '上传 Demo · MuseDAM Demo Page',
    css: UPLOAD_CSS,
    actions: `<a class="btn" href="/demo-app">${ICONS.back}返回列表</a>`,
    body: `<main class="wrap page">
  <h1>上传 Demo</h1>
  <p>上传后即出现在 Demo 列表中，任意已登录用户可通过链接访问。</p>
  ${message ? `<p class="message">${escapeHtml(message)}</p>` : ''}
  <section class="panel">
    <form id="upload-form">
      <label class="drop" id="drop">
        ${ICONS.upload}
        <strong>点击或拖拽 HTML 文件到这里</strong>
        <small>支持多选 · 仅 .html / .htm · 单文件不超过 64 MB</small>
        <input type="file" name="files" accept=".html,.htm" multiple>
      </label>
      <ul class="picked" id="picked"></ul>
      <div class="row">
        <input class="field" type="text" name="folder" list="folders" placeholder="目录（可选，如 AI识别对象，多级用 / 分隔）" autocomplete="off">
        <datalist id="folders">${folders.map((f) => `<option value="${escapeHtml(f)}">`).join('')}</datalist>
        <button class="btn primary" id="submit" type="submit" disabled>开始上传</button>
      </div>
      <p class="hint">同目录下同名文件会被覆盖；大文件会自动分片上传。</p>
    </form>
  </section>
  <section class="panel">
    <h2>已上传${files ? `<span>${files.length} 个</span>` : ''}</h2>
    ${renderManage(files)}
  </section>
</main>`,
    script: UPLOAD_SCRIPT,
  })
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
    return new NextResponse(renderPage({ message }), { status: 502, headers: PAGE_HEADERS })
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

type UploadMeta = { uploadId: string; total: number; name: string; folder: string[] }

function parseUploadMeta(form: FormData): UploadMeta | { error: string } {
  const uploadId = String(form.get('id') ?? '')
  const total = Number(form.get('total'))
  const name = String(form.get('name') ?? '')
  const folder = parsePath(String(form.get('folder') ?? ''))
  if (!UPLOAD_ID_RE.test(uploadId)) return { error: '上传失败：会话无效' }
  if (!Number.isInteger(total) || total < 1 || total > 256)
    return { error: '上传失败：分片数量不合法' }
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

    return new NextResponse('Bad Request', { status: 400 })
  } catch (error) {
    console.error('demo-app upload error:', error)
    if (action === 'upload-chunk' || action === 'upload-complete') {
      return jsonError('操作失败，请稍后重试', 500)
    }
    return redirectWithMessage(request, '操作失败，请稍后重试')
  }
}
