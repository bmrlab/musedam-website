import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDeveloperGroups, getDeveloperNavigation, getDeveloperPages } from '@/data/developers'
import { content } from '@/data/developers/content'
import { englishContent } from '@/data/developers/content.en'
import { traditionalContent } from '@/data/developers/content.tw'
import { localizeDeveloperText } from '@/data/developers/localize'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { IntegrationFlow } from '@/components/Developers/Architecture'
import { DocumentActions } from '@/components/Developers/DocumentActions'
import { DeveloperLanding } from '@/components/Developers/Landing'
import { markdownComponents } from '@/components/Developers/Markdown'
import { RegionEndpoints } from '@/components/Developers/RegionEndpoints'
import { TableOfContents } from '@/components/Developers/TableOfContents'

type Props = { params: Promise<{ lng: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng, slug } = await params
  const english = lng === 'en-US'
  const developerPages = getDeveloperPages(lng)
  const page = developerPages.find((page) => page.slug === slug)
  const title =
    slug === 'landing'
      ? lng === 'en-US'
        ? 'Developer Platform'
        : localizeDeveloperText('开放平台', lng)
      : page?.title
  const description =
    page?.description ||
    (english
      ? 'Connect your digital assets to products and workflows through MuseDAM Open API, integrations, and MCP.'
      : localizeDeveloperText(
          '通过 MuseDAM 开放 API、第三方集成与 MCP，将企业数字资产连接到你的产品与工作流。',
          lng,
        ))
  const path = `/developers/${slug}`
  return {
    title: localizeDeveloperText(
      `${title || (english ? 'Document not found' : '文档未找到')} | MuseDAM Developers`,
      lng,
    ),
    description,
    alternates: {
      canonical: `/${lng}${path}`,
      languages: { 'zh-CN': `/zh-CN${path}`, 'en-US': `/en-US${path}`, 'zh-TW': `/zh-TW${path}` },
    },
    openGraph: { title: `${title || 'MuseDAM'} | Developers`, description, url: `/${lng}${path}` },
  }
}

export default async function DeveloperPage({ params }: Props) {
  const { lng, slug } = await params
  const english = lng === 'en-US'
  const developerPages = getDeveloperPages(lng)
  const developerNavigation = getDeveloperNavigation(lng)
  if (slug === 'landing') return <DeveloperLanding lng={lng} />
  const page = developerPages.find((page) => page.slug === slug)
  if (!page || !(slug in content)) notFound()
  const Content = (english ? englishContent : lng === 'zh-TW' ? traditionalContent : content)[
    slug as keyof typeof content
  ]
  const group = getDeveloperGroups(lng).find((group) => group.id === page.group)
  const index = developerNavigation.findIndex((page) => page.slug === slug)
  const previous = developerNavigation[index - 1]
  const next = developerNavigation[index + 1]
  return (
    <div className="dev-page-grid">
      <article className="dev-article">
        <header className="dev-doc-header">
          <div className="dev-breadcrumb">
            <Link href={`/${lng}/developers/landing`}>
              {english ? 'Documentation' : localizeDeveloperText('开发者文档', lng)}
            </Link>
            <span>/</span>
            {english ? group?.en : group?.title}
          </div>
          <h1>{page.title}</h1>
          <p className="dev-lead">{page.description}</p>
          <DocumentActions
            lng={lng}
            slug={slug}
            title={page.title}
            markdown={page.markdown}
            updatedAt={page.updatedAt}
          />
        </header>
        {(page.group === 'api' ||
          page.group === 'apps' ||
          page.group === 'mcp' ||
          page.group === 'examples' ||
          slug === 'quick-start' ||
          slug === 'authentication') && (
          <RegionEndpoints
            lng={lng}
            english={english}
            kind={page.group === 'mcp' ? 'mcp' : page.group === 'apps' ? 'apps' : 'api'}
          />
        )}
        <IntegrationFlow slug={slug} english={english} lng={lng} />
        <div className="dev-prose">
          <Content components={markdownComponents(page.headings, english, lng)} />
        </div>
        <nav
          className="dev-pagination"
          aria-label={english ? 'Adjacent documents' : localizeDeveloperText('相邻文档', lng)}
        >
          {previous && (
            <Link href={`/${lng}/developers/${previous.slug}`}>
              <small>
                <ArrowLeft size={13} />
                {english ? 'Previous' : localizeDeveloperText('上一篇', lng)}
              </small>
              <span>{previous.title}</span>
            </Link>
          )}
          {next && (
            <Link href={`/${lng}/developers/${next.slug}`}>
              <small>
                {english ? 'Next' : localizeDeveloperText('下一篇', lng)}
                <ArrowRight size={13} />
              </small>
              <span>{next.title}</span>
            </Link>
          )}
        </nav>
        <footer className="dev-article-footer">
          MuseDAM Developer Platform<span>API · Integrations · MCP</span>
        </footer>
      </article>
      <TableOfContents headings={page.headings} lng={lng} />
    </div>
  )
}
