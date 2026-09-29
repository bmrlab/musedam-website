'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { localizeDeveloperText } from '@/data/developers/localize'

import { CodeBlock } from './CodeBlock'
import { RegionEndpoints } from './RegionEndpoints'

const api = `curl --request POST 'https://open.musedam.cc/api/muse/search-assets' \\
  --header "Authorization: Bearer $MUSEDAM_API_KEY" \\
  --header 'Content-Type: application/json' \\
  --data '{"keywords": ["品牌"], "startPoint": 0, "endPoint": 10}'`
const mcp = JSON.stringify(
  {
    mcpServers: {
      musedam: {
        url: 'https://mcp-service.musedam.cc',
        headers: { Authorization: 'Bearer YOUR_API_KEY' },
      },
    },
  },
  null,
  2,
)

export function ConnectionExample({ english = false }: { english?: boolean }) {
  const lng = useParams<{ lng: string }>()?.lng ?? 'zh-CN'
  const [tab, setTab] = useState('api')
  return (
    <>
      <div className="dev-example">
        <div
          className="dev-example-tabs"
          role="tablist"
          aria-label={english ? 'Connection examples' : localizeDeveloperText('接入示例', lng)}
        >
          {[
            { id: 'api', label: 'Open API' },
            { id: 'mcp', label: 'MCP' },
          ].map((item) => (
            <button
              type="button"
              role="tab"
              id={`example-tab-${item.id}`}
              aria-controls="connection-example"
              aria-selected={tab === item.id}
              key={item.id}
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  const next = tab === 'api' ? 'mcp' : 'api'
                  setTab(next)
                  document.getElementById(`example-tab-${next}`)?.focus()
                }
              }}
              tabIndex={tab === item.id ? 0 : -1}
            >
              {item.label}
            </button>
          ))}
          <span>QUICK PREVIEW</span>
        </div>
        <div role="tabpanel" id="connection-example" aria-labelledby={`example-tab-${tab}`}>
          <CodeBlock
            key={tab}
            english={english}
            code={
              tab === 'api'
                ? english
                  ? api
                      .replace('open.musedam.cc', 'open.musedam.ai')
                      .replace(localizeDeveloperText('品牌', lng), 'brand')
                  : api
                : english
                  ? mcp.replace(
                      'https://mcp-service.musedam.cc',
                      'https://mcp-service.musedam.cc?region=overseas',
                    )
                  : mcp
            }
            language={tab === 'api' ? 'bash' : 'json'}
          />
        </div>
      </div>
      <RegionEndpoints english={english} lng={lng} kind={tab === 'mcp' ? 'mcp' : 'api'} />
    </>
  )
}
