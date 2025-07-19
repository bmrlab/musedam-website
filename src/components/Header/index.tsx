'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@/utilities/cn'
import HeaderDesktop from '@/components/Header/desktop'
import HeaderMobile from '@/components/Header/mobile'
import { useWindowScroll } from 'react-use'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/providers/Language'
import { useCountry } from '@/providers/Country'

export function Header({ isGlobal }: { isGlobal: boolean }) {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const newHeaderPath = ['', '/', '/enterprise/quotation']
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setLanguage } = useLanguage()
  const { isInChina } = useCountry()


  const changeLocale = useCallback((lang: 'zh-CN' | 'en-US') => {
    if (!searchParams) return
    const currentParams = new URLSearchParams(searchParams)
    const queryString = currentParams.toString()
    const newPathname = pathname?.replace(/^\/(en-US|zh-CN)/, '/' + lang) || ''
    const newUrl = `${newPathname}${queryString ? `?${queryString}` : ''}`
    router.replace(newUrl)
    setLanguage(lang)
  }, [pathname, router, setLanguage, searchParams])

  const isEnterprisePage = useMemo(() => !!pathname && newHeaderPath.includes(pathname.replace('/en-US', '').replace('/zh-CN', '')), [pathname])
  const isPricingPage = useMemo(() => !!pathname && ['/pricing'].includes(pathname.replace('/en-US', '').replace('/zh-CN', '')), [pathname])
  const isPricingAiPage = useMemo(() => !!pathname && pathname.includes('/pricing/ai'), [pathname])

  useEffect(() => {
    if (!isInChina) {
      changeLocale('en-US')
    }
    // Fetch user session
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Failed to fetch user session:', error)
      }
    }
    fetchUser()
  }, [])

  const { y: scrollTop } = useWindowScroll()

  return (
    <nav
      className={cn(
        'fixed z-50 flex h-[56px] w-full items-center font-mono transition-all duration-300 ease-in-out md:h-[70px]',
        isPricingPage ? 'border-none bg-[#F0F0EA]' :
          (isEnterprisePage ? 'border-none bg-[#070707] text-white' : 'border-b border-[#EBECEE] bg-white/90 '),
        // isEnterprisePage && (scrollTop > 0 ? '' : 'border-none bg-[#070707] text-white')
      )}
    >
      <HeaderDesktop
        className="hidden md:flex"
        hideMenu={isPricingAiPage}
        user={user}
        isGlobal={isGlobal}
        isEnterprisePage={isEnterprisePage}
        showDarkLogo={isEnterprisePage && !isPricingPage}
      />
      <HeaderMobile className="flex md:hidden" user={user} isGlobal={isGlobal} />
    </nav>
  )
}
