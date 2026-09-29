import { localizeDeveloperText } from '@/data/developers/localize'
import { ArrowDown, CheckCircle2, GitBranch } from 'lucide-react'

type Kind = 'cms' | 'commerce' | 'marketing'
type Step = { from: number; to: number; title: string; detail: string }

export function BusinessFlow({
  kind,
  english = false,
  lng = 'zh-CN',
}: {
  kind: Kind
  english?: boolean
  lng?: string
}) {
  const t = (zh: string, en: string) => (english ? en : zh)
  const scenarios: Record<Kind, { actors: string[]; steps: Step[]; outcome: string }> = {
    cms: {
      actors: [
        t(localizeDeveloperText('CMS 编辑器', lng), 'CMS editor'),
        t(localizeDeveloperText('业务后端', lng), 'Your backend'),
        'MuseDAM',
      ],
      steps: [
        {
          from: 0,
          to: 1,
          title: t(localizeDeveloperText('搜索可用素材', lng), 'Find assets'),
          detail: t(localizeDeveloperText('关键词 · 类型 · 标签', lng), 'Keywords · Types · Tags'),
        },
        {
          from: 1,
          to: 2,
          title: t(localizeDeveloperText('检索资产库', lng), 'Search the library'),
          detail: '/search-assets',
        },
        {
          from: 2,
          to: 1,
          title: t(localizeDeveloperText('返回素材与预览', lng), 'Return assets and previews'),
          detail: t(
            localizeDeveloperText('素材 ID · 缩略图 · 下载链接', lng),
            'Asset IDs · Thumbnails · Download URLs',
          ),
        },
        {
          from: 1,
          to: 0,
          title: t(
            localizeDeveloperText('展示结果，确认选择', lng),
            'Display results for selection',
          ),
          detail: t(localizeDeveloperText('内容记录关联素材 ID', lng), 'Link content to asset IDs'),
        },
        {
          from: 1,
          to: 2,
          title: t(
            localizeDeveloperText('发布前获取最新素材', lng),
            'Fetch current assets before publishing',
          ),
          detail: '/assets-by-ids',
        },
        {
          from: 2,
          to: 1,
          title: t(localizeDeveloperText('返回有效下载链接', lng), 'Return valid download URLs'),
          detail: t(
            localizeDeveloperText('业务后端按需复制到 CMS 存储后发布', lng),
            'Your backend may copy files to CMS storage, then publish',
          ),
        },
      ],
      outcome: t(
        localizeDeveloperText('编辑器内完成选材，CMS 用素材 ID 持续维护内容关联。', lng),
        'Select assets in the editor and maintain content references using asset IDs.',
      ),
    },
    commerce: {
      actors: [
        t(localizeDeveloperText('商品系统 / PIM', lng), 'Product system / PIM'),
        'MuseDAM',
        t(localizeDeveloperText('商城与渠道', lng), 'Storefronts'),
      ],
      steps: [
        {
          from: 0,
          to: 1,
          title: t(
            localizeDeveloperText('上传商品图片与视频', lng),
            'Upload product images and videos',
          ),
          detail: '/upload-assets',
        },
        {
          from: 1,
          to: 0,
          title: t(localizeDeveloperText('建立商品与素材关联', lng), 'Link products to assets'),
          detail: t(
            localizeDeveloperText('业务系统保存 SKU ↔ 素材 ID', lng),
            'Your system stores SKU ↔ asset ID',
          ),
        },
        {
          from: 0,
          to: 1,
          title: t(localizeDeveloperText('检索所需商品素材', lng), 'Find product assets'),
          detail: '/search-assets',
        },
        {
          from: 1,
          to: 0,
          title: t(localizeDeveloperText('返回商品素材', lng), 'Return product assets'),
          detail: t(
            localizeDeveloperText('素材 ID · 图片与视频信息', lng),
            'Asset IDs · Image and video details',
          ),
        },
        {
          from: 0,
          to: 1,
          title: t(localizeDeveloperText('请求渠道适配图片', lng), 'Request channel-ready images'),
          detail: '/processed-public-links · DAT',
        },
        {
          from: 1,
          to: 0,
          title: t(
            localizeDeveloperText('返回处理后的公开链接', lng),
            'Return processed public URLs',
          ),
          detail: t(
            localizeDeveloperText('用于已有公开链接的图片', lng),
            'For images with existing public URLs',
          ),
        },
        {
          from: 0,
          to: 2,
          title: t(localizeDeveloperText('更新商品展示', lng), 'Update product listings'),
          detail: t(
            localizeDeveloperText('业务系统调用各渠道发布接口', lng),
            'Your system calls each channel’s publishing API',
          ),
        },
      ],
      outcome: t(
        localizeDeveloperText('一套商品素材按渠道复用，商品系统统一管理发布结果。', lng),
        'Reuse product assets across channels and track publishing in your product system.',
      ),
    },
    marketing: {
      actors: [
        'MuseDAM',
        t(localizeDeveloperText('分发服务', lng), 'Distribution service'),
        t(localizeDeveloperText('营销渠道', lng), 'Marketing channels'),
      ],
      steps: [
        {
          from: 1,
          to: 0,
          title: t(localizeDeveloperText('订阅素材变更', lng), 'Subscribe to asset changes'),
          detail: '/material-automation-subscribe',
        },
        {
          from: 0,
          to: 1,
          title: t(localizeDeveloperText('推送变更事件', lng), 'Deliver change events'),
          detail: t(
            localizeDeveloperText('Webhook → 校验、去重、入队', lng),
            'Webhook → validate, deduplicate, queue',
          ),
        },
        {
          from: 1,
          to: 0,
          title: t(localizeDeveloperText('获取最新素材', lng), 'Fetch current assets'),
          detail: '/assets-by-ids · /search-assets',
        },
        {
          from: 0,
          to: 1,
          title: t(localizeDeveloperText('返回分发所需信息', lng), 'Return delivery data'),
          detail: t(
            localizeDeveloperText('素材信息 · 有效下载链接', lng),
            'Asset details · Valid download URLs',
          ),
        },
        {
          from: 1,
          to: 2,
          title: t(
            localizeDeveloperText('按规则发布并记录结果', lng),
            'Publish by rules and record results',
          ),
          detail: t(
            localizeDeveloperText('渠道适配 · 失败重试 · 发布记录', lng),
            'Channel formatting · Retries · Delivery log',
          ),
        },
      ],
      outcome: t(
        localizeDeveloperText('素材更新驱动渠道分发；也可用定时检索替代事件触发。', lng),
        'Asset changes trigger distribution; scheduled searches are an alternative.',
      ),
    },
  }
  const scenario = scenarios[kind]
  return (
    <figure
      className="dev-business-flow"
      aria-label={t(localizeDeveloperText('系统交互流程图', lng), 'System interaction diagram')}
    >
      <figcaption>
        <GitBranch size={16} />
        <span>{t(localizeDeveloperText('系统交互流程', lng), 'SYSTEM INTERACTION')}</span>
        <small>{t(localizeDeveloperText('从素材到业务', lng), 'FROM ASSET TO DELIVERY')}</small>
      </figcaption>
      <div className="dev-sequence-scroll" tabIndex={0}>
        <div className="dev-sequence">
          <div className="dev-sequence-actors">
            {scenario.actors.map((actor, index) => (
              <div key={actor} className={actor === 'MuseDAM' ? 'is-dam' : ''}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <strong>{actor}</strong>
              </div>
            ))}
          </div>
          <ol className="dev-sequence-steps">
            {scenario.steps.map((step, index) => (
              <li key={step.title}>
                <div
                  className={`dev-sequence-message ${step.from > step.to ? 'is-return' : ''}`}
                  style={{
                    gridColumn: `${Math.min(step.from, step.to) + 1} / ${Math.max(step.from, step.to) + 2}`,
                  }}
                >
                  <span className="dev-sequence-label">
                    <b>{index + 1}</b>
                    <strong>{step.title}</strong>
                    <small>{step.detail}</small>
                  </span>
                  <span className="dev-sequence-arrow" aria-hidden="true" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="dev-sequence-outcome">
        <CheckCircle2 size={17} />
        <p>{scenario.outcome}</p>
        <ArrowDown size={15} />
      </div>
    </figure>
  )
}
