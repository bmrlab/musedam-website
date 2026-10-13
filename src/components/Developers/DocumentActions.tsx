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
  const generalPrompt = english
    ? `Before changing code, read these MuseDAM developer documents:\n- Documentation index: ${indexUrl}\n- Current page Markdown: ${markdownUrl}\n\nUse the current page Markdown as the source of truth. For asset search, management and delivery, start with Open API and Quick start. For application authorization and embedded selectors, read Integrations. For AI clients and agents, read MCP connection and tool documentation. Follow the relevant overview and API references before implementing.\n\nChoose Mainland China or Overseas endpoints by the account and asset region. MCP defaults to cn with no region query parameter; overseas uses region=overseas. Preserve authorization boundaries, keep secrets out of browser code, and use only documented endpoints and fields. If a document cannot be accessed or a requirement is unclear, ask for the missing information instead of guessing.`
    : localizeDeveloperText(
        `修改代码前，请先阅读以下 MuseDAM 开发者文档：\n- 开发者文档索引：${indexUrl}\n- 当前页面 Markdown：${markdownUrl}\n\n以当前页面 Markdown 为准。素材检索、管理与分发进入「开放 API」，从「快速开始」开始；应用授权与嵌入式选择器进入「第三方集成」；AI 客户端与智能体接入进入「MCP 与 AI 工具」。先阅读对应概览、接入指南和接口参考，再修改代码。\n\n按账号及资产所属区域选择国内或海外地址。MCP 默认 cn，无需区域查询参数；海外使用 region=overseas。保留权限边界，不在浏览器代码中暴露密钥，只使用已记录的接口和字段。文档无法访问或需求不明确时，请先获取缺少的信息，不要猜测实现。`,
        lng,
      )
  const productLibraryGuidance = english
    ? `For Product Library, read Quick start for the service address, authorization and your first request. Use API documentation to find resource parameters and examples. Use https://open.musedam.cc/api/product as the Product Library API base URL. Use an existing MuseDAM API key in Authorization: Bearer <key>. A Product Library Manager must first add the key as an API Key Collaborator; access follows the collaborator role. Follow the authorization rules documented for Product Library. Keep credentials out of browser code, use only documented endpoints and fields, and ask for missing configuration instead of guessing.`
    : localizeDeveloperText(
        '商品库接入时，请先阅读快速接入，了解服务地址、授权和首次请求；按资源查找接口参数与示例，请阅读接口文档。商品库 API 的基础地址为 https://open.musedam.cc/api/product。使用现有 MuseDAM API Key，通过 Authorization: Bearer <key> 认证。商品库管理员须先将密钥添加为 API Key Collaborator，访问权限由协作者角色决定。请遵循商品库文档中的授权规则。密钥只保存在服务端，只使用已记录的接口和字段；缺少配置时请先获取所需信息。',
        lng,
      )
  const productLibrary = slug === 'product-library' || slug.startsWith('product-library-')
  const prompt = productLibrary
    ? [
        english
          ? `Before changing code, read these MuseDAM developer documents:\n- Documentation index: ${indexUrl}\n- Current page Markdown: ${markdownUrl}\n\nUse the current page Markdown as the source of truth.`
          : localizeDeveloperText(
              `修改代码前，请先阅读以下 MuseDAM 开发者文档：\n- 开发者文档索引：${indexUrl}\n- 当前页面 Markdown：${markdownUrl}\n\n以当前页面 Markdown 为准。`,
              lng,
            ),
        productLibraryGuidance,
      ].join('\n\n')
    : slug === 'landing'
      ? `${generalPrompt}\n\n${productLibraryGuidance}`
      : generalPrompt

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
