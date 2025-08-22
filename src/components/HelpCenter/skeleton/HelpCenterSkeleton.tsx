import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const HelpCenterSkeleton: React.FC = () => {
    return (
        <div className="flex min-h-screen w-full flex-col items-center">
            <div className="w-full max-w-[1440px] bg-white">
                {/* Hero Section Skeleton */}
                <div className="flex flex-col items-center gap-8 px-6 py-[80px] text-center">
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-96" />
                        <Skeleton className="h-6 w-80" />
                    </div>

                    <div className="relative w-full max-w-2xl">
                        <Skeleton className="h-14 w-full" />
                    </div>
                </div>

                {/* Topics Grid Skeleton */}
                <div className="px-6 py-[60px] md:p-[80px]">
                    <div className="space-y-12">
                        <div className="text-center">
                            <Skeleton className="mx-auto h-10 w-64" />
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="space-y-4">
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <div className="space-y-2">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <Skeleton key={i} className="h-4 w-full" />
                                        ))}
                                    </div>
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 