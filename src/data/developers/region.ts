/**
 * 开放平台文档按部署区域显示接口域名：国内站（DEPLOY_REGION=mainland）只显示 .cc，海外站（global）只显示 .ai。
 * 文档正文可以任意写国内或海外域名，渲染时统一换成当前区域的地址。
 * 只能在服务端调用（依赖运行时环境变量），客户端组件请由服务端传入 region。
 */
export type DeveloperRegion = 'cn' | 'overseas'

export const getDeveloperRegion = (): DeveloperRegion =>
  process.env.DEPLOY_REGION?.toLowerCase() === 'global' ? 'overseas' : 'cn'

const MCP_URL = 'https://mcp-service.musedam.cc'

/** 当前区域的接口地址 */
export const developerEndpoints = (region: DeveloperRegion) => ({
  openApi: region === 'overseas' ? 'https://open.musedam.ai' : 'https://open.musedam.cc',
  web: region === 'overseas' ? 'https://musedam.ai' : 'https://musedam.cc',
  // MCP 国内外共用一个服务，海外通过 region 参数区分
  mcp: region === 'overseas' ? `${MCP_URL}?region=overseas` : MCP_URL,
})

/** 把文本里的 Open API、MuseDAM 站点、MCP 地址换成指定区域 */
export function regionalizeDeveloperText(text: string, region: DeveloperRegion = getDeveloperRegion()) {
  if (region === 'overseas') {
    return (
      text
        .replace(/open\.musedam\.cc/g, 'open.musedam.ai')
        .replace(/\/\/musedam\.cc/g, '//musedam.ai')
        // MCP 服务根地址补上海外 region；已带参数或带路径（如 /health_check）的不动
        .replace(/https:\/\/mcp-service\.musedam\.cc(?![\w/?.-])/g, `${MCP_URL}?region=overseas`)
    )
  }
  return text
    .replace(/open\.musedam\.ai/g, 'open.musedam.cc')
    .replace(/\/\/musedam\.ai/g, '//musedam.cc')
    .replace(/(https:\/\/mcp-service\.musedam\.cc)\?region=overseas/g, '$1')
}

/** 只在国内提供的文档页（海外站不展示、直接访问返回 404） */
const MAINLAND_ONLY_PAGES = new Set(['product-library'])

export const isDeveloperPageAvailable = (slug: string, region: DeveloperRegion = getDeveloperRegion()) =>
  region !== 'overseas' || !MAINLAND_ONLY_PAGES.has(slug)

const regionBlock = (tag: string) => new RegExp(`\\n*<${tag}>[\\s\\S]*?</${tag}>`, 'g')

/**
 * 按区域取舍正文里的 <MainlandOnly> / <OverseasOnly> 片段（MDX 中由同名组件渲染，这里处理 pages*.json 的 Markdown）。
 * 返回保留下来的正文，以及被去掉的片段（用于同步去掉目录里的标题）。
 */
export function regionalizeDeveloperBlocks(text: string, region: DeveloperRegion = getDeveloperRegion()) {
  const drop = region === 'overseas' ? 'MainlandOnly' : 'OverseasOnly'
  const keep = region === 'overseas' ? 'OverseasOnly' : 'MainlandOnly'
  const removed = text.match(regionBlock(drop)) ?? []
  const markdown = text.replace(regionBlock(drop), '').replace(new RegExp(`</?${keep}>\\n?`, 'g'), '')
  return { markdown, removed: removed.join('\n') }
}
