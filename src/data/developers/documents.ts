import { localizeDeveloperText } from '@/data/developers/localize'

import { getDeveloperPages } from './index'

export function getDeveloperDocument(lng: string, slug: string) {
  const english = lng === 'en-US'
  const pages = getDeveloperPages(lng)
  if (slug !== 'landing') return pages.find((page) => page.slug === slug)
  return {
    slug,
    title: english ? 'MuseDAM Developer Platform' : localizeDeveloperText('MuseDAM 开放平台', lng),
    updatedAt: '2026-09-29',
    markdown: [
      english
        ? 'Connect your MuseDAM library using Open API, app integrations and MCP.'
        : localizeDeveloperText('通过 Open API、第三方集成与 MCP 连接 MuseDAM 资产库。', lng),
      'Open API: https://open.musedam.cc/api/muse (cn) / https://open.musedam.ai/api/muse (overseas)',
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
