/* Isolated route tests/preview: no real accounts or external storage requests. */
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const assert = require('node:assert/strict')
const vm = require('node:vm')
const http = require('node:http')
const { AsyncLocalStorage } = require('node:async_hooks')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
const dir = path.join(root, 'src/app/demo-app')
const identity = new AsyncLocalStorage()
const sales = { isSale: true, businessRoles: ['muse'] }
const originalLoad = Module._load
Module._load = function (request, parent, ...rest) {
  if (request === '@/utilities/auth')
    return {
      getServerSession: async () =>
        identity.getStore() === undefined ? sales : identity.getStore(),
    }
  return originalLoad.call(this, request, parent, ...rest)
}
require.extensions['.ts'] = function (module, filename) {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  )
}
const objects = new Map()
const sdk = require('@aws-sdk/client-s3')
let storageFails = false
sdk.S3Client.prototype.send = async function (command) {
  if (storageFails) throw new Error('fixture storage unavailable')
  const { Key, Prefix, Body } = command.input
  switch (command.constructor.name) {
    case 'ListObjectsV2Command':
      return {
        Contents: [...objects]
          .filter(([key]) => key.startsWith(Prefix))
          .map(([Key, o]) => ({ Key, Size: o.size, LastModified: o.date })),
      }
    case 'GetObjectCommand': {
      const object = objects.get(Key)
      if (!object)
        throw new sdk.S3ServiceException({ name: 'NoSuchKey', $metadata: { httpStatusCode: 404 } })
      const bytes = object.file ? fs.readFileSync(object.file) : object.body
      return {
        Body: {
          transformToByteArray: async () => bytes,
          transformToWebStream: () =>
            new ReadableStream({
              start(c) {
                c.enqueue(bytes)
                c.close()
              },
            }),
        },
        ContentType: 'text/html; charset=utf-8',
        LastModified: object.date,
      }
    }
    case 'PutObjectCommand':
      objects.set(Key, { body: Body, size: Body.length, date: new Date() })
      return {}
    case 'DeleteObjectCommand':
      objects.delete(Key)
      return {}
    default:
      throw new Error(command.constructor.name)
  }
}
process.env.S3_BUCKET = 'demo-test-only'
process.env.S3_REGION = 'us-east-1'
process.env.S3_ACCESS_KEY_ID = 'fixture'
process.env.S3_SECRET_ACCESS_KEY = 'fixture'
const { NextRequest } = require('next/server')
const catalog = require(path.join(dir, 'catalog.ts'))
const moduleIcons = require(path.join(dir, 'module-icons.ts'))
const ui = require(path.join(dir, 'ui.ts'))
const list = require(path.join(dir, 'route.ts'))
const upload = require(path.join(dir, 'upload/route.ts'))
const viewer = require(path.join(dir, 'view/route.ts'))
const raw = require(path.join(dir, '[...path]/route.ts'))
function walk(folder) {
  if (!fs.existsSync(folder)) return []
  return fs
    .readdirSync(folder, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(folder, e.name))
        : /\.html?$/i.test(e.name)
          ? [path.join(folder, e.name)]
          : [],
    )
}
const source =
  process.env.DEMO_FIXTURE_DIR || path.join(require('node:os').homedir(), 'Downloads', '交互原型')
for (const file of walk(source)) {
  const name = path.basename(file),
    module = catalog.classifyDemo(file)
  const relative =
    name.startsWith('元数据') || name.startsWith('AI自动打标') ? `元数据/${name}` : name
  objects.set('demo-app/' + relative, {
    file,
    size: fs.statSync(file).size,
    date: fs.statSync(file).mtime,
  })
}
const fixtureHTML = Buffer.from(
  '<!doctype html><meta charset="utf-8"><h1>Isolated test prototype</h1>',
)
function seed(key, date = '2026-11-18') {
  objects.set('demo-app/' + key, {
    body: fixtureHTML,
    size: fixtureHTML.length,
    date: new Date(date),
  })
}
if (!objects.size) seed('AI识别对象.html')
seed('门店巡检 Agent 演示.html', '2026-10-20')
seed('元数据字段/元数据字段-元数据管理.html', '2026-11-10')
const request = (url = '/demo-app', options) =>
  new NextRequest('http://localhost:3101' + url, options)
function form(fields) {
  const f = new FormData()
  for (const [k, v] of Object.entries(fields)) f.set(k, v)
  return f
}
function syntax(html) {
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1])
}
async function post(fields, origin = 'http://localhost:3101') {
  return upload.POST(
    request('/demo-app/upload', {
      method: 'POST',
      headers: { host: 'localhost:3101', origin },
      body: form(fields),
    }),
  )
}
async function tests() {
  const files = [
    { path: '元数据/元数据字段-素材详情.html', size: 1, lastModified: new Date('2026-11-03') },
    { path: '元数据字段/元数据字段-素材详情.html', size: 2, lastModified: new Date('2026-11-10') },
    { path: '门店巡检 Agent 演示 v2.html', size: 3, lastModified: new Date('2026-11-02') },
    { path: '门店巡检 Agent 演示.html', size: 4, lastModified: new Date('2026-11-18') },
  ]
  const built = catalog.buildCatalog(files)
  assert.equal(built.files.length, 2)
  assert.equal(
    catalog.buildCatalog([
      { path: '资产数据分析 Demo.html', size: 1, lastModified: new Date('2026-10-20') },
      { path: '资产数据分析-交互原型.html', size: 2, lastModified: new Date('2026-10-30') },
    ]).files[0].size,
    2,
  )
  assert(built.files.some((f) => f.size === 2))
  assert(built.files.some((f) => f.size === 3))
  assert.equal(catalog.classifyDemo('汽车/库内查重-汽车.html').group, '对客demo')
  assert.equal(catalog.classifyDemo('域名配置 演示.html').group, '企业标准版')
  const module = catalog.parseModule(
    form({ group: '拓展模块', module: '新功能', skus: 'NEW-TEST' }),
  )
  assert.equal(catalog.classifyDemo(catalog.moduleFolder(module) + '/a.html').skus[0], 'NEW-TEST')
  assert('error' in catalog.parseModule(form({ group: '拓展模块', module: 'a', skus: '' })))
  assert('error' in catalog.parseModule(form({ group: '企业标准版', module: '../x', skus: '' })))
  assert('error' in catalog.parseModule(form({ group: '拓展模块', module: 'a', skus: '<script>' })))
  assert.equal((await identity.run(null, () => list.GET(request()))).status, 302)
  assert.equal((await identity.run({ isSale: false }, () => list.GET(request()))).status, 403)
  assert.equal((await identity.run(null, () => post({}))).status, 401)
  assert.equal((await identity.run({ isSale: false }, () => post({}))).status, 403)
  assert.equal((await post({}, 'https://evil.example')).status, 403)
  for (const user of [sales, { isSale: true, businessRoles: ['muse', 'pod'] }]) {
    const response = await identity.run(user, () => list.GET(request()))
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.match(html, /id="edit-release"/)
    assert.match(html, /id="upload-link"/)
    assert.equal((await identity.run(user, () => upload.GET(request()))).status, 200)
  }
  const pod = { isSale: true, businessRoles: ['pod'] }
  const podResponse = await identity.run(pod, () => list.GET(request()))
  assert.equal(podResponse.status, 200)
  const podHtml = await podResponse.text()
  assert.doesNotMatch(podHtml, /id="(?:edit-release|upload-link)"/)
  assert.doesNotMatch(podHtml, />上传原型<|>编辑状态</)
  syntax(podHtml)
  assert.equal((await identity.run(pod, () => upload.GET(request()))).status, 403)
  for (const action of ['save-module', 'upload-chunk', 'upload-complete', 'delete']) {
    assert.equal((await identity.run(pod, () => post({ action }))).status, 403)
  }
  for (const user of [
    { isSale: true, businessRoles: [] },
    { isSale: false, businessRoles: ['muse', 'pod'] },
  ]) {
    assert.equal((await identity.run(user, () => list.GET(request()))).status, 403)
    assert.equal((await identity.run(user, () => post({ action: 'save-module' }))).status, 403)
  }

  for (const route of [list, upload]) {
    const response = await route.GET(request())
    assert.equal(response.status, 200)
    syntax(await response.text())
  }
  const rawPath = '门店巡检 Agent 演示 v2.html'
  for (const method of ['GET', 'HEAD']) {
    const response = await identity.run(null, () =>
      raw[method](request('/demo-app/' + encodeURIComponent(rawPath) + '?v1only=1'), {
        params: Promise.resolve({ path: [rawPath] }),
      }),
    )
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('Content-Disposition'), 'inline')
    assert.match(response.headers.get('Content-Type'), /text\/html; charset=utf-8/)
    const policy = response.headers.get('Content-Security-Policy')
    assert.match(policy, /^sandbox /)
    assert(!policy.includes('allow-downloads'))
    assert(!policy.includes('allow-popups-to-escape-sandbox'))
    if (method === 'HEAD') assert.equal(await response.text(), '')
    else assert((await response.text()).length > 0)
  }
  for (const path of [
    ['.modules', 'secret.json'],
    ['..', 'secret.html'],
    ['archive.zip'],
    ['export.xlsx'],
  ]) {
    assert.equal(
      (await identity.run(null, () => raw.GET(request(), { params: Promise.resolve({ path }) })))
        .status,
      404,
    )
  }
  assert.equal((await identity.run(null, () => viewer.GET(request()))).status, 302)
  const unsafePath = await viewer.GET(request('/demo-app/view?path=../a.html'))
  assert.equal(unsafePath.status, 400)
  const view = await viewer.GET(
    request('/demo-app/view?path=' + encodeURIComponent('门店巡检 Agent 演示 v2.html')),
  )
  assert.match(await view.text(), /DAM-AGENT-STORE/)
  const id = '9c8bf350-89a4-4319-81de-f6bc2f1d2330'
  const meta = {
    id,
    total: '1',
    name: 'test.html',
    group: '拓展模块',
    module: '新增测试模块',
    skus: 'NEW-TEST',
    icon: 'team',
    status: 'roadmap',
    releaseDate: '2026-12-15',
  }
  assert.equal(
    (
      await post({
        ...meta,
        action: 'upload-chunk',
        index: '0',
        chunk: new File([fixtureHTML], 'test.html'),
      })
    ).status,
    200,
  )
  assert.equal((await post({ ...meta, action: 'upload-complete' })).status, 200)
  assert(objects.has('demo-app/拓展模块/新增测试模块 [NEW-TEST]/test.html'))
  assert(![...objects.keys()].some((k) => k.includes(id)))
  const html = await (await list.GET(request())).text()
  assert.match(html, /NEW-TEST/)
  const records = await require(path.join(dir, 'storage.ts')).listModuleReleases()
  assert.equal(records.find((r) => r.module.name === '新增测试模块').module.icon, 'team')
  assert.equal(
    moduleIcons.moduleIconId(catalog.classifyDemo('元数据字段-元数据管理.html')),
    'fields',
  )
  assert.equal(
    moduleIcons.moduleIconId({ name: 'constructor', skus: [], group: '企业标准版' }),
    'folder',
  )
  assert(
    'error' in catalog.parseModule(form({ group: '企业标准版', module: 'x', icon: 'constructor' })),
  )
  assert(
    'error' in
      catalog.parseModule(
        form({ group: '企业标准版', module: 'x', icon: '<svg onload=alert(1)>' }),
      ),
  )
  assert.deepEqual(JSON.parse(ui.scriptJson({ svg: moduleIcons.MODULE_ICONS.fields.svg })), {
    svg: moduleIcons.MODULE_ICONS.fields.svg,
  })

  assert.match(html, /新增测试模块/)
  assert.match(html, /路线图中 · 预计 2026-12-15/)
  assert('error' in catalog.parseRelease(form({ status: 'roadmap', releaseDate: '2026-02-31' })))
  assert('error' in catalog.parseRelease(form({ status: 'other' })))
  assert.deepEqual(catalog.parseRelease(form({ status: 'live', releaseDate: '2026-12-15' })), {
    status: 'live',
  })
  const releaseMeta = {
    icon: 'robot',
    group: '拓展模块',
    module: '水印',
    skus: 'DAM-WMARK',
    action: 'save-module',
  }
  assert.equal(
    (await post({ ...releaseMeta, status: 'roadmap', releaseDate: '2027-01-20' })).status,
    200,
  )
  assert.match(
    await (
      await viewer.GET(
        request(
          '/demo-app/view?path=' + encodeURIComponent('水印设置 · 水印设置 (standalone).html'),
        ),
      )
    ).text(),
    /预计 2027-01-20/,
  )
  assert.equal(catalog.DEFAULT_MODULES.find((m) => m.name === '水印').release, undefined)
  const iconView = await (
    await viewer.GET(
      request('/demo-app/view?path=' + encodeURIComponent('水印设置 · 水印设置 (standalone).html')),
    )
  ).text()
  assert(iconView.includes(moduleIcons.MODULE_ICONS.robot.svg))
  assert.equal(
    (await post({ ...releaseMeta, status: 'live', releaseDate: '2027-01-20' })).status,
    200,
  )
  const released = await (await list.GET(request())).text()
  assert.match(released, /已上线/)
  assert(!released.includes('2027-01-20'))
  assert.equal(
    (await post({ ...releaseMeta, status: 'roadmap', releaseDate: '2026-02-31' })).status,
    400,
  )

  const bad = await post({
    ...meta,
    action: 'upload-chunk',
    index: '2',
    chunk: new File([fixtureHTML], 'test.html'),
  })
  assert.equal(bad.status, 400)
  storageFails = true
  assert.equal((await list.GET(request())).status, 502)
  storageFails = false
  // The write above is test-only; do not keep test modules in the visual preview.
  objects.delete('demo-app/拓展模块/新增测试模块 [NEW-TEST]/test.html')
  for (const key of objects.keys()) if (key.startsWith('demo-app/.modules/')) objects.delete(key)
  console.log(
    'PASS: classification, latest versions, new module/SKU persistence, upload chunks, cleanup, auth, CSRF, invalid paths, roadmap date validation, module status/icon persistence, icon validation, live date cleanup, storage errors and inline JS syntax',
  )
}
async function serve() {
  http
    .createServer(async (req, res) => {
      try {
        const url = new URL(req.url, 'http://localhost:3101')
        if (url.pathname === '/demo-catalog.css') {
          res.setHeader('Content-Type', 'text/css')
          res.end(fs.readFileSync(path.join(root, 'public/demo-catalog.css')))
          return
        }
        const body = []
        for await (const chunk of req) body.push(chunk)
        const r = request(req.url, {
          method: req.method,
          headers: req.headers,
          ...(body.length ? { body: Buffer.concat(body) } : {}),
        })
        let response
        if (url.pathname === '/demo-app') response = await list.GET(r)
        else if (url.pathname === '/demo-app/upload')
          response = await (req.method === 'POST' ? upload.POST(r) : upload.GET(r))
        else if (url.pathname === '/demo-app/view') response = await viewer.GET(r)
        else if (url.pathname.startsWith('/demo-app/'))
          response = await raw.GET(r, {
            params: Promise.resolve({
              path: url.pathname.slice(10).split('/').map(decodeURIComponent),
            }),
          })
        else response = new Response('Not found', { status: 404 })
        res.writeHead(response.status, Object.fromEntries(response.headers))
        res.end(Buffer.from(await response.arrayBuffer()))
      } catch (e) {
        console.error(e)
        res.statusCode = 500
        res.end('Fixture preview error')
      }
    })
    .listen(3101, '127.0.0.1', () =>
      console.log(
        'Isolated route preview: http://localhost:3101/demo-app (mock sales session, local files and memory storage; no external writes)',
      ),
    )
}
tests()
  .then(() => (process.argv.includes('--serve') ? serve() : null))
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
