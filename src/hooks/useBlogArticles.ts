'use client'

import { useCallback, useState, useTransition } from 'react'
import { getBlogArticles } from '@/data/blog'
import type { Post } from '@/payload-types'
import { useLanguage } from '@/providers/Language'
import { convertLngToPayloadLocale } from '@/utilities/localeMapping'

interface UseBlogArticlesOptions {
  initialData?: Post[]
  initialTotalPages?: number
  initialCurrentPage?: number
}

export function useBlogArticles(options: UseBlogArticlesOptions = {}) {
  const { language } = useLanguage()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)
  const [articles, setArticles] = useState<Post[]>(options.initialData || [])
  const [totalPages, setTotalPages] = useState(options.initialTotalPages || 1)
  const [currentPage, setCurrentPage] = useState(options.initialCurrentPage || 1)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = useCallback(
    async (categories: string[], page: number = 1) => {
      setIsLoading(true)
      setError(null)

      try {
        const payloadLocale = convertLngToPayloadLocale(language as string)

        const result = await getBlogArticles(payloadLocale, categories, page, 9)

        setArticles(result.docs as Post[])
        setTotalPages(result.totalPages || 1)
        setCurrentPage(result.page ? parseInt(result.page.toString()) : 1)
      } catch (err) {
        setError('Failed to fetch articles')
        console.error('Error fetching articles:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [language],
  )

  const updateArticles = useCallback(
    (categories: string[], page: number = 1) => {
      startTransition(async () => {
        await fetchArticles(categories, page)
      })
    },
    [fetchArticles],
  )

  return {
    articles,
    totalPages,
    currentPage,
    isLoading: isLoading || isPending,
    error,
    updateArticles,
    setCurrentPage,
  }
}
