import { developerMarkdown } from '@/data/developers/documents'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lng: string; document: string }> },
) {
  const { lng, document } = await params
  if (!['zh-CN', 'zh-TW', 'en-US'].includes(lng) || !document.endsWith('.md'))
    return new Response('Not found', { status: 404 })
  const markdown = developerMarkdown(lng, document.slice(0, -3), new URL(request.url).origin)
  return new Response(markdown ?? 'Not found', {
    status: markdown ? 200 : 404,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
