'use client'

import React, { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import { SessionUser } from '@/types/user'
import Intercom, { update } from '@intercom/messenger-js-sdk'


interface LayoutContentProps {
  children: React.ReactNode
  isGlobal: boolean
  user: SessionUser | null
}

export function LayoutContent({ children, isGlobal, user }: LayoutContentProps) {
  const pathname = usePathname()
  const isQuotationPage = pathname?.includes('/quotation')
  // const { changeLocale } = useLanguage()

  const darkHeadPage = useMemo(() => !!pathname && ['', '/', '/pricing'].includes(pathname.replace('/en-US', '').replace('/zh-CN', '')), [pathname])
  const miniFooterPage = useMemo(() => !!pathname && pathname.replace('/en-US', '').replace('/zh-CN', '').startsWith('/help'), [pathname])

  // 初始化 Intercom - 只在首次挂载时初始化
  useEffect(() => {
    // 首次初始化
    const userInfo = user ? {
      user_id: user.userId,
      name: user.name,
      email: user.email,
    } : {}
    // console.log("userInfo", userInfo)
    Intercom({
      app_id: 'rfp4z61e',
      theme_mode: "dark",
      ...userInfo
    })
  }, []) // 只在首次挂载时执行

  // 当用户信息变化时，更新 Intercom 用户信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userInfo = user ? {
        user_id: user.userId,
        name: user.name,
        email: user.email,
      } : {}
      // 更新 Intercom 用户信息, 更新后就会变成 User
      try {
        update(userInfo);
      } catch (error) {
        console.error("update intercom user info failed", error)
      }
    }
  }, [user])


  return isQuotationPage ? (
    children
  ) : (
    <>
      <Header isGlobal={isGlobal} user={user} />
      <div className="flex w-full flex-col items-center justify-center pt-[56px] md:pt-[70px]">
        <NextTopLoader
          color={darkHeadPage ? "#fff" : "#000"}
          height={1}
          showSpinner={false}
        />
        {children}
      </div>
      <Footer isMini={miniFooterPage} />
    </>
  )
}