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
import { cn } from '@/utilities/cn'
import { createUniqueHeadingId } from '@/utilities/generateHeadingId'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from '@payloadcms/richtext-lexical'

import { CMSLink } from '@/components/Link'

import { AdaptiveTable } from './AdaptiveTable'
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
  | SerializedTableNode
  | SerializedTableCellNode
  | SerializedTableRowNode
  | { type: 'divider' }
  | { type: 'horizontalrule' }
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

type Props = {
  nodes: NodeTypes[]
  usedHeadingIds?: string[]
}

// 从节点中提取文本内容
function extractTextFromNode(node: NodeTypes): string {
  if (node.type === 'text') {
    return node.text || ''
  }
  if ('children' in node && node.children) {
    return node.children.map((child) => extractTextFromNode(child as NodeTypes)).join('')
  }
  return ''
}

function isTableCellEmpty(cell: SerializedTableCellNode): boolean {
  if (!Array.isArray(cell.children) || cell.children.length === 0) return true
  return cell.children.every((child) => extractTextFromNode(child as NodeTypes).trim().length === 0)
}

export function serializeLexical({ nodes, usedHeadingIds = [] }: Props): JSX.Element {
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
              <strong className="!font-euclid font-semibold" key={index}>
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
          if (!('children' in node) || node.children == null) {
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
            return serializeLexical({ nodes: node.children as NodeTypes[], usedHeadingIds })
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
              return <BannerBlock className="mb-8 [&_p]:mb-0" key={index} {...block} />
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
                  className="mb-3 mt-0 font-euclid text-[18px] font-normal leading-[1.65] text-[#242424]"
                  key={index}
                >
                  {serializedChildren}
                </p>
              )
            }
            case 'heading': {
              const Tag = node?.tag
              const headingClasses = {
                h1: '!font-euclid text-[40px] font-semibold leading-[1.25] text-[#242424]',
                h2: '!font-euclid text-[32px] font-semibold leading-[1.25] text-[#242424]',
                h3: '!font-euclid text-[24px] font-semibold leading-[1.25] text-[#242424]',
                h4: '!font-euclid text-[20px] font-semibold leading-[1.25] text-[#242424]',
                h5: '!font-euclid text-[18px] font-semibold leading-[1.25] text-[#242424]',
              }

              // 生成标题 ID
              const headingText = extractTextFromNode(node)
              const headingId = createUniqueHeadingId(headingText, usedHeadingIds)
              usedHeadingIds.push(headingId)

              return (
                <Tag
                  id={headingId}
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
                  ? 'list-decimal list-inside my-0'
                  : 'list-disc list-inside my-0'
              return (
                <Tag className={listClasses} key={index}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'listitem': {
              const children =
                'children' in node && Array.isArray(node.children) ? (node.children as NodeTypes[]) : []
              const hasNestedList = children.some((child) => child?.type === 'list')
              const normalizedChildren = hasNestedList
                ? children.filter((child) => {
                  if (child?.type !== 'paragraph') return true
                  return extractTextFromNode(child).trim().length > 0
                })
                : children
              const listItemContent = normalizedChildren.length
                ? serializeLexical({ nodes: normalizedChildren, usedHeadingIds })
                : serializedChildren
              const hasVisibleText = normalizedChildren.some((child) => {
                if (child?.type === 'list') return false
                return extractTextFromNode(child).trim().length > 0
              })
              const hideMarkerClass = hasNestedList && !hasVisibleText ? 'list-none' : ''

              if (node?.checked != null) {
                return (
                  <li
                    aria-checked={node.checked ? 'true' : 'false'}
                    className={`flex items-center gap-2 ${hideMarkerClass} ${node.checked ? 'text-gray-500 line-through' : ''}`}
                    key={index}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                    role="checkbox"
                    tabIndex={-1}
                    value={node?.value}
                  >
                    <input type="checkbox" checked={node.checked} readOnly className="mr-2" />
                    {listItemContent}
                  </li>
                )
              } else {
                return (
                  <li key={index} value={node?.value} className={`my-0 font-euclid text-[18px] font-normal leading-[1.65] text-[#242424] ${hideMarkerClass}`}>
                    {listItemContent}
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

              // 处理锚点链接 - 检查 URL 是否以 # 开头
              if (fields.url && fields.url.startsWith('#')) {
                return (
                  <a
                    key={index}
                    href={fields.url}
                    className="anchor-link text-[#3366FF] hover:underline"
                    data-anchor={fields.url}
                  >
                    {serializedChildren}
                  </a>
                )
              }

              // 处理普通链接
              return (
                <CMSLink
                  key={index}
                  newTab={Boolean(fields?.newTab)}
                  reference={fields.doc as any}
                  type={fields.linkType === 'internal' ? 'reference' : 'custom'}
                  url={fields.url}
                  className="text-[#3366FF]"
                >
                  {serializedChildren}
                </CMSLink>
              )
            }
            case 'divider':
            case 'horizontalrule': {
              return <div className="my-8 h-px bg-[#E3E3E3]" key={index} />
            }
            case 'table': {
              return (
                <AdaptiveTable key={index}>
                  <tbody>
                    {node.children?.map((rowNode: SerializedTableRowNode, rowIndex) => {
                      if (rowNode.type === 'tablerow') {
                        // 如果第一个单元格有内容且其他单元格为空，则作为标题行
                        if (rowIndex === 0) {
                          // 检查是否是第一行且第一个单元格有内容（作为标题行）
                          const firstCell = rowNode.children?.[0] as SerializedTableCellNode
                          // 检查其他单元格是否为空
                          const hasMergedCells = rowNode.children?.some((cell: SerializedTableCellNode) => {
                            const rowSpan = Number(cell.rowSpan) || 1
                            const colSpan = Number(cell.colSpan) || 1
                            return rowSpan > 1 || colSpan > 1
                          })
                          const otherCellsEmpty = rowNode.children
                            ?.slice(1)
                            .every((cell: SerializedTableCellNode) => isTableCellEmpty(cell))
                          if (otherCellsEmpty && !hasMergedCells) {
                            const titleContent = firstCell.children
                              ? serializeLexical({ nodes: firstCell.children as NodeTypes[] })
                              : ''
                            return (
                              <tr key={rowIndex} className="border-b border-[#E3E3E3]">
                                <td
                                  colSpan={rowNode.children?.length || 1}
                                  className={cn(
                                    'bg-[#F2F2F2] p-4 text-left !font-euclid',
                                    '[&>p]:mb-0 [&>p]:text-[24px]/[36px] [&>p]:font-medium [&>p]:text-[#141414]',
                                  )}
                                >
                                  {titleContent}
                                </td>
                              </tr>
                            )
                          }
                        }

                        return (
                          <tr key={rowIndex} className="border-b border-[#E3E3E3] last:border-b-0">
                            {rowNode.children?.map(
                              (cellNode: SerializedTableCellNode, cellIndex) => {
                                if (cellNode.type === 'tablecell') {
                                  // export const TableCellHeaderStates = {
                                  //   NO_STATUS: 0,    // 普通单元格，不是表头
                                  //   ROW: 1,          // 行表头
                                  //   COLUMN: 2,       // 列表头
                                  //   BOTH: 3,         // 既是行表头又是列表头
                                  // };

                                  const Tag =
                                    cellNode.headerState === 2 ||
                                      cellNode.headerState === 1 ||
                                      cellNode.headerState === 3
                                      ? 'th'
                                      : 'td'
                                  return (
                                    <Tag
                                      key={cellIndex}
                                      rowSpan={
                                        Number(cellNode.rowSpan) > 1 ? Number(cellNode.rowSpan) : undefined
                                      }
                                      colSpan={
                                        Number(cellNode.colSpan) > 1 ? Number(cellNode.colSpan) : undefined
                                      }
                                      className={cn(
                                        'max-w-[400px] break-words border-r border-[#E3E3E3] p-4 text-left !font-euclid text-[14px] font-normal leading-5 text-[#262626] last:border-r-0',
                                        '[&>p]:mb-0 [&>p]:text-[14px]/[20px] [&>p]:font-normal [&>p]:text-[#262626]',
                                        rowIndex === 0 && 'bg-[#F2F2F2]',
                                      )}
                                    >
                                      {cellNode.children
                                        ? serializeLexical({
                                          nodes: cellNode.children as NodeTypes[],
                                        })
                                        : ''}
                                    </Tag>
                                  )
                                }
                                return null
                              },
                            )}
                          </tr>
                        )
                      }
                      return null
                    })}
                  </tbody>
                </AdaptiveTable>
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
