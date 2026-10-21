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
  kind?: 'api' | 'apps' | 'mcp' | 'product-library'
  /** 当前部署区域，由服务端按 DEPLOY_REGION 传入，只显示该区域的地址 */
  region: DeveloperRegion
}) {
  const mcp = kind === 'mcp'
  const productLibrary = kind === 'product-library'
  const endpoints = developerEndpoints(region)
  // 商品库只在国内提供，固定使用国内地址
  const url = productLibrary
    ? 'https://open.musedam.cc/api/muse/product-api'
    : mcp
      ? endpoints.mcp
      : `${endpoints.openApi}/api/${kind === 'apps' ? 'apps' : 'muse'}`
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
      <div className="dev-region-row">
        <code>{url}</code>
      </div>
      {productLibrary && (
        <>
          <p>
            <strong>
              {english
                ? 'Product Library must be enabled before you can use this API.'
                : localizeDeveloperText('仅开通商品库后，才能使用商品库 API。', lng)}
            </strong>
          </p>
          <p>
            {english
              ? 'Use an existing MuseDAM API Key and add it as a collaborator in Product Library member settings.'
              : localizeDeveloperText(
                  '使用现有 MuseDAM API Key，并先在商品库成员设置中添加为协作者。',
                  lng,
                )}
          </p>
        </>
      )}
    </aside>
  )
}
