'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/utilities/useDebounce'
import { HelpDocument } from '@/payload-types'
import { useLanguage } from '@/providers/Language'
import { useHelpCenterTranslation } from '@/app/i18n/client'

interface SearchResult {
    id: number
    title: string
    slug: string
    excerpt?: string | null
    category?: {
        id: number
        title: string
        topic?: {
            id: number
            title: string
        }
    } | null
}

export const HelpCenterSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const { language } = useLanguage()
    const { t } = useHelpCenterTranslation()
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    // 从URL参数初始化搜索词
    useEffect(() => {
        const q = searchParams?.get('q')
        if (q) {
            setSearchTerm(q)
        }
    }, [searchParams])

    // 搜索逻辑
    useEffect(() => {
        if (debouncedSearchTerm.trim().length === 0) {
            setResults([])
            setShowResults(false)
            return
        }

        const performSearch = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/help/search?q=${encodeURIComponent(debouncedSearchTerm)}`)
                if (response.ok) {
                    const data = await response.json()
                    setResults(data.results || [])
                    setShowResults(true)
                } else {
                    setResults([])
                }
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        performSearch()
    }, [debouncedSearchTerm])

    // 点击外部关闭搜索结果
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // 处理搜索提交
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(`/${language}/help/search?q=${encodeURIComponent(searchTerm.trim())}`)
            setShowResults(false)
        }
    }

    // 处理结果点击
    const handleResultClick = (result: SearchResult) => {
        router.push(`/${language}/help/article/${result.slug}`)
        setShowResults(false)
        setSearchTerm('')
    }

    // 清空搜索
    const clearSearch = () => {
        setSearchTerm('')
        setResults([])
        setShowResults(false)
    }

    return (
        <div className="relative w-[800px] max-w-full" ref={searchRef}>
            <form onSubmit={handleSearch}>
                <div className="relative">
                    <Input
                        type="text"
                        placeholder={t('search.placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => {
                            if (results.length > 0) setShowResults(true)
                        }}
                        className="h-[60px] w-full rounded-full border-[3px] border-[#EBECEE] pr-20 font-mono text-base"
                    />

                    {/* 清空按钮 */}
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-[65px] top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 text-gray-600 transition-colors hover:bg-gray-400"
                        >
                            <X className="size-4" />
                        </button>
                    )}

                    {/* 搜索按钮 */}
                    <button
                        type="submit"
                        className="absolute right-[5px] top-1/2 flex size-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-[#141414] text-white transition-colors hover:bg-gray-800"
                    >
                        <Search className="size-[18px]" />
                    </button>
                </div>
            </form>

            {/* 搜索结果下拉框 */}
            {showResults && (
                <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            <div className="mx-auto size-6 animate-spin rounded-full border-b-2 border-gray-900"></div>
                            <p className="mt-2">{t('search.searching')}</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            {results.map((result) => (
                                <div
                                    key={result.id}
                                    onClick={() => handleResultClick(result)}
                                    className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="line-clamp-2 text-sm font-medium text-gray-900">
                                                {result.title}
                                            </h4>
                                            {result.excerpt && (
                                                <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                                    {result.excerpt}
                                                </p>
                                            )}
                                            {result.category && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    {result.category.topic && (
                                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                                            {result.category.topic.title}
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                                        {result.category.title}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <Search className="mt-1 size-4 shrink-0 text-gray-400" />
                                    </div>
                                </div>
                            ))}

                            {/* 查看更多结果 */}
                            <div className="border-t border-gray-200 px-4 py-3">
                                <button
                                    onClick={() => {
                                        router.push(`/${language}/help/search?q=${encodeURIComponent(searchTerm.trim())}`)
                                        setShowResults(false)
                                    }}
                                    className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    {t('search.viewAllResults')} ({results.length})
                                </button>
                            </div>
                        </div>
                    ) : searchTerm.trim() && !isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            <p>{t('search.noResults')}</p>
                            <p className="mt-1 text-sm">{t('search.noResultsSuggestion')}</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
} 