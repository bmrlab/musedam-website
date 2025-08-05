'use client'

import React, { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/providers/Language'
import { SessionUser } from '@/types/user'

interface LayoutContentProps {
    children: React.ReactNode
    isGlobal: boolean
    user: SessionUser | null
}

export function LayoutContent({ children, isGlobal, user }: LayoutContentProps) {
    const pathname = usePathname()
    const isQuotationPage = pathname?.includes('/quotation')
    const { changeLocale } = useLanguage()

    const darkHeadPage = useMemo(() => !!pathname && ['', '/', '/pricing'].includes(pathname.replace('/en-US', '').replace('/zh-CN', '')), [pathname])


    useEffect(() => {
        if (isGlobal) {
            changeLocale('en-US')
        }
    }, [isGlobal])

    return isQuotationPage ? (
        children
    ) : (
        <>
            <Header isGlobal={isGlobal} user={user} />
            <div className="flex flex-col items-center justify-center w-full pt-[56px] md:pt-[70px]">
                <NextTopLoader
                    color={darkHeadPage ? "#fff" : "#000"}
                    height={1}
                    showSpinner={false}
                />
                {children}
            </div>
            <Footer />
        </>
    )
} 