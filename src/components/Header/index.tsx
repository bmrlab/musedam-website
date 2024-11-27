'use client'

import HeaderDesktop from '@/components/Header/desktop'
import HeaderMobile from '@/components/Header/mobile'

export default function Header() {
  return (
    <nav className="fixed z-50 flex h-[56px] w-full items-center border-b border-black bg-white font-mono md:h-[70px]">
      <HeaderDesktop className="hidden md:flex" />
      <HeaderMobile className="flex md:hidden" />
    </nav>
  )
}
