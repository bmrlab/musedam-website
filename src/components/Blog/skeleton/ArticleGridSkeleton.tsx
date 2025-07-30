import React from 'react'
import { cn } from '@/utilities/cn'

import { ArticleCardSkeleton } from './ArticleCardSkeleton'

interface ArticleGridSkeletonProps {
  className?: string
  count?: number
}

export const ArticleGridSkeleton: React.FC<ArticleGridSkeletonProps> = ({
  className,
  count = 9,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 gap-x-[30px] gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
