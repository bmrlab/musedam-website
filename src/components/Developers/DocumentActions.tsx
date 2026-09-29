import { localizeDeveloperText } from '@/data/developers/localize'
import getServerSideURL from '@/utilities/getServerSideURL'

import { PromptDialog } from './PromptDialog'

export function DocumentActions({
  lng,
  slug,
  title,
  markdown,
  updatedAt,
}: {
  lng: string
  slug: string
  title: string
  markdown: string
  updatedAt: string
}) {
  const english = lng === 'en-US'
  const origin = getServerSideURL().replace(/\/$/, '')
  const url = `${origin}/${lng}/developers/${slug}`
  const document = `# ${title}\n\n${markdown}`.replace(
    /\]\((\.\/[^)]+|\/assets\/[^)]+)\)/g,
    (_, href: string) => `](${new URL(href, url).href})`,
  )
  const indexUrl = `${origin}/${lng}/developers/llms.txt`
  const markdownUrl = `${origin}/${lng}/developers/markdown/${slug}.md`
  const prompt = english
    ? `Before changing code, read these MuseDAM developer documents:\n- Documentation index: ${indexUrl}\n- Current page Markdown: ${markdownUrl}\n\nUse the current page Markdown as the source of truth. For asset search, management and delivery, start with Open API and Quick start. For application authorization and embedded selectors, read Integrations. For AI clients and agents, read MCP connection and tool documentation. Follow the relevant overview and API references before implementing.\n\nChoose Mainland China or Overseas endpoints by the account and asset region. MCP defaults to cn with no region query parameter; overseas uses region=overseas. Preserve authorization boundaries, keep secrets out of browser code, and use only documented endpoints and fields. If a document cannot be accessed or a requirement is unclear, ask for the missing information instead of guessing.`
    : localizeDeveloperText(
        `修改代码前，请先阅读以下 MuseDAM 开发者文档：\n- 开发者文档索引：${indexUrl}\n- 当前页面 Markdown：${markdownUrl}\n\n以当前页面 Markdown 为准。素材检索、管理与分发进入「开放 API」，从「快速开始」开始；应用授权与嵌入式选择器进入「第三方集成」；AI 客户端与智能体接入进入「MCP 与 AI 工具」。先阅读对应概览、接入指南和接口参考，再修改代码。\n\n按账号及资产所属区域选择国内或海外地址。MCP 默认 cn，无需区域查询参数；海外使用 region=overseas。保留权限边界，不在浏览器代码中暴露密钥，只使用已记录的接口和字段。文档无法访问或需求不明确时，请先获取缺少的信息，不要猜测实现。`,
        lng,
      )

  return (
    <div className="dev-doc-meta">
      <span className="dev-doc-updated">
        {english ? 'Last updated' : localizeDeveloperText('最近更新', lng)}{' '}
        <time dateTime={updatedAt}>{updatedAt}</time>
      </span>
      <div className="dev-doc-actions">
        <PromptDialog
          key={`${lng}-${slug}`}
          prompt={prompt}
          markdown={document}
          english={english}
          indexUrl={indexUrl}
          markdownUrl={markdownUrl}
        />
      </div>
    </div>
  )
}
