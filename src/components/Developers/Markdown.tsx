import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import Image from 'next/image'
import { localizeDeveloperText } from '@/data/developers/localize'
import { type DeveloperRegion, regionalizeDeveloperText } from '@/data/developers/region'
import type { MDXComponents } from 'mdx/types'

import { BusinessFlow } from './BusinessFlow'
import { CodeBlock } from './CodeBlock'

function plainText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      isValidElement<{ children?: ReactNode }>(child)
        ? plainText(child.props.children)
        : String(child),
    )
    .join('')
}

export function markdownComponents(
  headings: { id: string; title: string; level: number }[],
  english = false,
  lng = 'zh-CN',
  region: DeveloperRegion = 'cn',
  deferCodeHighlight = false,
): MDXComponents {
  let headingIndex = 0
  // 正文里的接口域名统一换成当前部署区域
  const regionalize = (node: ReactNode): ReactNode =>
    typeof node === 'string' ? regionalizeDeveloperText(node, region) : node
  return {
    // 只在某个部署区域展示的片段，pages*.json 中的同名标记由 regionalizeDeveloperBlocks 处理
    MainlandOnly: ({ children }: { children?: ReactNode }) => (region === 'cn' ? <>{children}</> : null),
    OverseasOnly: ({ children }: { children?: ReactNode }) => (region === 'overseas' ? <>{children}</> : null),
    ApiKeyScreenshot: ({
      step,
      caption,
    }: {
      step: 'entry' | 'create' | 'detail'
      caption: string
    }) => {
      const dimensions = { entry: [2876, 1494], create: [1038, 760], detail: [2870, 1502] }
      const src = `/assets/developers/api-key/${step}.png`
      return (
        <figure className={`dev-api-screenshot dev-api-screenshot-${step}`}>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            aria-label={localizeDeveloperText(
              `${caption} — ${english ? 'View full image' : '查看大图'}`,
              lng,
            )}
          >
            <Image
              src={src}
              alt={caption}
              width={dimensions[step][0]}
              height={dimensions[step][1]}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </a>
          <figcaption>
            {caption}
            <span>{english ? 'Click to enlarge' : localizeDeveloperText('点击查看大图', lng)}</span>
          </figcaption>
        </figure>
      )
    },
    EmbedScreenshot: ({
      name,
      caption,
    }: {
      name: 'assets' | 'folders' | 'members'
      caption: string
    }) => {
      const dimensions = { assets: [1283, 669], folders: [886, 577], members: [943, 650] }
      const src = `/assets/developers/embed/${name}.png`
      return (
        <figure className={`dev-api-screenshot dev-embed-screenshot-${name}`}>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            aria-label={localizeDeveloperText(
              `${caption} — ${english ? 'View full image' : '查看大图'}`,
              lng,
            )}
          >
            <Image
              src={src}
              alt={caption}
              width={dimensions[name][0]}
              height={dimensions[name][1]}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </a>
          <figcaption>
            {caption}
            <span>{english ? 'Click to enlarge' : localizeDeveloperText('点击查看大图', lng)}</span>
          </figcaption>
        </figure>
      )
    },
    BusinessFlow: ({ kind }: { kind: 'cms' | 'commerce' | 'marketing' }) => (
      <BusinessFlow kind={kind} english={english} lng={lng} />
    ),
    h2: ({ children }) => <h2 id={headings[headingIndex++]?.id}>{children}</h2>,
    h3: ({ children }) => <h3 id={headings[headingIndex++]?.id}>{children}</h3>,
    th: ({ children, ...props }) => (
      <th
        {...props}
        data-type-column={
          [localizeDeveloperText('类型', lng), 'Type'].includes(plainText(children).trim()) ||
          undefined
        }
      >
        {children}
      </th>
    ),
    table: ({ children }) => (
      <div className="dev-table-scroll" tabIndex={0}>
        <table>{children}</table>
      </div>
    ),
    pre: ({ children }) => {
      const child = Children.toArray(children)[0] as ReactElement<{
        className?: string
        children?: ReactNode
      }>
      return (
        <CodeBlock
          english={english}
          deferHighlight={deferCodeHighlight}
          code={regionalizeDeveloperText(plainText(child.props.children), region)}
          language={child.props.className?.replace('language-', '') || 'text'}
        />
      )
    },
    code: ({ children, ...props }) => <code {...props}>{Children.map(children, regionalize)}</code>,
    a: ({ href, children }) => (
      <a
        href={href && regionalizeDeveloperText(href, region)}
        {...(href?.startsWith('https://') ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {Children.map(children, regionalize)}
      </a>
    ),
  }
}
