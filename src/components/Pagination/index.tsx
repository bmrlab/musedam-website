'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/cn'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
  basePath?: string // 新增：支持自定义路由前缀
}> = (props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { className, page, totalPages, basePath = '/posts/page' } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  // 构建 URL 的辅助函数
  const buildUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '')

    // 如果是第一页且 basePath 是 /blog/page，则跳转到 /blog
    if (pageNumber === 1 && basePath === '/blog/page') {
      const baseUrl = '/blog'
      return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
    }

    const url = `${basePath}/${pageNumber}`
    return params.toString() ? `${url}?${params.toString()}` : url
  }

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!hasPrevPage}
              onClick={() => {
                router.push(buildUrl(page - 1))
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  router.push(buildUrl(page - 1))
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              onClick={() => {
                router.push(buildUrl(page))
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  router.push(buildUrl(page + 1))
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              disabled={!hasNextPage}
              onClick={() => {
                router.push(buildUrl(page + 1))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
