import Link from 'next/link'
import { getDeveloperDocument } from '@/data/developers/documents'
import { localizeDeveloperText } from '@/data/developers/localize'
import { ArrowRight, ArrowUpRight, Braces, Check, Layers, Sparkles, Terminal } from 'lucide-react'

import { Architecture } from './Architecture'
import { ConnectionExample } from './ConnectionExample'
import { DocumentActions } from './DocumentActions'
import { TableOfContents } from './TableOfContents'

export function DeveloperLanding({ lng }: { lng: string }) {
  const en = lng === 'en-US'
  const text = (zh: string, english: string) => (en ? english : zh)
  const base = `/${lng}/developers`
  const landingDocument = getDeveloperDocument(lng, 'landing')!
  const overview = landingDocument.markdown
  const cards = [
    {
      number: '01',
      icon: Braces,
      title: 'Open API',
      description: text(
        localizeDeveloperText('将素材检索、管理与分发能力接入你的业务系统。', lng),
        'Connect asset search, management and delivery to your own systems.',
      ),
      tags: 'REST API · API Key',
      href: 'quick-start',
      label: text(localizeDeveloperText('开始接入', lng), 'Get started'),
    },
    {
      number: '02',
      icon: Layers,
      title: text(localizeDeveloperText('第三方集成', lng), 'Integrations'),
      description: text(
        localizeDeveloperText('构建企业应用，嵌入 MuseDAM 并复用原生组件。', lng),
        'Build enterprise apps and reuse native MuseDAM selectors.',
      ),
      tags: 'Apps · iframe · UI',
      href: 'applications',
      label: text(localizeDeveloperText('构建应用', lng), 'Build an app'),
    },
    {
      number: '03',
      icon: Sparkles,
      title: 'MCP',
      description: text(
        localizeDeveloperText('让 AI 客户端连接资产库，用自然语言驱动工作流。', lng),
        'Give AI clients access to your library through natural language.',
      ),
      tags: 'AI Clients · Agents',
      href: 'mcp',
      label: text(localizeDeveloperText('连接 AI 工具', lng), 'Connect AI tools'),
    },
  ]
  const headings = [
    {
      id: 'choose',
      title: text(localizeDeveloperText('选择接入方式', lng), 'Choose your path'),
      level: 2,
    },
    {
      id: 'architecture',
      title: text(localizeDeveloperText('连接你的工作流', lng), 'Connect your workflow'),
      level: 2,
    },
    {
      id: 'first-request',
      title: text(localizeDeveloperText('从一次调用开始', lng), 'Make your first call'),
      level: 2,
    },
    {
      id: 'before-start',
      title: text(localizeDeveloperText('开始之前', lng), 'Before you start'),
      level: 2,
    },
  ]
  return (
    <div className="dev-page-grid">
      <article className="dev-article dev-landing">
        <header className="dev-page-header">
          <div className="dev-eyebrow">
            <span />
            MUSEDAM DEVELOPERS
          </div>
          <h1>
            {text(localizeDeveloperText('连接资产，拓展可能。', lng), 'Your assets. Connected.')}
          </h1>
          <p className="dev-lead">
            {text(
              localizeDeveloperText('把数字资产带入你的产品与工作流。', lng),
              'Bring your digital assets into your products and workflows.',
            )}
            <br />
            {text(
              localizeDeveloperText('通过开放 API、第三方集成与 MCP，构建属于你的内容生态。', lng),
              'Build with Open API, app integrations and MCP.',
            )}
          </p>
          <div className="dev-hero-actions">
            <Link className="dev-primary-button" href={`${base}/quick-start`}>
              {text(localizeDeveloperText('快速开始', lng), 'Quick start')}
              <ArrowRight size={16} />
            </Link>
            <Link className="dev-text-link" href={`${base}/search`}>
              {text(localizeDeveloperText('查看 API 文档', lng), 'Explore the API')}
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <DocumentActions
            lng={lng}
            slug="landing"
            title={text(
              localizeDeveloperText('MuseDAM 开放平台', lng),
              'MuseDAM Developer Platform',
            )}
            markdown={overview}
            updatedAt={landingDocument.updatedAt}
          />
        </header>
        <section id="choose" className="dev-landing-section">
          <div className="dev-section-heading">
            <h2>
              {text(localizeDeveloperText('你想如何连接 MuseDAM？', lng), 'How will you connect?')}
            </h2>
            <span>01 / EXPLORE</span>
          </div>
          <div className="dev-path-cards">
            {cards.map(({ icon: Icon, ...card }) => (
              <Link className="dev-path-card" key={card.number} href={`${base}/${card.href}`}>
                <div className="dev-card-top">
                  <Icon size={22} strokeWidth={1.5} />
                  <span>{card.number}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <small>{card.tags}</small>
                <div className="dev-card-link">
                  {card.label}
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section id="architecture" className="dev-landing-section">
          <div className="dev-section-heading">
            <h2>
              {text(
                localizeDeveloperText('一个资产库，连接每一条工作流。', lng),
                'One library. Every workflow.',
              )}
            </h2>
            <span>02 / CONNECT</span>
          </div>
          <p className="dev-section-intro">
            {text(
              localizeDeveloperText(
                '为业务系统提供稳定的数据接口，为 AI 工具提供可调用的资产能力。',
                lng,
              ),
              'A shared foundation for your business systems and AI tools.',
            )}
          </p>
          <Architecture english={en} lng={lng} />
        </section>
        <section id="first-request" className="dev-landing-section">
          <div className="dev-section-heading">
            <h2>
              {text(localizeDeveloperText('从一次调用开始。', lng), 'Start with a single call.')}
            </h2>
            <span>03 / BUILD</span>
          </div>
          <p className="dev-section-intro">
            {text(
              localizeDeveloperText(
                '准备好 API Key，检索第一份素材，或将 MuseDAM 添加到你的 MCP 客户端。',
                lng,
              ),
              'With an API Key, search for your first asset or configure your MCP client.',
            )}
          </p>
          <ConnectionExample english={en} />
          <div className="dev-example-note">
            <Terminal size={14} />
            <span>
              {text(
                localizeDeveloperText(
                  '运行 curl 前，请先将环境变量 MUSEDAM_API_KEY 设置为你的 API Key；MCP 配置中的 YOUR_API_KEY 也需替换为有效密钥。',
                  lng,
                ),
                'Before running curl, set the MUSEDAM_API_KEY environment variable to your API key. Replace YOUR_API_KEY in the MCP configuration with a valid key.',
              )}
            </span>
          </div>
        </section>
        <section id="before-start" className="dev-landing-section">
          <div className="dev-section-heading">
            <h2>{text(localizeDeveloperText('开始之前', lng), 'Before you start')}</h2>
            <span>READY TO GO</span>
          </div>
          <div className="dev-checklist">
            {[
              text(
                localizeDeveloperText('拥有 MuseDAM 企业账号，并确认目标企业及资产访问范围。', lng),
                'Have a MuseDAM enterprise account and confirm the target organization.',
              ),
              text(
                localizeDeveloperText(
                  '由管理员创建 API Key；第三方应用需先完成注册与企业授权。',
                  lng,
                ),
                'Ask an administrator for an API Key; apps also require registration and authorization.',
              ),
              text(
                localizeDeveloperText(
                  '选择对应的国内或海外环境，密钥只保存在服务端或本地客户端配置中。',
                  lng,
                ),
                'Choose the correct region and keep credentials in your backend or local client configuration.',
              ),
            ].map((item) => (
              <p key={item}>
                <Check size={15} />
                <span>{item}</span>
              </p>
            ))}
          </div>
          <Link className="dev-text-link" href={`${base}/authentication`}>
            {text(localizeDeveloperText('了解认证与权限', lng), 'Read about authentication')}
            <ArrowRight size={15} />
          </Link>
        </section>
        <div className="dev-bottom-callout">
          <div>
            <span>LET’S BUILD TOGETHER</span>
            <h3>
              {text(
                localizeDeveloperText('把你的想法，接入 MuseDAM。', lng),
                'Build your next integration.',
              )}
            </h3>
            <p>
              {text(
                localizeDeveloperText('需要应用注册、能力开通或集成方案支持？', lng),
                'Need app registration, feature access or integration support?',
              )}
            </p>
          </div>
          <Link href={`/${lng}/book-demo`}>
            {text(localizeDeveloperText('联系团队', lng), 'Contact us')}
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <footer className="dev-article-footer">
          MuseDAM Developer Platform <span>API · Integrations · MCP</span>
        </footer>
      </article>
      <TableOfContents headings={headings} lng={lng} />
    </div>
  )
}
