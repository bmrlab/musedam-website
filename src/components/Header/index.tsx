'use client'

import { useEffect, useMemo } from 'react'
import { cn } from '@/utilities/cn'
import HeaderDesktop from '@/components/Header/desktop'
import HeaderMobile from '@/components/Header/mobile'
import { useWindowScroll } from 'react-use'
import { usePathname } from 'next/navigation'
import { SessionUser } from '@/types/user'

export function Header({ isGlobal, user }: { isGlobal: boolean, user: SessionUser | null }) {
  const pathname = usePathname()
  const newHeaderPath = ['', '/', '/pricing', '/enterprise/quotation']
  const { y: scrollTop } = useWindowScroll()

  const isEnterprisePage = useMemo(() => !!pathname && newHeaderPath.includes(pathname.replace('/en-US', '').replace('/zh-CN', '')), [pathname])
  const isPricingAiPage = useMemo(() => !!pathname && pathname.includes('/pricing/ai'), [pathname])

  useEffect(() => {
    if (isEnterprisePage) {
      document.body.style.backgroundColor = '#070707'
    } else {
      document.body.style.backgroundColor = '#fff'
    }
  }, [isEnterprisePage])


  return (
    <nav
      className={cn(
        'fixed z-50 flex h-[56px] w-full items-center font-mono md:h-[70px] transition-all duration-300 ease-in-out border-b border-solid',
        isEnterprisePage && 'text-white backdrop-blur-md bg-[#070707]',
        isEnterprisePage && scrollTop > 70 && ' bg-black/50 border-white/20',
        isEnterprisePage && scrollTop <= 70 && 'border-transparent',
        !isEnterprisePage && (scrollTop > 0 ? 'border-[#EBECEE] bg-white/80 backdrop-blur-md' : 'border-[#EBECEE] bg-white'),
        // isEnterprisePage && (scrollTop > 0 ? '' : 'border-none bg-[#070707] text-white')
      )}
    >
      <HeaderDesktop
        className="hidden md:flex"
        hideMenu={isPricingAiPage}
        user={user}
        isGlobal={isGlobal}
        isEnterprisePage={isEnterprisePage}
        showDarkLogo={isEnterprisePage}
      />
      <HeaderMobile className="flex md:hidden" user={user} isGlobal={isGlobal} />
    </nav>
  )
}
