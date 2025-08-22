import React, { useMemo } from 'react'
import Image from 'next/image'
import type { HelpDocument as PayloadHelpDocument } from '@/payload-types'
import RichText from '../RichText'
import { HelpCenterTableOfContents } from './HelpCenterTableOfContents'
import { createUniqueHeadingId } from '@/utilities/generateHeadingId'
import './helpCenter.css'
interface HelpCenterArticleContentProps {
    document: PayloadHelpDocument
}

export const HelpCenterArticleContent: React.FC<HelpCenterArticleContentProps> = ({ document }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    // 获取作者名称
    const getAuthorName = () => {
        if (typeof document.author === 'object' && document.author?.name) {
            return document.author.name
        }
        return 'MuseDAM'
    }

    // 获取发布时间（使用 updatedAt 作为发布时间）
    const getPublishedDate = () => {
        return document.updatedAt || document.createdAt
    }

    // 生成目录数据
    const tableOfContents = useMemo(() => {
        // 根据 Payload 类型定义，content 是 Lexical 编辑器格式
        const content = document.content?.root?.children

        if (!content || !Array.isArray(content)) {
            return []
        }

        const headings: Array<{ id: string; title: string; level: number }> = []
        const usedIds: string[] = []

        const extractHeadings = (nodes: any[]) => {
            nodes.forEach((node) => {
                if (node.type === 'heading' && node.children) {
                    const level = node.tag || 1
                    const title = node.children
                        .filter((child: any) => child.text)
                        .map((child: any) => child.text)
                        .join('')
                    if (title) {
                        // 使用与RichText组件相同的ID生成逻辑
                        const id = createUniqueHeadingId(title, usedIds)
                        usedIds.push(id)
                        headings.push({ id, title, level })
                    }
                }

                if (node.children && Array.isArray(node.children)) {
                    extractHeadings(node.children)
                }
            })
        }

        extractHeadings(content)
        return headings
    }, [document.content])


    return (
        <div className="flex gap-8 relative mt-10">
            {/* 左侧目录 */}
            {tableOfContents.length > 0 && (
                <HelpCenterTableOfContents
                    items={tableOfContents}
                />
            )}

            {/* 右侧文章内容 */}
            <article className="flex-1 text-[#262626] overflow-hidden">
                {/* 文章头部 */}
                <header className="mb-10">
                    <h1 className="text-gray-90 mb-4 font-euclid text-2xl font-medium md:text-[32px] md:leading-[45px]">
                        {document.title}
                    </h1>
                    <div className="flex items-center gap-3 font-mono text-sm font-light">
                        <div className="size-12 rounded-full bg-[#141414]" />
                        <div className="flex flex-col items-start justify-between gap-2">
                            <span>Written by {getAuthorName()}</span>
                            <span>Updated on {formatDate(getPublishedDate())}</span>
                        </div>
                    </div>
                </header>

                {/* 摘要 */}
                {/* {document.excerpt && (
                    <div className="mb-8 rounded-lg bg-blue-50 p-4">
                        <p className="text-blue-800">{document.excerpt}</p>
                    </div>
                )} */}

                {/* 封面图 */}
                {document.meta?.image && typeof document.meta.image === 'object' && !!document.meta.image.url && (
                    <div className="relative mt-10 aspect-[2/1] w-full rounded-[16px] md:mt-[60px]">
                        <Image
                            src={document.meta.image.url}
                            fill
                            alt={document.meta.title ?? ''}
                            className="rounded-[16px] object-cover"
                        />
                    </div>
                )}

                {/* 文章内容 */}
                <div className="prose prose-lg max-w-none">
                    {/* 这里应该渲染富文本内容 */}
                    <div className="leading-relaxed text-gray-700">
                        <RichText
                            className="font-light font-euclidlight help-article-content"
                            content={document.content}
                            enableGutter={false}
                            enableProse={false}
                        />
                    </div>
                </div>
            </article>
        </div>
    )
} 