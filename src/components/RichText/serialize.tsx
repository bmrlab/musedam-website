import React, { Fragment, JSX } from 'react'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'

import { CMSLink } from '@/components/Link'

import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat'

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

type Props = {
  nodes: NodeTypes[]
}

export function serializeLexical({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node == null) {
          return null
        }

        if (node.type === 'text') {
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>
          if (node.format & IS_BOLD) {
            text = (
              <strong className="!font-euclid font-semibold text-[#242424]" key={index}>
                {text}
              </strong>
            )
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: 'line-through' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: 'underline' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_CODE) {
            text = (
              <code
                className="rounded bg-[#F2F2F2] px-1 py-0.5 font-euclid text-[14px] text-[#242424]"
                key={index}
              >
                {node.text}
              </code>
            )
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>
          }

          return text
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: NodeTypes): JSX.Element | null => {
          if (node.children == null) {
            return null
          } else {
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false
                  }
                }
              }
            }
            return serializeLexical({ nodes: node.children as NodeTypes[] })
          }
        }

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : ''

        if (node.type === 'block') {
          const block = node.fields

          const blockType = block?.blockType

          if (!block || !blockType) {
            return null
          }

          switch (blockType) {
            case 'cta':
              return <CallToActionBlock key={index} {...block} />
            case 'mediaBlock':
              return (
                <MediaBlock
                  className="my-8"
                  imgClassName="rounded-lg"
                  key={index}
                  {...block}
                  captionClassName="text-center text-sm text-gray-500 mt-2"
                  enableGutter={false}
                  disableInnerContainer={true}
                />
              )
            case 'banner':
              return <BannerBlock className="mb-8" key={index} {...block} />
            case 'code':
              return <CodeBlock className="my-6" key={index} {...block} />
            default:
              return null
          }
        } else {
          switch (node.type) {
            case 'linebreak': {
              return <br key={index} />
            }
            case 'paragraph': {
              return (
                <p
                  className="mb-3 !font-euclid text-[18px] font-normal leading-[1.65] text-[#242424]"
                  key={index}
                >
                  {serializedChildren}
                </p>
              )
            }
            case 'heading': {
              const Tag = node?.tag
              const headingClasses = {
                h1: '!font-euclid text-[40px] font-semibold leading-[1.5] text-[#242424] mt-12 mb-6',
                h2: '!font-euclid text-[32px] font-semibold leading-[1.5] text-[#242424] mt-10 mb-5',
                h3: '!font-euclid text-[24px] font-semibold leading-[1.5] text-[#242424] mt-8 mb-4',
                h4: '!font-euclid text-[20px] font-semibold leading-[1.5] text-[#242424] mt-6 mb-3',
                h5: '!font-euclid text-[18px] font-semibold leading-[1.5] text-[#242424] mt-4 mb-2',
                h6: '!font-euclid text-[18px] font-semibold leading-[1.5] text-[#242424] mt-4 mb-2',
              }
              return (
                <Tag
                  className={
                    headingClasses[Tag as keyof typeof headingClasses] || headingClasses.h2
                  }
                  key={index}
                >
                  {serializedChildren}
                </Tag>
              )
            }
            case 'list': {
              const Tag = node?.tag
              const listClasses =
                Tag === 'ol'
                  ? 'list-decimal list-inside mb-6 space-y-2 font-euclid text-[18px] font-normal leading-[1.65] text-[#242424]'
                  : 'list-disc list-inside mb-6 space-y-2 font-euclid text-[18px] font-normal leading-[1.65] text-[#242424]'
              return (
                <Tag className={listClasses} key={index}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'listitem': {
              if (node?.checked != null) {
                return (
                  <li
                    aria-checked={node.checked ? 'true' : 'false'}
                    className={`flex items-center gap-2 ${node.checked ? 'text-gray-500 line-through' : ''}`}
                    key={index}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                    role="checkbox"
                    tabIndex={-1}
                    value={node?.value}
                  >
                    <input type="checkbox" checked={node.checked} readOnly className="mr-2" />
                    {serializedChildren}
                  </li>
                )
              } else {
                return (
                  <li key={index} value={node?.value} className="leading-relaxed">
                    {serializedChildren}
                  </li>
                )
              }
            }
            case 'quote': {
              return (
                <blockquote
                  className="my-6 border-l-4 border-gray-300 pl-6 text-lg italic text-gray-600"
                  key={index}
                >
                  {serializedChildren}
                </blockquote>
              )
            }
            case 'link': {
              const fields = node.fields

              return (
                <CMSLink
                  key={index}
                  newTab={Boolean(fields?.newTab)}
                  reference={fields.doc as any}
                  type={fields.linkType === 'internal' ? 'reference' : 'custom'}
                  url={fields.url}
                >
                  {serializedChildren}
                </CMSLink>
              )
            }

            case 'table': {
              return (
                <div className="my-8 overflow-x-auto rounded-lg border border-gray-200" key={index}>
                  <table className="min-w-full divide-y divide-gray-200">
                    {serializedChildren}
                  </table>
                </div>
              )
            }

            case 'tablerow': {
              return (
                <tr key={index} className="divide-x divide-gray-200">
                  {serializedChildren}
                </tr>
              )
            }

            case 'tablecell': {
              const Tag = node.headerState === 'header' ? 'th' : 'td'
              return (
                <Tag
                  key={index}
                  className={`px-6 py-4 text-left text-sm ${
                    node.headerState === 'header'
                      ? 'bg-gray-50 font-semibold uppercase tracking-wider text-gray-900'
                      : 'whitespace-nowrap text-gray-700'
                  }`}
                >
                  {serializedChildren}
                </Tag>
              )
            }

            default:
              return null
          }
        }
      })}
    </Fragment>
  )
}
