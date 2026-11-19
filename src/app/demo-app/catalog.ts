import { MODULE_ICONS } from './module-icons'
import skuRegistry from './skus.json'
import type { DemoFile } from './storage'

export const GROUPS = ['企业标准版', '拓展模块', '对客demo'] as const
export type DemoGroup = (typeof GROUPS)[number]
export type ReleaseInfo = { status: 'live' | 'roadmap'; releaseDate?: string }
export type DemoModule = {
  group: DemoGroup
  name: string
  skus: string[]
  icon?: string
  release?: ReleaseInfo
}
export type ModuleRelease = { module: DemoModule; release: ReleaseInfo }
export type CatalogFile = DemoFile & { module: DemoModule }
export const SKU_REGISTRY = skuRegistry

// Sources: SKU workbook YnLEUH revision 1426 and product updates through 2026-11-18.
export const DEFAULT_MODULES: DemoModule[] = [
  ...[
    'AI 智能解析',
    '搜索同义词',
    '网页文章采集',
    '域名配置',
    '文件查重',
    '资产库通用设置',
    '关联素材',
    '暂存区',
  ].map((name) => ({ group: '企业标准版' as const, name, skus: [] })),
  { group: '拓展模块', name: '元数据自定义字段', skus: ['DAM-META'] },
  { group: '拓展模块', name: 'AI 自动打标引擎', skus: ['DAM-TAG'] },
  { group: '拓展模块', name: 'AI 识别对象', skus: ['DAM-FEAT'] },
  { group: '拓展模块', name: '特征库-自定义', skus: ['DAM-TAG-CUSTOM'] },
  { group: '拓展模块', name: '合规检测', skus: ['DAM-COMP'] },
  { group: '拓展模块', name: '品牌合规 Agent', skus: ['DAM-AGENT-BRAND'] },
  { group: '拓展模块', name: '门店巡检 Agent', skus: ['DAM-AGENT-STORE'] },
  {
    group: '拓展模块',
    name: '定时采集',
    skus: ['COLLECT-PIN', 'COLLECT-BEH', 'COLLECT-WB', 'COLLECT-MP'],
  },
  { group: '拓展模块', name: '资产数据分析', skus: ['DAM-STATS'] },
  { group: '拓展模块', name: '收文件', skus: ['DAM-INBOX'] },
  { group: '拓展模块', name: '水印', skus: ['DAM-WMARK'] },
  { group: '拓展模块', name: '达人库-达人管理', skus: ['KOL-BASE'] },
  { group: '对客demo', name: '汽车行业', skus: [] },
  { group: '对客demo', name: '综合演示', skus: [] },
]

export function moduleKey(module: DemoModule) {
  return `${module.group}/${module.name}`
}

export function releaseFor(demoModule: DemoModule): ReleaseInfo {
  if (demoModule.release) return demoModule.release
  const live =
    demoModule.skus.length > 0 &&
    demoModule.skus.every(
      (code) => SKU_REGISTRY.find((sku) => sku.code === code)?.status === 'live',
    )
  return { status: live ? 'live' : 'roadmap' }
}

export function parseRelease(form: FormData): ReleaseInfo | { error: string } {
  const status = String(form.get('status') ?? '')
  const releaseDate = String(form.get('releaseDate') ?? '').trim()
  if (status !== 'live' && status !== 'roadmap') return { error: '请选择已上线或路线图中' }
  if (status === 'live') return { status }
  if (
    releaseDate &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate) ||
      !Number.isFinite(Date.parse(releaseDate)) ||
      new Date(releaseDate).toISOString().slice(0, 10) !== releaseDate)
  )
    return { error: '请输入有效的预计上线日期' }
  return { status, ...(releaseDate ? { releaseDate } : {}) }
}

export function moduleFolder(module: DemoModule) {
  return `${moduleKey(module)}${module.skus.length ? ` [${module.skus.join(',')}]` : ''}`
}

export function classifyDemo(path: string): DemoModule {
  const [group, folder] = path.split('/')
  if (GROUPS.includes(group as DemoGroup) && folder && path.split('/').length >= 3) {
    const match = /^(.*?) \[([A-Z0-9,-]+)\]$/.exec(folder)
    return {
      group: group as DemoGroup,
      name: match?.[1] ?? folder,
      skus: match?.[2].split(',') ?? [],
    }
  }
  const rules: [RegExp, string][] = [
    [/^汽车\//, '汽车行业'],
    [/门店巡检/, '门店巡检 Agent'],
    [/品牌合规/, '品牌合规 Agent'],
    [/词库分组|合规检测/, '合规检测'],
    [/自定义特征库/, '特征库-自定义'],
    [/AI.?识别对象/, 'AI 识别对象'],
    [/AI自动打标|AI 自动打标/, 'AI 自动打标引擎'],
    [/元数据/, '元数据自定义字段'],
    [/AI智能解析/, 'AI 智能解析'],
    [/搜索同义词/, '搜索同义词'],
    [/网页文章采集/, '网页文章采集'],
    [/域名配置/, '域名配置'],
    [/文件查重|库内查重/, '文件查重'],
    [/通用设置|待入库必填/, '资产库通用设置'],
    [/关联素材/, '关联素材'],
    [/水印/, '水印'],
    [/达人/, '达人库-达人管理'],
    [/定时采集/, '定时采集'],
    [/资产数据分析/, '资产数据分析'],
    [/收文件/, '收文件'],
    [/暂存区/, '暂存区'],
  ]
  const name = rules.find(([rule]) => rule.test(path))?.[1] ?? '综合演示'
  return DEFAULT_MODULES.find((module) => module.name === name)!
}

function prototypeIdentity(path: string) {
  return path
    .split('/')
    .at(-1)!
    .replace(/\.html?$/i, '')
    .replace(/[_\s·]+/g, '-')
    .replace(/-?\(standalone\)/gi, '')
    .replace(/-?v\d+$/i, '')
    .replace(/-?(?:交互原型|演示|demo)$/i, '')
    .replace(/-+/g, '-')
    .toLowerCase()
}

function version(path: string) {
  return Number(/\bv(\d+)\.html?$/i.exec(path)?.[1] ?? 1)
}

export function buildCatalog(files: DemoFile[], releases: ModuleRelease[] = []) {
  const latest = new Map<string, CatalogFile>()
  const modules = new Map(DEFAULT_MODULES.map((module) => [moduleKey(module), module]))
  for (const file of files) {
    const demoModule = classifyDemo(file.path)
    modules.set(moduleKey(demoModule), demoModule)
    const key = `${moduleKey(demoModule)}/${prototypeIdentity(file.path)}`
    const previous = latest.get(key)
    if (
      !previous ||
      version(file.path) > version(previous.path) ||
      (version(file.path) === version(previous.path) &&
        (file.lastModified?.getTime() ?? 0) > (previous.lastModified?.getTime() ?? 0))
    ) {
      latest.set(key, { ...file, module: demoModule })
    }
  }
  for (const record of releases)
    modules.set(moduleKey(record.module), { ...record.module, release: record.release })
  return {
    files: [...latest.values()].map((file) => ({
      ...file,
      module: modules.get(moduleKey(file.module))!,
    })),
    modules: [...modules.values()].sort(
      (a, b) =>
        GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || a.name.localeCompare(b.name, 'zh-CN'),
    ),
    archived: files.length - latest.size,
  }
}

export function parseModule(form: FormData): DemoModule | { error: string } {
  const icon = String(form.get('icon') ?? '')
  if (icon && !Object.hasOwn(MODULE_ICONS, icon)) return { error: '请选择有效的模块图标' }
  const group = String(form.get('group') ?? '')
  const name = String(form.get('module') ?? '').trim()
  const skus = [
    ...new Set(
      String(form.get('skus') ?? '')
        .toUpperCase()
        .split(/[,，\s]+/)
        .filter(Boolean),
    ),
  ].sort()
  if (!GROUPS.includes(group as DemoGroup)) return { error: '请选择一级目录' }
  if (!name || name.length > 80 || /[\x00-\x1f/\\\[\]]/.test(name) || name.startsWith('.'))
    return { error: '功能模块名称须为 1–80 个字符，不能包含斜杠、方括号或控制字符' }
  if (
    skus.length > 8 ||
    skus.some((sku) => sku.length > 64 || !/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/.test(sku))
  )
    return { error: 'SKU 格式不正确，例如 DAM-META；最多选择 8 个' }
  if (group === '拓展模块' && !skus.length) return { error: '拓展模块至少需要一个 SKU' }
  if (group !== '拓展模块' && skus.length) return { error: 'SKU 仅用于拓展模块' }
  return { group: group as DemoGroup, name, skus, ...(icon ? { icon } : {}) }
}
