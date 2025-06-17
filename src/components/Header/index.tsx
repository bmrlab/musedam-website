'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/utilities/cn'
import HeaderDesktop from '@/components/Header/desktop'
import HeaderMobile from '@/components/Header/mobile'
import { useWindowScroll } from 'react-use'

export function Header({ isGlobal }: { isGlobal: boolean }) {
  const [user, setUser] = useState<any>(null)
  const [isPricingAiPage, setIsPricingAiPage] = useState(false)
  const [isEnterprisePage, setIsEnterprisePage] = useState(false)

  useEffect(() => {
    // Check if we're on the pricing/ai page
    setIsPricingAiPage(window.location.pathname.includes('/pricing/ai'))
    setIsEnterprisePage(window.location.pathname.includes('/enterprise'))

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
      <HeaderDesktop className="hidden md:flex" hideMenu={isPricingAiPage} user={user} isGlobal={isGlobal} isEnterprisePage={isEnterprisePage} />
      <HeaderMobile className="flex md:hidden" user={user} isGlobal={isGlobal} />
    </nav>
  )
}
