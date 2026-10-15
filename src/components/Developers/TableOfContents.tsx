'use client'

import { useEffect, useState } from 'react'
import { localizeDeveloperText } from '@/data/developers/localize'

type Heading = { id: string; title: string; level: number }
export function TableOfContents({ headings, lng }: { headings: Heading[]; lng: string }) {
  const [active, setActive] = useState(headings[0]?.id ?? '')
  useEffect(() => {
    setActive(headings[0]?.id ?? '')
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-100px 0px -65% 0px', threshold: 0 },
    )
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    const openDetailsAndScroll = (hash: string, smooth: boolean) => {
      if (!hash || !hash.startsWith('#') || hash === '#') return false
      let id = hash.slice(1)
      try {
        id = decodeURIComponent(id)
      } catch {
        // Keep raw hash id if decoding fails
      }
      const target = document.getElementById(id)
      if (!target) return false

      let el: HTMLElement | null = target
      while (el) {
        if (el.tagName === 'DETAILS') {
          ;(el as HTMLDetailsElement).open = true
        }
        el = el.parentElement
      }

      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
      return true
    }

    if (window.location.hash) {
      openDetailsAndScroll(window.location.hash, false)
    }

    const handleHashChange = () => {
      openDetailsAndScroll(window.location.hash, false)
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }
      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      if (openDetailsAndScroll(href, true)) {
        event.preventDefault()
        if (window.location.hash !== href) {
          window.history.pushState(null, '', href)
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    document.addEventListener('click', handleDocumentClick)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])
  return (
    <aside className="dev-toc">
      <nav aria-label={lng === 'en-US' ? 'On this page' : localizeDeveloperText('本页目录', lng)}>
        <p>{lng === 'en-US' ? 'ON THIS PAGE' : localizeDeveloperText('本页目录', lng)}</p>
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`${active === heading.id ? 'active' : ''} ${heading.level === 3 ? 'subheading' : ''}`}
            aria-current={active === heading.id ? 'location' : undefined}
            onClick={() => setActive(heading.id)}
          >
            {heading.title}
          </a>
        ))}
      </nav>
      <div className="dev-toc-help">
        <span>
          {lng === 'en-US'
            ? 'Building an integration?'
            : localizeDeveloperText('需要接入支持？', lng)}
        </span>
        <a href={`/${lng}/book-demo`}>
          {lng === 'en-US'
            ? 'Talk to our team ↗'
            : localizeDeveloperText('联系 MuseDAM 团队 ↗', lng)}
        </a>
      </div>
    </aside>
  )
}
