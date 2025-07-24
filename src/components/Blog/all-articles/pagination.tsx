import { useMemo } from 'react'
import { cn } from '@/utilities/cn'
import { cva } from 'class-variance-authority'

import Icons from '@/components/icon'

const iconContainerVariants = cva(
  'flex size-9 cursor-pointer items-center justify-center rounded-[6px] transition duration-300 hover:bg-[#F7F9FC] [&>svg]:size-6',
  {
    variants: {
      isActive: {
        true: 'text-black',
        false: 'cursor-not-allowed text-[#999] hover:bg-transparent',
      },
      single: {
        true: '[&>svg]:size-[14px]',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
)

export function AllArticlesPagination({
  currentPage,
  totalPages,
  gotoPrevPage,
  gotoNextPage,
  gotoFirstPage,
  gotoLastPage,
}: {
  currentPage: number
  totalPages: number
  gotoPrevPage: () => void
  gotoNextPage: () => void
  gotoFirstPage: () => void
  gotoLastPage: () => void
}) {
  const canGotoPrev = useMemo(() => currentPage > 1, [currentPage])
  const canGotoNext = useMemo(() => currentPage < totalPages, [currentPage, totalPages])

  return (
    <div className="mt-10 flex items-center justify-center">
      <div
        className={cn(iconContainerVariants({ isActive: canGotoPrev }))}
        onClick={canGotoPrev ? gotoFirstPage : undefined}
      >
        <Icons.doubleLeft />
      </div>
      <div
        className={cn(iconContainerVariants({ isActive: canGotoPrev, single: true }))}
        onClick={canGotoPrev ? gotoPrevPage : undefined}
      >
        <Icons.left />
      </div>
      <p className="flex w-[94px] cursor-default items-center justify-center">
        {currentPage}/{totalPages}
      </p>
      <div
        className={cn(iconContainerVariants({ isActive: canGotoNext, single: true }))}
        onClick={canGotoNext ? gotoNextPage : undefined}
      >
        <Icons.right />
      </div>
      <div
        className={cn(iconContainerVariants({ isActive: canGotoNext }))}
        onClick={canGotoNext ? gotoLastPage : undefined}
      >
        <Icons.doubleRight />
      </div>
    </div>
  )
}
