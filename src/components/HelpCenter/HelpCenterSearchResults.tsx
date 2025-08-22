'use client'

import React from 'react'
import { Search, FileText, Tag, Folder } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { HelpDocument } from '@/payload-types'
import { LocaleLink } from '../LocalLink'
import { useHelpCenterTranslation } from '@/app/i18n/client'

interface SearchResultProps {
    results: HelpDocument[]
    query: string
    total: number
}

export const HelpCenterSearchResults: React.FC<SearchResultProps> = ({ results, query, total }) => {
    const router = useRouter()
    const { t } = useHelpCenterTranslation()

    const handleResultClick = (result: HelpDocument) => {
        router.push(`/help/article/${result.slug}`)
    }

    const getCategoryInfo = (result: HelpDocument) => {
        if (!result.category) return null

        if (typeof result.category === 'object') {
            return {
                id: result.category.id,
                title: result.category.title,
                topic: result.category.topic ?
                    (typeof result.category.topic === 'object' ? result.category.topic.title : undefined) :
                    undefined
            }
        }

        return null
    }

    if (results.length === 0) {
        return (
            <div className="py-20 text-center">
                <Search className="mx-auto mb-4 size-16 text-gray-300" />
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                    {t('searchResults.noResults.title')}
                </h2>
                <p className="mb-6 text-gray-600">
                    {t('searchResults.noResults.description', { query })}
                </p>
                <div className="space-y-3">
                    <p className="text-sm text-gray-500">{t('searchResults.noResults.suggestions')}</p>
                    <ul className="space-y-1 text-sm text-gray-500">
                        {(t('searchResults.noResults.suggestionsList', { returnObjects: true }) as string[]).map((suggestion, index) => (
                            <li key={index}>• {suggestion}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 搜索结果头部 */}
            <div className="border-b border-gray-200 pb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    {t('searchResults.header.title')}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                        <Search className="size-5" />
                        <span>{t('searchResults.header.keyword', { query })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="size-5" />
                        <span>{t('searchResults.header.foundCount', { count: total })}</span>
                    </div>
                </div>
            </div>

            {/* 搜索结果列表 */}
            <div className="space-y-4">
                {results.map((result) => {
                    const categoryInfo = getCategoryInfo(result)

                    return (
                        <LocaleLink
                            key={result.id}
                            href={`/help/article/${result.slug}`}
                        >
                            <div
                                className="group cursor-pointer rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                            >
                                <div className="space-y-3">
                                    {/* 标题 */}
                                    <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                                        {result.title}
                                    </h3>

                                    {/* 摘要 */}
                                    {result.excerpt && (
                                        <p className="line-clamp-3 text-gray-600">
                                            {result.excerpt}
                                        </p>
                                    )}

                                    {/* 分类信息 */}
                                    {categoryInfo && (
                                        <div className="flex items-center gap-3 pt-2">
                                            {categoryInfo.topic && (
                                                <div className="flex items-center gap-2">
                                                    <Tag className="size-4 text-blue-500" />
                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                        {categoryInfo.topic}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Folder className="size-4 text-gray-500" />
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                    {categoryInfo.title}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* 更新时间 */}
                                    <div className="pt-2 text-xs text-gray-400">
                                        {t('searchResults.lastUpdated', { date: new Date(result.updatedAt).toLocaleDateString() })}
                                    </div>
                                </div>
                            </div>
                        </LocaleLink>
                    )
                })}
            </div>

            {/* 分页提示 */}
            {total > results.length && (
                <div className="border-t border-gray-200 py-8 text-center">
                    <p className="mb-4 text-gray-600">
                        {t('searchResults.pagination.showing', { showing: results.length, total })}
                    </p>
                    <p className="text-sm text-gray-500">
                        {t('searchResults.pagination.tip')}
                    </p>
                </div>
            )}
        </div>
    )
} 