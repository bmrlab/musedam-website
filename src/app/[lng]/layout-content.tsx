'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/providers/Language'
import { SessionUser } from '@/types/user'
import { useTheme } from '@/providers/Theme'

interface LayoutContentProps {
    children: React.ReactNode
    isGlobal: boolean
    user: SessionUser | null
}

export function LayoutContent({ children, isGlobal, user }: LayoutContentProps) {
    const pathname = usePathname()
    const router = useRouter()
    const isQuotationPage = pathname?.includes('/quotation')
    const { language, setLanguage } = useLanguage()
    const searchParams = useSearchParams()

    const darkHeadPage = useMemo(() => !!pathname && ['', '/'].includes(pathname.replace('/en-US', '').replace('/zh-CN', '')), [pathname])
    const changeLocale = useCallback((lang: string) => {
        if (language == lang) return
        if (!searchParams) return
        const currentParams = new URLSearchParams(searchParams)
        const queryString = currentParams.toString()
        const newPathname = pathname?.replace(/^\/(en-US|zh-CN)/, '/' + lang) || ''
        const newUrl = `${newPathname}${queryString ? `?${queryString}` : ''}`
        router.replace(newUrl)
        setLanguage(lang)
    }, [language, pathname, router, setLanguage, searchParams])

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