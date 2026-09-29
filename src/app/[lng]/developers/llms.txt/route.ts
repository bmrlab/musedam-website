import { getDeveloperPages } from '@/data/developers'
import { localizeDeveloperText } from '@/data/developers/localize'

export async function GET(request: Request, { params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  if (!['zh-CN', 'zh-TW', 'en-US'].includes(lng)) return new Response('Not found', { status: 404 })
  const base = `${new URL(request.url).origin}/${lng}/developers/markdown`
  const body = [
    '# MuseDAM Developers',
    lng === 'en-US'
      ? '> Official documentation for Open API, integrations and MCP. Read the relevant Markdown before changing code.'
      : localizeDeveloperText(
          '> MuseDAM 开放 API、第三方集成与 MCP 文档。修改代码前请先阅读对应 Markdown。',
          lng,
        ),
    localizeDeveloperText(`- [${lng === 'en-US' ? 'Overview' : '概览'}](${base}/landing.md)`, lng),
    ...getDeveloperPages(lng).map(
      (page) => `- [${page.title}](${base}/${page.slug}.md): ${page.description}`,
    ),
  ].join('\n\n')
  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  })
}
