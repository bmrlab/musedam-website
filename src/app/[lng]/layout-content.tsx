/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2025-06-24 17:21:38
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2025-07-17 15:56:26
 * @FilePath: /musedam-website/src/app/[lng]/layout-content.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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