import { localizeDeveloperText } from '@/data/developers/localize'

export function RegionEndpoints({
  english = false,
  lng = 'zh-CN',
  kind = 'api',
}: {
  lng?: string
  english?: boolean
  kind?: 'api' | 'apps' | 'mcp'
}) {
  const mcp = kind === 'mcp'
  const path = kind === 'apps' ? 'apps' : 'muse'
  const rows = [
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
      aria-label={english ? 'Regional endpoints' : localizeDeveloperText('区域地址', lng)}
    >
      <strong>
        {mcp ? 'MCP · Streamable HTTP' : `${kind === 'apps' ? 'App API' : 'Open API'} · Base URL`}
      </strong>
      {rows.map((row) => (
        <div className="dev-region-row" key={row.name}>
          <span>
            {row.name}
            <small>{row.detail}</small>
          </span>
          <code>{row.url}</code>
        </div>
      ))}
      <p>
        {english
          ? 'Choose the region where your MuseDAM account and assets are hosted. English examples use Overseas.'
          : localizeDeveloperText(
              '请按 MuseDAM 账号及资产所在区域选择地址；中文示例默认使用国内区域。',
              lng,
            )}
      </p>
    </aside>
  )
}
