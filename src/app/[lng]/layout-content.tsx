'use client'

import React, { useCallback, useEffect } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/providers/Language'

interface LayoutContentProps {
    children: React.ReactNode
    isGlobal: boolean
}

export function LayoutContent({ children, isGlobal }: LayoutContentProps) {
    const pathname = usePathname()
    const router = useRouter()
    const isQuotationPage = pathname?.includes('/quotation')
    const { language, setLanguage } = useLanguage()
    const searchParams = useSearchParams()

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
        console.log("isGlobal", isGlobal)
        if (isGlobal) {
            changeLocale('en-US')
        }
    }, [isGlobal])

    return isQuotationPage ? (
        children
    ) : (
        <>
            <Header isGlobal={isGlobal} />
            <div className="flex flex-col items-center justify-center w-full pt-[56px] md:pt-[70px]">
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