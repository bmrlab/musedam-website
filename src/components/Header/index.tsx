import { headers } from 'next/headers'
import { getServerSession } from '@/utilities/auth'
import { cn } from '@/utilities/cn'

import HeaderDesktop from '@/components/Header/desktop'
import HeaderMobile from '@/components/Header/mobile'

export async function Header() {
  const headersList = await headers()
  // 检查是否是 pricing/ai 页面
  const pathname = headersList.get('x-url') || headersList.get('referer') || ''

  const isPricingAiPage = pathname.includes('/pricing/ai')

  const user = await getServerSession()

  return (
    <nav
      className={cn(
        'fixed z-50 flex h-[56px] w-full items-center border-b border-[#EBECEE] bg-white/90 font-mono transition-all duration-300 ease-in-out md:h-[70px]',
      )}
    >
      <HeaderDesktop className="hidden md:flex" hideMenu={isPricingAiPage} user={user} />
      <HeaderMobile className="flex md:hidden" user={user} />
    </nav>
  )
}
