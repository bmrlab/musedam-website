'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'

interface LayoutContentProps {
    children: React.ReactNode
    isGlobal: boolean
}

export function LayoutContent({ children, isGlobal }: LayoutContentProps) {
    const pathname = usePathname()
    const isQuotationPage = pathname?.includes('/quotation')

    return isQuotationPage ? (
        children
    ) : (
        <>
            <Header isGlobal={isGlobal} />
            <div className="flex flex-col items-center justify-center pt-[56px] md:pt-[70px]">
                <NextTopLoader
                    color="#000"
                    height={1}
                    showSpinner={false}
                />
                {children}
            </div>
            <Footer />
        </>
    )
} 