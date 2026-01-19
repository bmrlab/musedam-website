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

  // 初始化 Intercom - 只在首次挂载时初始化（quotation 页面不初始化）
  useEffect(() => {
    // 如果是 quotation 页面，不初始化 Intercom
    if (isQuotationPage) return

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 只在首次挂载时执行，user 信息通过 update 更新

  // 当用户信息变化时，更新 Intercom 用户信息（quotation 页面不更新）
  useEffect(() => {
    if (typeof window === 'undefined' || isQuotationPage) return

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
  }, [user, isQuotationPage])

  // 根据路由控制 Intercom 显示/隐藏
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hideIntercom = () => {
      try {
        // 通过 CSS 控制 Intercom widget 的显示/隐藏 - 隐藏所有可能的 Intercom 元素
        const selectors = [
          '#intercom-frame',
          '[data-intercom-target]',
          '.intercom-launcher',
          '.intercom-lightweight-app',
          '#intercom-container',
          '[id^="intercom"]',
          '[class*="intercom"]'
        ]

        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector)
          elements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.display = 'none'
              el.style.visibility = 'hidden'
              el.style.opacity = '0'
            }
          })
        })

        // 也尝试通过 window.Intercom API 隐藏
        if ((window as any).Intercom) {
          try {
            (window as any).Intercom('hide')
              (window as any).Intercom('shutdown')
          } catch (e) {
            // 忽略错误
          }
        }
      } catch (error) {
        console.error("hide intercom failed", error)
      }
    }

    const showIntercom = () => {
      try {
        // 显示 Intercom launcher（只显示按钮，不强制打开对话框）
        const intercomFrame = document.querySelector('#intercom-frame') as HTMLElement
        const intercomContainer = document.querySelector('[data-intercom-target]') as HTMLElement
        const intercomLauncher = document.querySelector('.intercom-launcher') as HTMLElement

        if (intercomFrame) {
          intercomFrame.style.display = ''
          intercomFrame.style.visibility = ''
          intercomFrame.style.opacity = ''
        }
        if (intercomContainer) {
          intercomContainer.style.display = ''
          intercomContainer.style.visibility = ''
          intercomContainer.style.opacity = ''
        }
        if (intercomLauncher) {
          intercomLauncher.style.display = ''
          intercomLauncher.style.visibility = ''
          intercomLauncher.style.opacity = ''
        }
      } catch (error) {
        console.error("show intercom failed", error)
      }
    }

    if (isQuotationPage) {
      // quotation 页面：立即隐藏并持续监控
      hideIntercom()

      // 使用 MutationObserver 持续隐藏新出现的 Intercom 元素
      const observer = new MutationObserver(() => {
        hideIntercom()
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      // 延迟检查，确保 Intercom widget 已加载后也能隐藏
      const timeoutId = setTimeout(hideIntercom, 500)
      const timeoutId2 = setTimeout(hideIntercom, 1000)
      const timeoutId3 = setTimeout(hideIntercom, 2000)

      return () => {
        observer.disconnect()
        clearTimeout(timeoutId)
        clearTimeout(timeoutId2)
        clearTimeout(timeoutId3)
      }
    } else {
      // 非 quotation 页面：显示 Intercom
      showIntercom()
      const timeoutId = setTimeout(showIntercom, 500)
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [isQuotationPage])


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