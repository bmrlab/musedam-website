'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/utilities/cn'
import HeaderDesktop from '@/components/Header/desktop'
import HeaderMobile from '@/components/Header/mobile'
import { useWindowScroll } from 'react-use'

export function Header({ isGlobal }: { isGlobal: boolean }) {
  const [user, setUser] = useState<any>(null)
  const [isPricingAiPage, setIsPricingAiPage] = useState(false)

  const newHeaderPath = ['', '/', '/enterprise/pricing', '/enterprise/quotation']

  const isEnterprisePage = useMemo(() => newHeaderPath.includes(window.location.pathname.replace('/en-US', '').replace('/zh-CN', '')), [window.location.pathname])

  useEffect(() => {
    // Check if we're on the pricing/ai page
    setIsPricingAiPage(window.location.pathname.includes('/pricing/ai'))

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
        'border-b border-[#EBECEE] bg-white/90 ',
        isEnterprisePage && (scrollTop > 0 ? '' : 'border-none bg-[#070707] text-white')
      )}
    >
      <HeaderDesktop
        className="hidden md:flex"
        hideMenu={isPricingAiPage}
        user={user}
        isGlobal={isGlobal}
        isEnterprisePage={isEnterprisePage}
        showDarkLogo={isEnterprisePage && scrollTop === 0}
      />
      <HeaderMobile className="flex md:hidden" user={user} isGlobal={isGlobal} />
    </nav>
  )
}
