import { localizeDeveloperText } from '@/data/developers/localize'
import { type DeveloperRegion, developerEndpoints } from '@/data/developers/region'

export function RegionEndpoints({
  english = false,
  lng = 'zh-CN',
  kind = 'api',
  region,
}: {
  lng?: string
  english?: boolean
  kind?: 'api' | 'apps' | 'mcp'
  /** 当前部署区域，由服务端按 DEPLOY_REGION 传入，只显示该区域的地址 */
  region: DeveloperRegion
}) {
  const mcp = kind === 'mcp'
  const endpoints = developerEndpoints(region)
  const url = mcp ? endpoints.mcp : `${endpoints.openApi}/api/${kind === 'apps' ? 'apps' : 'muse'}`
  return (
    <aside
      className="dev-region-endpoints"
      aria-label={english ? 'Base URL' : localizeDeveloperText('区域地址', lng)}
    >
      <strong>
        {mcp ? 'MCP · Streamable HTTP' : `${kind === 'apps' ? 'App API' : 'Open API'} · Base URL`}
      </strong>
      <div className="dev-region-row">
        <code>{url}</code>
      </div>
    </aside>
  )
}
