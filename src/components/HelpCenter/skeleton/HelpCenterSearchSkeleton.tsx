import React from 'react'

export const HelpCenterSearchSkeleton: React.FC = () => {
    return (
        <div className="flex min-h-screen w-full flex-col items-center">
            <div className="w-full max-w-[1440px] bg-white px-5 py-[30px] md:px-[180px] md:py-[80px]">
                {/* Search Bar Skeleton */}
                <div className='md:mb-20 flex justify-center mb-5'>
                    <div className="relative w-[800px] max-w-full">
                        <div className="h-[60px] w-full animate-pulse rounded-full border-[3px] border-[#EBECEE] bg-gray-200" />
                        <div className="absolute right-[5px] top-1/2 flex size-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-gray-300" />
                    </div>
                </div>

                {/* Breadcrumb Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </div>
                </div>

                {/* Search Results Header Skeleton */}
                <div className="mb-6 border-b border-gray-200 pb-6">
                    <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="flex items-center gap-4">
                        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                        <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
                    </div>
                </div>

                {/* Search Results List Skeleton */}
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 p-6">
                            <div className="space-y-3">
                                {/* Title */}
                                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

                                {/* Excerpt */}
                                <div className="space-y-2">
                                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                                </div>

                                {/* Category Info */}
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                                    <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                                </div>

                                {/* Update Time */}
                                <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 