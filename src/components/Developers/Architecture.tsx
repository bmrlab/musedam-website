import { localizeDeveloperText } from '@/data/developers/localize'
import { ArrowRight, Box, Braces, Layers, ShieldCheck, Sparkles, Workflow } from 'lucide-react'

export function Architecture({
  english = false,
  lng = 'zh-CN',
}: {
  english?: boolean
  lng?: string
}) {
  const rows = [
    {
      icon: Braces,
      name: english ? 'Your backend' : localizeDeveloperText('你的业务服务', lng),
      detail: 'CMS · PIM · E-commerce',
      method: 'Open API',
      auth: 'Bearer API Key',
    },
    {
      icon: Layers,
      name: english ? 'Third-party app' : localizeDeveloperText('第三方应用', lng),
      detail: 'iframe · postMessage',
      method: english ? 'App authorization' : localizeDeveloperText('应用授权', lng),
      auth: 'Basic → API Key',
    },
    {
      icon: Sparkles,
      name: english ? 'AI clients' : localizeDeveloperText('AI 客户端', lng),
      detail: 'Cursor · Claude · Agents',
      method: 'MCP Server',
      auth: 'Streamable HTTP',
    },
  ]
  return (
    <figure
      className="dev-architecture"
      aria-label={
        english
          ? 'Three ways to connect to MuseDAM'
          : localizeDeveloperText('三种方式接入 MuseDAM 的架构图', lng)
      }
    >
      <div className="dev-diagram-caption">
        <span>CONNECTION ARCHITECTURE</span>
        <span>
          <ShieldCheck size={13} />
          {english ? 'Permission-scoped access' : localizeDeveloperText('统一权限边界', lng)}
        </span>
      </div>
      <div className="dev-architecture-body">
        <div className="dev-architecture-lanes">
          {rows.map(({ icon: Icon, ...row }) => (
            <div className="dev-architecture-lane" key={row.method}>
              <div className="dev-source-node">
                <Icon size={19} />
                <div>
                  <strong>{row.name}</strong>
                  <small>{row.detail}</small>
                </div>
              </div>
              <div className="dev-connector">
                <span />
                <ArrowRight size={13} />
              </div>
              <div className="dev-method-node">
                <strong>{row.method}</strong>
                <small>{row.auth}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="dev-merge">
          <span />
          <ArrowRight size={17} />
        </div>
        <div className="dev-dam-node">
          <Box size={28} strokeWidth={1.3} />
          <strong>MuseDAM</strong>
          <span>
            {english ? 'Your asset library' : localizeDeveloperText('企业数字资产库', lng)}
          </span>
          <div>
            {english
              ? 'Assets · Tags · Folders'
              : localizeDeveloperText('素材 · 标签 · 文件夹', lng)}
          </div>
        </div>
      </div>
      <figcaption>
        {english
          ? 'Every integration operates within the access granted to its API Key.'
          : localizeDeveloperText(
              '业务系统与 AI 工具通过各自的接入方式，访问 API Key 授权范围内的资产。',
              lng,
            )}
      </figcaption>
    </figure>
  )
}

const englishFlows: Record<string, { title: string; nodes: string[]; note: string }[]> = {
  applications: [
    {
      title: 'Third-party application authorization',
      nodes: [
        'Admin enables the app',
        'Backend authenticates with Basic',
        'Exchange for an enterprise API key',
        'Call Open API with Bearer',
      ],
      note: 'Store app credentials on the backend. Manage authorization and API keys separately for each enterprise.',
    },
  ],
  components: [
    {
      title: 'Embedded applications and component messaging',
      nodes: [
        'MuseDAM loads the iframe',
        'App backend validates the token',
        'Send an action with postMessage',
        'Match results by dispatchId',
      ],
      note: 'Both sides validate the origin and message source. UI operations follow the current user’s permissions.',
    },
  ],
  'use-cases': [
    {
      title: 'CMS content creation',
      nodes: [
        'Select assets in the editor',
        'Search through the backend API',
        'Save asset IDs',
        'Get valid links and publish',
      ],
      note: 'Reference assets by ID. Temporary download links should not be stored as permanent content URLs.',
    },
    {
      title: 'E-commerce product management',
      nodes: [
        'Link products to assets',
        'Search product images by tag',
        'Process images for each channel',
        'Sync product listings',
      ],
      note: 'DAT image processing and public links must be enabled for the team.',
    },
    {
      title: 'Marketing asset distribution',
      nodes: [
        'Scheduled job or event callback',
        'Find current marketing assets',
        'Distribute by channel rules',
        'Record results in your system',
      ],
      note: 'Deduplicate events and track delivery results. Third-party systems handle channel publishing.',
    },
  ],
  mcp: [
    {
      title: 'From natural language to asset operations',
      nodes: [
        'AI client interprets the task',
        'Invoke an MCP tool',
        'Open API checks permissions',
        'Return assets and results',
      ],
      note: 'MCP uses Open API permissions. Tool parameters follow the schema returned by the service.',
    },
  ],
}

export function IntegrationFlow({
  slug,
  english = false,
  lng = 'zh-CN',
}: {
  slug: string
  english?: boolean
  lng?: string
}) {
  const flows: Record<string, { title: string; nodes: string[]; note: string }[]> = {
    applications: [
      {
        title: localizeDeveloperText('第三方应用授权流程', lng),
        nodes: [
          localizeDeveloperText('企业管理员启用应用', lng),
          localizeDeveloperText('应用服务端 Basic 认证', lng),
          localizeDeveloperText('换取企业 API Key', lng),
          localizeDeveloperText('Bearer 调用开放 API', lng),
        ],
        note: localizeDeveloperText(
          '应用凭证保存在服务端；每个企业的授权与 API Key 独立管理。',
          lng,
        ),
      },
    ],
    components: [
      {
        title: localizeDeveloperText('嵌入应用与组件通信', lng),
        nodes: [
          localizeDeveloperText('MuseDAM 加载 iframe', lng),
          localizeDeveloperText('应用后端验证 token', lng),
          localizeDeveloperText('postMessage 发起操作', lng),
          localizeDeveloperText('dispatchId 匹配结果', lng),
        ],
        note: localizeDeveloperText(
          '通信双方校验 origin 与消息来源，界面操作沿用当前用户权限。',
          lng,
        ),
      },
    ],
    'use-cases': [
      {
        title: localizeDeveloperText('CMS 内容生产', lng),
        nodes: [
          localizeDeveloperText('编辑器选择素材', lng),
          localizeDeveloperText('业务后端检索 API', lng),
          localizeDeveloperText('保存素材 ID', lng),
          localizeDeveloperText('获取有效链接并发布', lng),
        ],
        note: localizeDeveloperText(
          '使用素材 ID 建立关联，避免将临时下载链接作为永久内容地址。',
          lng,
        ),
      },
      {
        title: localizeDeveloperText('电商产品管理', lng),
        nodes: [
          localizeDeveloperText('商品与素材关联', lng),
          localizeDeveloperText('按标签检索产品图', lng),
          localizeDeveloperText('按渠道处理图片', lng),
          localizeDeveloperText('同步商品展示', lng),
        ],
        note: localizeDeveloperText('DAT 图片处理与公开链接能力需先为团队开通。', lng),
      },
      {
        title: localizeDeveloperText('营销素材分发', lng),
        nodes: [
          localizeDeveloperText('定时任务 / 事件回调', lng),
          localizeDeveloperText('检索最新营销素材', lng),
          localizeDeveloperText('按渠道规则分发', lng),
          localizeDeveloperText('业务系统记录结果', lng),
        ],
        note: localizeDeveloperText('按事件去重并跟踪分发结果；渠道发布由第三方系统实现。', lng),
      },
    ],
    mcp: [
      {
        title: localizeDeveloperText('从自然语言到资产操作', lng),
        nodes: [
          localizeDeveloperText('AI 客户端理解任务', lng),
          localizeDeveloperText('MCP 工具调用', lng),
          localizeDeveloperText('开放 API 权限校验', lng),
          localizeDeveloperText('返回素材与业务结果', lng),
        ],
        note: localizeDeveloperText(
          'MCP 复用开放 API 的权限边界；参数以服务返回的工具 schema 为准。',
          lng,
        ),
      },
    ],
  }

  if (slug === 'use-cases') return null
  return (
    <>
      {(english ? englishFlows : flows)[slug]?.map((flow) => (
        <figure className="dev-flow" key={flow.title}>
          <figcaption>
            <Workflow size={16} />
            {flow.title}
          </figcaption>
          <div>
            {flow.nodes.map((node, index) => (
              <div className="dev-flow-step" key={node}>
                <span>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  {node}
                </span>
                {index < flow.nodes.length - 1 && <ArrowRight size={16} />}
              </div>
            ))}
          </div>
          <p>{flow.note}</p>
        </figure>
      ))}
    </>
  )
}
