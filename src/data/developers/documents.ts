import { localizeDeveloperText } from '@/data/developers/localize'

import { getDeveloperPages } from './index'

export function getDeveloperDocument(lng: string, slug: string) {
  const english = lng === 'en-US'
  const pages = getDeveloperPages(lng)
  if (slug !== 'landing') return pages.find((page) => page.slug === slug)
  return {
    slug,
    title: english ? 'MuseDAM Developer Platform' : localizeDeveloperText('MuseDAM 开放平台', lng),
    updatedAt: '2026-10-13',
    markdown: [
      english
        ? 'Connect your MuseDAM asset and product libraries using Open API, app integrations and MCP.'
        : localizeDeveloperText(
            '通过 Open API、第三方集成与 MCP 连接 MuseDAM 资产库与商品库。',
            lng,
          ),
      'Open API: https://open.musedam.cc/api/muse (cn) / https://open.musedam.ai/api/muse (overseas)',
      'Product Library API: https://open.musedam.cc/api/product',
      english
        ? 'For Product Library, start with Quick start for the service address, authorization and your first request. Use API documentation to find operations by resource and shared request rules. Use an existing MuseDAM API key with Authorization: Bearer <key>; a Product Library Manager must first add it as an API Key Collaborator. Access follows the collaborator role.'
        : localizeDeveloperText(
            '商品库接入时，请先阅读快速接入，了解服务地址、授权和首次请求；按资源查找接口及公共规则，请阅读接口文档。使用现有 MuseDAM API Key，通过 Authorization: Bearer <key> 认证；商品库管理员须先将密钥添加为 API Key Collaborator，访问权限由协作者角色决定。',
            lng,
          ),
      'App API: https://open.musedam.cc/api/apps (cn) / https://open.musedam.ai/api/apps (overseas)',
      'MCP: https://mcp-service.musedam.cc (cn) / https://mcp-service.musedam.cc?region=overseas (overseas)',
      english
        ? 'Read the relevant documents before implementation. Ask for their contents if they are unavailable.'
        : localizeDeveloperText(
            '请按业务目标阅读相关文档后再实现；无法访问时请要求用户提供对应文档内容。',
            lng,
          ),
      ...pages.map((page) => `- [${page.title}](./${page.slug}) — ${page.description}`),
    ].join('\n\n'),
  }
}

export function developerMarkdown(lng: string, slug: string, origin: string) {
  const page = getDeveloperDocument(lng, slug)
  if (!page) return undefined
  const base = `${origin.replace(/\/$/, '')}/${lng}/developers`
  const body = page.markdown.replace(/\]\((\.\/[^)]+|\/assets\/[^)]+)\)/g, (_, href: string) => {
    if (href.startsWith('./')) {
      const [name, hash] = href.slice(2).split('#')
      return `](${base}/markdown/${name}.md${hash ? `#${hash}` : ''})`
    }
    return `](${new URL(href, origin).href})`
  })
  return localizeDeveloperText(
    `# ${page.title}\n\n${lng === 'en-US' ? 'Last updated' : '最近更新'}: ${page.updatedAt}\n\n${body}\n`,
    lng,
  )
}
