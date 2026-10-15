import { localizeDeveloperText } from '@/data/developers/localize'

export function RegionEndpoints({
  english = false,
  lng = 'zh-CN',
  kind = 'api',
}: {
  lng?: string
  english?: boolean
  kind?: 'api' | 'apps' | 'mcp' | 'product-library'
}) {
  const mcp = kind === 'mcp'
  const productLibrary = kind === 'product-library'
  const path = kind === 'apps' ? 'apps' : 'muse'
  const rows = productLibrary
    ? [
        {
          name: english ? 'API endpoint' : localizeDeveloperText('接口地址', lng),
          url: 'https://open.musedam.cc/api/muse/product-api',
        },
      ]
    : [
        {
          name: english ? 'Mainland China' : localizeDeveloperText('国内', lng),
          url: mcp ? 'https://mcp-service.musedam.cc' : `https://open.musedam.cc/api/${path}`,
          detail: mcp
            ? english
              ? 'Default region: cn; no query parameter needed'
              : localizeDeveloperText('默认 cn，无需添加区域参数', lng)
            : 'cn',
        },
        {
          name: english ? 'Overseas' : localizeDeveloperText('海外', lng),
          url: mcp
            ? 'https://mcp-service.musedam.cc?region=overseas'
            : `https://open.musedam.ai/api/${path}`,
          detail: mcp ? 'region=overseas' : 'overseas',
        },
      ]
  return (
    <aside
      className="dev-region-endpoints"
      aria-label={english ? 'API endpoints' : localizeDeveloperText('接口地址', lng)}
    >
      <strong>
        {mcp
          ? 'MCP · Streamable HTTP'
          : productLibrary
            ? 'Product Library API · Endpoint'
            : `${kind === 'apps' ? 'App API' : 'Open API'} · Base URL`}
      </strong>
      {rows.map((row) => (
        <div className="dev-region-row" key={row.name}>
          <span>
            {row.name}
            {row.detail ? <small>{row.detail}</small> : null}
          </span>
          <code>{row.url}</code>
        </div>
      ))}
      {productLibrary && (
        <p>
          <strong>
            {english
              ? 'Product Library must be enabled before you can use this API.'
              : localizeDeveloperText('仅开通商品库后，才能使用商品库 API。', lng)}
          </strong>
        </p>
      )}
      <p>
        {productLibrary
          ? english
            ? 'Use an existing MuseDAM API Key and add it as a collaborator in Product Library member settings.'
            : localizeDeveloperText(
                '使用现有 MuseDAM API Key，并先在商品库成员设置中添加为协作者。',
                lng,
              )
          : english
            ? 'Choose the region where your MuseDAM account and assets are hosted. English examples use Overseas.'
            : localizeDeveloperText(
                '请按 MuseDAM 账号及资产所在区域选择地址；中文示例默认使用国内区域。',
                lng,
              )}
      </p>
    </aside>
  )
}
