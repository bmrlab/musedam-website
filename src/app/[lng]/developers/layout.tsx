import type { ReactNode } from 'react'
import { getDeveloperGroups, getDeveloperNavigation } from '@/data/developers'
import { localizeDeveloperText } from '@/data/developers/localize'

import { DeveloperSidebar } from '@/components/Developers/Sidebar'

import './developers.css'

export default async function DevelopersLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lng: string }>
}) {
  const { lng } = await params
  return (
    <div className="dev-shell">
      <a className="dev-skip" href="#developer-content">
        {lng === 'en-US' ? 'Skip to content' : localizeDeveloperText('跳转到正文', lng)}
      </a>
      <DeveloperSidebar
        lng={lng}
        items={getDeveloperNavigation(lng)}
        groups={getDeveloperGroups(lng)}
      />
      <main id="developer-content" className="dev-main">
        {children}
      </main>
    </div>
  )
}
